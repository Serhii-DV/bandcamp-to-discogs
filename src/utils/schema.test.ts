import { createReleaseFromSchema } from './schema';
import { Track } from '../app/track';
import { Release } from '../app/release';
import releaseSchema from '../test/schema/releaseSchema.json';

describe('createReleaseFromSchema', () => {
  it('should correctly create a Release object from a valid schema', () => {
    const release = createReleaseFromSchema(releaseSchema);

    expect(release).toBeInstanceOf(Release);
    expect(release.artist.toString()).toBe('God Body Disconnect');
    expect(release.title).toBe('Detune the Tragic Light');
    expect(release.label).toBe('Cryo Chamber');
    expect(release.published.toISOString()).toBe('2025-01-14T00:00:00.000Z');
    expect(release.modified.toISOString()).toBe('2025-01-14T16:56:42.000Z');

    expect(release.tracks).toHaveLength(9);
    expect(release.tracks[0]).toBeInstanceOf(Track);
    expect(release.tracks[0].num).toBe(1);
    expect(release.tracks[0].title).toBe('The Voice of Depression');
    expect(release.tracks[0].artist).toBe(undefined);
    expect(release.tracks[1].num).toBe(2);
    expect(release.tracks[1].title).toBe('Portraits of Possession');
    expect(release.tracks[2].artist).toBe(undefined);

    expect(release.url).toBe(
      'https://cryochamber.bandcamp.com/album/detune-the-tragic-light'
    );
    expect(release.image).toBe('https://f4.bcbits.com/img/a3461983006_10.jpg');
    expect(release.keywords).toEqual([
      'Ambient',
      'atmospheric',
      'dark ambient',
      'drone',
      'field recordings',
      'soundscapes',
      'Oregon'
    ]);
    expect(release.credit).toBe(
      'Written, Produced, Performed - Bruce Moallem<br>Artwork & Mastering - Simon Heath'
    );
  });
});
