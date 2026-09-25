import { expect, test } from '@playwright/test';

const BASE = '/first-moves/';

test('every internal link and asset resolves under the base path', async ({ request }) => {
  const seen = new Set<string>();
  const queue = [BASE];
  while (queue.length > 0) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    if (!(res.headers()['content-type'] ?? '').includes('text/html')) continue;
    const html = await res.text();
    for (const m of html.matchAll(/\s(?:href|src)="([^"#]*)(?:#[^"]*)?"/g)) {
      const ref = m[1];
      if (!ref || /^(https?:|mailto:|data:)/.test(ref)) continue;
      expect(ref.startsWith(BASE), `${path} links to ${ref}`).toBe(true);
      if (!seen.has(ref)) queue.push(ref);
    }
  }
  expect(seen.size).toBeGreaterThan(5);
});

test('main pages load without script errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const path of ['./', 'course/', 'controls/', 'glossary/', 'about/', 'lessons/01-tour/']) {
    await page.goto(path);
  }
  expect(errors).toEqual([]);
});

test('the step player walks through a lesson and remembers progress', async ({ page }) => {
  await page.goto('lessons/01-tour/');
  const steps = page.locator('[data-step]');
  const count = await steps.count();
  expect(count).toBeGreaterThan(1);
  await expect(page.locator('[data-step]:visible')).toHaveCount(1);

  const checkHighlights = async (index: number) => {
    const press = (await steps.nth(index).getAttribute('data-press')) ?? '';
    const groups = press.split('|').filter(Boolean);
    const firstId = groups[0]?.split(' ')[0];
    if (firstId) {
      await expect(page.locator(`.steps [data-control="${firstId}"]`).first()).toHaveAttribute('data-active', '');
    }
    const badges = page.locator('.steps .badge');
    if (groups.length > 1) await expect(badges).not.toHaveCount(0);
    else await expect(badges).toHaveCount(0);
  };

  await checkHighlights(0);
  await page.locator('[data-next]').click();
  await expect(page.locator('[data-counter]')).toHaveText(`Step 2 of ${count}`);
  await checkHighlights(1);

  await page.reload();
  await expect(page.locator('[data-counter]')).toHaveText(`Step 2 of ${count}`);

  for (let i = 1; i < count - 1; i++) await page.locator('[data-next]').click();
  await expect(page.locator('[data-counter]')).toHaveText(`Step ${count} of ${count}`);
  await page.locator('[data-next]').click();
  await expect(page.locator('[data-done]')).toBeVisible();

  await page.goto('course/');
  await expect(page.locator('[data-lesson-link="01-tour"]')).toHaveAttribute('data-done', '');

  await page.goto('./');
  const cont = page.locator('[data-continue]');
  const lessons: { href: string }[] = JSON.parse((await cont.getAttribute('data-lessons')) ?? '[]');
  await expect(cont).toHaveAttribute('href', lessons.length > 1 ? lessons[1].href : `${BASE}course/`);
});

test('the Back button returns to the previous step', async ({ page }) => {
  await page.goto('lessons/01-tour/');
  await expect(page.locator('[data-prev]')).toBeDisabled();
  await page.locator('[data-next]').click();
  await page.locator('[data-prev]').click();
  await expect(page.locator('[data-counter]')).toHaveText(/^Step 1 of/);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('every step is readable as a list', async ({ page }) => {
    await page.goto('lessons/01-tour/');
    const steps = page.locator('[data-step]');
    const n = await steps.count();
    expect(n).toBeGreaterThan(1);
    for (let i = 0; i < n; i++) await expect(steps.nth(i)).toBeVisible();
    await expect(page.locator('[data-step-nav]')).toBeHidden();
  });
});

test.describe('at phone width', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  for (const path of ['./', 'course/', 'controls/', 'glossary/', 'about/', 'lessons/01-tour/']) {
    test(`${path} does not scroll sideways`, async ({ page }) => {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
    });
  }
});

test('the controls page highlights the tapped control and explains it', async ({ page }) => {
  await page.goto('controls/');
  const shift = page.locator('.is-interactive [data-control="shift"]');
  await shift.click();
  await expect(shift).toHaveAttribute('data-active', '');
  await expect(page.locator('#control-shift')).toHaveClass(/is-current/);

  await page.locator('.is-interactive [data-control="pad-2-3"]').click();
  await expect(page.locator('#control-pads')).toHaveClass(/is-current/);
  await expect(page.locator('#control-pads [data-picked]')).toContainText('second row, 3rd from left');
  await expect(shift).not.toHaveAttribute('data-active', '');

  await page.locator('.is-interactive [data-control="step-9"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#control-steps')).toHaveClass(/is-current/);
});

test('lessons still work when browser storage is blocked', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL });
  await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('blocked');
      },
    });
  });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('lessons/01-tour/');
  await expect(page.locator('[data-counter]')).toHaveText(/^Step 1 of/);
  await page.locator('[data-next]').click();
  await expect(page.locator('[data-counter]')).toHaveText(/^Step 2 of/);
  await page.goto('course/');
  expect(errors).toEqual([]);
  await context.close();
});

test('a lesson video loads only when clicked', async ({ page, request }) => {
  const course = await (await request.get(`${BASE}course/`)).text();
  const lessonPaths = [...course.matchAll(/href="(\/first-moves\/lessons\/[^"]+)"/g)].map((m) => m[1]);
  let found: string | undefined;
  for (const path of lessonPaths) {
    if ((await (await request.get(path)).text()).includes('data-video-play')) {
      found = path;
      break;
    }
  }
  test.skip(!found, 'No lesson has a video yet');
  await page.goto(found!);
  await expect(page.locator('.video iframe')).toHaveCount(0);
  await page.locator('[data-video-play]').first().click();
  await expect(page.locator('.video iframe').first()).toHaveAttribute('src', /youtube-nocookie\.com\/embed\//);
});
