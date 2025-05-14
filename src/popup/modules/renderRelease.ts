import {
  getDiscogsSearchAllUrl,
  getSearchDiscogsArtistUrl,
  getSearchDiscogsReleaseUrl
} from '../../discogs/modules/discogs';
import { Release } from '../../app/release';
import { setBackgroundImage } from '../helpers';
import { render } from '../../utils/render';
import { setupBtnToDownloadReleasesAsCsv } from '../tabs/download_tab';
import { History } from '../../types';
import {
  getBandcampSearchArtistUrl,
  getBandcampSearchReleaseAllUrl,
  getBandcampSearchReleaseUrl,
  keywordsToDiscogsStyles
} from '../../bandcamp/modules/bandcamp';
import { Track } from '../../app/track';
import { debug } from '../../utils/console';
import {
  capitalizeEachWord,
  removeLeadingZeroOrColon
} from '../../utils/string';

export function renderReleaseCard(
  release: Release,
  history: History,
  releaseCardTemplate: HTMLElement | null,
  element: HTMLElement
): void {
  if (!releaseCardTemplate) return;

  setBackgroundImage(
    document.querySelector('.bg-image') as HTMLElement,
    release.image
  );

  const tracks = release.tracks.map(
    (track: Track) =>
      `${track.num}. ${capitalizeEachWord(track.displayName)} (${removeLeadingZeroOrColon(track.time.value)})`
  );
  const releaseHistory = history
    .map((date: Date) => dateToTemplate(date))
    .reverse();
  const published = dateToTemplate(release.published);
  const modified = dateToTemplate(release.modified);
  const releaseLinks = {
    bandcamp: {
      artistUrl: release.artistUrl,
      releaseUrl: release.url,
      searchArtistUrl: getBandcampSearchArtistUrl(release.artist.toString()),
      searchReleaseUrl: getBandcampSearchReleaseUrl(
        release.artist.toString(),
        release.title
      ),
      searchAllUrl: getBandcampSearchReleaseAllUrl(
        release.artist.toString(),
        release.title
      )
    },
    discogs: {
      searchArtistUrl: getSearchDiscogsArtistUrl(release.artist),
      searchReleaseUrl: getSearchDiscogsReleaseUrl(
        release.artist,
        release.title
      ),
      searchAllUrl: getDiscogsSearchAllUrl(release.artist + ' ' + release.title)
    }
  };
  const styles = keywordsToDiscogsStyles(release.keywords);
  debug('RenderReleaseCard');
  debug('release', release);
  render(releaseCardTemplate, element, {
    release,
    tracks,
    history: releaseHistory,
    styles,
    modified,
    published,
    releaseLinks
  });

  setupBtnToDownloadReleasesAsCsv(
    element.querySelector('#downloadReleaseCsv') as HTMLElement,
    [release]
  );

  const releaseArtist = element.querySelector('#release-artist') as HTMLElement;
  const releaseTitle = element.querySelector('#release-title') as HTMLElement;
  const countArtistLines = countLinesInHtmlElement(releaseArtist);
  const countTitleLines = countLinesInHtmlElement(releaseTitle);

  releaseArtist.classList.toggle(
    'display-6',
    countArtistLines >= 3 && countArtistLines <= 5
  );
  element.className = 'lines-a' + countArtistLines + '-t' + countTitleLines;
}

function dateToTemplate(date: Date): {
  localeString: string;
  isoString: string;
} {
  return {
    localeString: date.toLocaleString(),
    isoString: date.toISOString()
  };
}

function countLinesInHtmlElement(el: HTMLElement): number {
  const divHeight = el.offsetHeight;
  const lineHeight = parseInt(getComputedStyle(el).lineHeight || '0', 10);
  return Math.round(divHeight / lineHeight);
}
