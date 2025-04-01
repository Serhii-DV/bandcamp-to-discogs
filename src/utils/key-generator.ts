import { v5 as uuid5 } from 'uuid';

export function urlToUuid(url: string): string {
  const uuid = uuid5(url, uuid5.URL);
  // console.log(`B2D: uuid5(${url}): `, uuid);
  return uuid;
}
