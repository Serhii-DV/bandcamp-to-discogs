import { Release, Track } from '../app/release.js';
import TrackTime from '../app/trackTime.js';

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
      };
    }[];
  };
  mainEntityOfPage: string;
  image: string;
  keywords: string[];
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
            TrackTime.fromDuration(track.item.duration)
          )
      )
    : [];
  const url = schema.mainEntityOfPage;
  const image = schema.image;
  const keywords = schema.keywords;

  return new Release(
    artist,
    title,
    label,
    datePublished,
    dateModified,
    tracks,
    url,
    image,
    keywords
  );
}
