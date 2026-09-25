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
  const ref = normalizeWords(reference);
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

/** Reduces an MDX lesson to its readable text: prose plus the text of attributes learners see. */
export function stripMdx(source: string): string {
  return source
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/^(import|export)\s.*$/gm, '')
    .replace(/<[^>]+>/g, (tag) => {
      const texts = [...tag.matchAll(READABLE_ATTRS)].map((m) => `${m[1]}.`);
      return ` ${texts.join(' ')} `;
    })
    .replace(/[*_`#>]/g, '');
}
