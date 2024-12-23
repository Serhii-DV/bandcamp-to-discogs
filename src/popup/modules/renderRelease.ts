import { getSearchDiscogsReleaseUrl } from '../../discogs/modules/discogs';
import { Release, Track } from '../../app/release';
import { setBackgroundImage } from '../helpers';
import {
  capitalizeEachWord,
  removeLeadingZeroOrColon
} from '../../utils/utils';
import { render } from '../../utils/render';
import { setupBtnToDownloadReleasesAsCsv } from '../tabs/download_tab';
import { History } from '../../types';
import { onClick } from '../../utils/html';
import { showLatestViewed } from './main';

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
    href: release.url.hostnameWithProtocol,
    content: release.url.subdomain,
    title: 'Open Bandcamp artist page\n' + release.url.hostnameWithProtocol
  };
  const bcReleaseLink = {
    href: release.url.toString(),
    content: release.url.pathname,
    title: 'Open Bandcamp release page\n' + release.url.toString()
  };

  render(releaseCardTemplate, element, {
    release,
    tracks,
    history: releaseHistory,
    modified,
    published,
    discogsSearchUrl,
    bcReleaseArtistLink,
    bcReleaseLink
  });

  setupBtnToDownloadReleasesAsCsv(
    element.querySelector('#downloadReleaseCsv') as HTMLElement,
    [release]
  );

  const latestViewedBtn = element.querySelector(
    '#latestViewedButton'
  ) as HTMLElement;
  onClick(latestViewedBtn, () => {
    showLatestViewed();
  });

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
