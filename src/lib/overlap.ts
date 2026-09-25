export function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^['-]+|['-]+$/g, ''))
    .filter(Boolean);
}

/** Maximal runs of at least `n` consecutive words in `candidate` that also appear in `reference`. */
export function sharedRuns(candidate: string, reference: string, n = 8): string[] {
  // Page-number lines in the extracted manual would otherwise split runs at page breaks.
  const ref = normalizeWords(reference.replace(/^\s*\d+\s*$/gm, ' '));
  const grams = new Set<string>();
  for (let i = 0; i + n <= ref.length; i++) grams.add(ref.slice(i, i + n).join(' '));

  const words = normalizeWords(candidate);
  const hit = words.map(() => false);
  for (let i = 0; i + n <= words.length; i++) {
    if (grams.has(words.slice(i, i + n).join(' '))) for (let k = i; k < i + n; k++) hit[k] = true;
  }

  const runs: string[] = [];
  let start = -1;
  for (let i = 0; i <= words.length; i++) {
    if (i < words.length && hit[i]) {
      if (start < 0) start = i;
    } else if (start >= 0) {
      runs.push(words.slice(start, i).join(' '));
      start = -1;
    }
  }
  return runs;
}

const READABLE_ATTRS = /\b(?:see|hear|title|caption|summary)="([^"]*)"/g;
const VISIBLE_KEYS = new Set(['title', 'summary']);

const unquote = (value: string) => value.trim().replace(/^(['"])(.*)\1$/, '$2');

/** The frontmatter text learners see on the page: title, summary and the "needs" list. */
function visibleFrontmatter(frontmatter: string): string {
  const out: string[] = [];
  let inNeeds = false;
  for (const line of frontmatter.split('\n')) {
    const key = line.match(/^(\w+):\s*(.*)$/);
    if (key) {
      inNeeds = key[1] === 'needs';
      if (VISIBLE_KEYS.has(key[1]) && key[2]) out.push(`${unquote(key[2])}.`);
      continue;
    }
    const item = line.match(/^\s+-\s+(.*)$/);
    if (inNeeds && item) out.push(`${unquote(item[1])}.`);
  }
  return out.join(' ');
}

/** Reduces an MDX lesson to its readable text: visible frontmatter, prose, and attributes learners see. */
export function stripMdx(source: string): string {
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/);
  const body = frontmatter ? source.slice(frontmatter[0].length) : source;
  const text = body
    .replace(/^(import|export)\s.*$/gm, '')
    .replace(/<[^>]+>/g, (tag) => {
      const texts = [...tag.matchAll(READABLE_ATTRS)].map((m) => `${m[1]}.`);
      return ` ${texts.join(' ')} `;
    })
    .replace(/[*_`#>]/g, '');
  return `${frontmatter ? visibleFrontmatter(frontmatter[1]) : ''}\n${text}`;
}
