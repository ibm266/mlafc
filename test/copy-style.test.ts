import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const EM_DASH = '\u2014';

const SCAN_ROOTS = ['app', 'components', 'data', 'lib', 'content', 'public', 'docs'];
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.json', '.md', '.txt', '.css']);
const SCAN_FILES = ['AGENTS.md'];

function collectFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === '.next') continue;
      files.push(...collectFiles(fullPath));
      continue;
    }

    const ext = entry.slice(entry.lastIndexOf('.'));
    if (SCAN_EXTENSIONS.has(ext)) files.push(fullPath);
  }

  return files;
}

function filesToScan(): string[] {
  const files = SCAN_FILES.map((file) => join(ROOT, file));

  for (const scanRoot of SCAN_ROOTS) {
    const dir = join(ROOT, scanRoot);
    files.push(...collectFiles(dir));
  }

  return files;
}

test('no em dashes in site copy or agent-facing docs', () => {
  const offenders: string[] = [];

  for (const file of filesToScan()) {
    const content = readFileSync(file, 'utf8');
    if (content.includes(EM_DASH)) offenders.push(relative(ROOT, file));
  }

  expect(offenders).toEqual([]);
});
