import {
  getDiscogsSearchAllUrl,
  getSearchDiscogsArtistUrl,
  getSearchDiscogsReleaseUrl
} from '../../discogs/modules/discogs';
import { Release, Track } from '../../app/release';
import { setBackgroundImage } from '../helpers';
import {
  capitalizeEachWord,
  removeLeadingZeroOrColon
} from '../../utils/utils';
import { render } from '../../utils/render';
import { setupBtnToDownloadReleasesAsCsv } from '../tabs/download_tab';
import { History } from '../../types';
import {
  getBandcampSearchArtistUrl,
  getBandcampSearchReleaseAllUrl,
  getBandcampSearchReleaseUrl,
  keywordsToDiscogsStyles
} from '../../bandcamp/modules/bandcamp';

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

  const discogsSearchAllUrl = getDiscogsSearchAllUrl(
    release.artist + ' ' + release.title
  );
  const discogsSearchReleaseUrl = getSearchDiscogsReleaseUrl(
    release.artist,
    release.title
  );
  const discogsSearchArtistUrl = getSearchDiscogsArtistUrl(release.artist);
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
    href: release.url.hostnameWithProtocol,
    content: release.url.subdomain
  };
  const bcReleaseLink = {
    href: release.url.toString(),
    content: release.url.pathname
  };
  const releaseLinks = {
    bandcampSearchArtistUrl: getBandcampSearchArtistUrl(release.artist),
    bandcampSearchReleaseUrl: getBandcampSearchReleaseUrl(
      release.artist,
      release.title
    ),
    bandcampSearchAllUrl: getBandcampSearchReleaseAllUrl(
      release.artist,
      release.title
    )
  };
  const styles = keywordsToDiscogsStyles(release.keywords);

  render(releaseCardTemplate, element, {
    release,
    tracks,
    history: releaseHistory,
    styles,
    modified,
    published,
    discogsSearchAllUrl,
    discogsSearchArtistUrl,
    discogsSearchReleaseUrl,
    bcReleaseArtistLink,
    bcReleaseLink,
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
