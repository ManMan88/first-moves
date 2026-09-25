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

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the next step is not hidden under the sticky drawing', async ({ page }) => {
    await page.goto('lessons/02-power-and-setup/');
    const figure = page.locator('.steps-figure');
    for (let i = 0; i < 3; i++) {
      await page.locator('[data-next]').click();
      const step = page.locator('[data-step]:visible');
      await expect(step).toBeFocused();
      const figureBox = (await figure.boundingBox())!;
      const stepBox = (await step.boundingBox())!;
      expect(stepBox.y).toBeGreaterThanOrEqual(figureBox.y + figureBox.height - 1);
    }
  });
});

test.describe('step-order badges on a phone', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test('show one readable badge per action', async ({ page }) => {
    await page.goto('lessons/01-tour/');
    const steps = page.locator('[data-step]');
    const count = await steps.count();
    let checked = 0;
    for (let i = 0; i < count; i++) {
      const groups = ((await steps.nth(i).getAttribute('data-press')) ?? '').split('|').filter(Boolean);
      if (groups.length > 1) {
        const badges = page.locator('.steps .badge');
        await expect(badges).toHaveCount(groups.length);
        for (let b = 0; b < groups.length; b++) {
          const box = (await badges.nth(b).boundingBox())!;
          expect(box.height).toBeGreaterThanOrEqual(20);
        }
        checked++;
      }
      if (i < count - 1) await page.locator('[data-next]').click();
    }
    expect(checked).toBeGreaterThan(0);
  });
});

for (const viewport of [
  { width: 360, height: 640 },
  { width: 740, height: 360 },
]) {
  test.describe(`at ${viewport.width}×${viewport.height}`, () => {
    test.use({ viewport });

    test('the current step is on screen and not covered by the drawing', async ({ page }) => {
      await page.goto('lessons/02-power-and-setup/');
      const figure = page.locator('.steps-figure');
      for (let i = 0; i < 3; i++) {
        await page.locator('[data-next]').click();
        const step = page.locator('[data-step]:visible');
        await expect(step).toBeFocused();
        const f = (await figure.boundingBox())!;
        const s = (await step.boundingBox())!;
        const overlapX = Math.min(f.x + f.width, s.x + s.width) - Math.max(f.x, s.x);
        const overlapY = Math.min(f.y + f.height, s.y + s.height) - Math.max(f.y, s.y);
        expect(overlapX > 1 && overlapY > 1, 'step overlaps the drawing').toBe(false);
        expect(s.y).toBeGreaterThanOrEqual(0);
        expect(s.y).toBeLessThan(viewport.height - 40);
      }
    });
  });
}

test.describe('without JavaScript, the drawing', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

  test('does not stick over the step list', async ({ page }) => {
    await page.goto('lessons/02-power-and-setup/');
    const position = await page.locator('.steps-figure').evaluate((el) => getComputedStyle(el).position);
    expect(position).not.toBe('sticky');
  });
});

test.describe('saved progress that no longer fits', () => {
  test('a saved step past the end opens the last step', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('first-moves:v1', JSON.stringify({ v: 1, lessons: { '01-tour': { step: 99, done: false } } }));
    });
    await page.goto('lessons/01-tour/');
    const count = await page.locator('[data-step]').count();
    await expect(page.locator('[data-counter]')).toHaveText(`Step ${count} of ${count}`);
    await expect(page.locator('[data-step]:visible')).toHaveCount(1);
  });

  test('corrupt saved data starts the lesson from step 1 without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.addInitScript(() => localStorage.setItem('first-moves:v1', '{garbage'));
    await page.goto('lessons/01-tour/');
    await expect(page.locator('[data-counter]')).toHaveText(/^Step 1 of/);
    await page.goto('course/');
    await page.goto('./');
    expect(errors).toEqual([]);
  });
});

test.describe('text contrast (light mode)', () => {
  test.use({ colorScheme: 'light' });

  test('buttons, kickers and expected-result labels meet WCAG AA', async ({ page }) => {
    await page.goto('lessons/01-tour/');
    const ratios = await page.evaluate(() => {
      const rgb = (c: string) => (c.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
      const lum = (c: string) => {
        const [r, g, b] = rgb(c).map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const ratio = (a: string, b: string) => {
        const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
        return (hi + 0.05) / (lo + 0.05);
      };
      const bgOf = (el: Element): string => {
        for (let e: Element | null = el; e; e = e.parentElement) {
          const bg = getComputedStyle(e).backgroundColor;
          if (bg && !bg.startsWith('rgba(0, 0, 0, 0)') && bg !== 'transparent') return bg;
        }
        return 'rgb(255, 255, 255)';
      };
      const check = (selector: string) => {
        const el = document.querySelector(selector)!;
        return { selector, ratio: ratio(getComputedStyle(el).color, bgOf(el)) };
      };
      return [check('[data-next]'), check('.kicker'), check('.expect strong')];
    });
    for (const r of ratios) expect(r.ratio, r.selector).toBeGreaterThanOrEqual(4.5);
  });
});
