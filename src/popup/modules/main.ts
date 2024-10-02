import { Release } from '../../app/release';
import { click, hide, show } from '../../utils/html';
import { setupReleaseTab } from '../tabs/release_tab';

export function showReleaseTab(release: Release) {
  const btnReleaseTab = getReleaseTabElement();
  const btnReleasesTab = getReleasesTabElement();
  const releaseElement = document.getElementById('release');
  const btnDownloadRelease = document.getElementById('downloadRelease');
  const btnDiscogsSearchArtist = document.getElementById('discogsSearchArtist');

  if (!btnReleaseTab) {
    return;
  }

  hide(btnReleasesTab);
  show(btnReleaseTab);
  click(btnReleaseTab);

  if (!releaseElement || !btnDownloadRelease || !btnDiscogsSearchArtist) {
    return;
  }

  setupReleaseTab(
    releaseElement,
    release,
    btnDownloadRelease,
    btnDiscogsSearchArtist
  );
}

function getReleaseTabElement(): HTMLElement | null {
  return document.getElementById('release-tab');
}

function getReleasesTabElement(): HTMLElement | null {
  return document.getElementById('releases-tab');
}
