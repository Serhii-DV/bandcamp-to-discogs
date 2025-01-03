import { Track } from '../app/track';
import { Release } from '../app/release.js';
import TrackTime from '../app/trackTime.js';
import { convertNewlinesToBreaks } from './utils';

interface Schema {
  byArtist: {
    name: string;
  };
  name: string;
  publisher: {
    name: string;
  };
  datePublished: string;
  dateModified: string;
  track: {
    numberOfItems: number;
    itemListElement: {
      position: string;
      item: {
        name: string;
        duration: string;
        byArtist?: {
          name: string;
        };
      };
    }[];
  };
  mainEntityOfPage: string;
  image: string;
  keywords: string[];
  creditText: string | undefined;
}

export function createReleaseFromSchema(schema: Schema): Release {
  const artist = schema.byArtist.name;
  const title = schema.name;
  const label = schema.publisher.name;
  const datePublished = new Date(schema.datePublished);
  const dateModified = new Date(schema.dateModified);
  const tracks = schema.track.numberOfItems
    ? schema.track.itemListElement.map(
        (track) =>
          new Track(
            track.position,
            track.item.name,
            TrackTime.fromDuration(track.item.duration),
            track.item.byArtist?.name
          )
      )
    : [];
  const url = schema.mainEntityOfPage;
  const image = schema.image;
  const keywords = schema.keywords;
  const credit = convertNewlinesToBreaks(schema.creditText ?? '');

  return new Release(
    artist,
    title,
    label,
    datePublished,
    dateModified,
    tracks,
    url,
    image,
    keywords,
    credit
  );
}
