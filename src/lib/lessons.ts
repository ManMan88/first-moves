import { getCollection, type CollectionEntry } from 'astro:content';

export type Lesson = CollectionEntry<'lessons'>;

export async function getLessons(): Promise<Lesson[]> {
  return (await getCollection('lessons')).sort((a, b) => a.data.order - b.data.order);
}
