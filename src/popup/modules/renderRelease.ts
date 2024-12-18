import { getSearchDiscogsReleaseUrl } from '../../discogs/modules/discogs';
import { Release, Track } from '../../app/release';
import { setBackgroundImage } from '../helpers';
import {
  capitalizeEachWord,
  removeLeadingZeroOrColon
} from '../../utils/utils';
import { getUrlHostnameUrl, getUrlSubdomain } from '../../utils/url';
import { render } from '../../utils/render';
import { setupBtnToDownloadReleasesAsCsv } from '../tabs/download_tab';
import { History } from '../../types';

export function renderReleaseCard(
  release: Release,
  history: History,
  element: HTMLElement
): void {
  setBackgroundImage(
    document.querySelector('.bg-image') as HTMLElement,
    release.image
  );

  const discogsSearchUrl = getSearchDiscogsReleaseUrl(
    release.artist,
    release.title
  );
  const tracks = release.tracks.map(
    (track: Track) =>
      `${track.num}. ${capitalizeEachWord(track.title)} (${removeLeadingZeroOrColon(track.time.value)})`
  );
  const releaseHistory = history
    .map((date: Date) => dateToTemplate(date))
    .reverse();
  const published = dateToTemplate(release.published);
  const modified = dateToTemplate(release.modified);
  const bcReleaseArtistLink = {
    href: getUrlHostnameUrl(release.url),
    content: getUrlSubdomain(release.url),
    title: 'Open Bandcamp artist page\n' + getUrlHostnameUrl(release.url)
  };
  const bcReleaseLink = {
    href: release.url,
    content: 'release',
    title: 'Open Bandcamp release page\n' + release.url
  };

  render(
    document.getElementById('releaseCardTemplate') as HTMLElement,
    element,
    {
      release,
      tracks,
      history: releaseHistory,
      modified,
      published,
      discogsSearchUrl,
      bcReleaseArtistLink,
      bcReleaseLink
    }
  );

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
