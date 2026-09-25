import { describe, expect, it } from 'vitest';
import { pickContinue } from '../../src/scripts/lesson-status';

const lessons = ['01', '02', '03', '04'].map((id) => ({ id, href: `/l/${id}/`, title: `Lesson ${id}` }));
const done = { step: 0, done: true };
const started = { step: 2, done: false };

describe('pickContinue', () => {
  it('returns to the lesson you were in the middle of, even if you skipped one', () => {
    expect(pickContinue(lessons, { '01': done, '03': started }, '03')?.id).toBe('03');
  });
  it('moves on to the next unfinished lesson after the one you just finished', () => {
    expect(pickContinue(lessons, { '01': done, '03': done }, '03')?.id).toBe('04');
  });
  it('wraps around to an earlier unfinished lesson when everything after is done', () => {
    expect(pickContinue(lessons, { '01': done, '03': done, '04': done }, '04')?.id).toBe('02');
  });
  it('falls back to the first unfinished lesson without a last lesson', () => {
    expect(pickContinue(lessons, { '01': done }, null)?.id).toBe('02');
  });
  it('ignores a last lesson that no longer exists', () => {
    expect(pickContinue(lessons, {}, '99')?.id).toBe('01');
  });
  it('returns null when every lesson is done', () => {
    expect(pickContinue(lessons, { '01': done, '02': done, '03': done, '04': done }, '04')).toBeNull();
  });
});
