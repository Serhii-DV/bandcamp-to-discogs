import { ArtistItem } from '../../app/artistItem';
import { ReleasesList } from '../components/releases-list';
import { Release, ReleaseItem } from '../../app/release';
import {
  chromeSendMessageToCurrentTab,
  getCurrentTabUrl,
  openTabsAndClose
} from '../../utils/chrome';
import { isValidDiscogsReleaseEditUrl } from '../../discogs/app/utils';
import { createIconLink } from '../../utils/html';
import { getReleaseByUuid } from '../../utils/storage';
import { showReleaseCardTab } from './main';
import { Metadata } from '../../discogs/app/metadata';

export type ArtistOrReleaseItem = ArtistItem | ReleaseItem;
export type ArtistOrReleaseItemArray = ArtistOrReleaseItem[];

export function populateReleasesList(
  releasesList: ReleasesList,
  items: ArtistOrReleaseItemArray,
  sortByLatestDateVisited: boolean
): void {
  getCurrentTabUrl().then((url) => {
    if (!url) return;

    releasesList.populate(
      ArtistOrReleaseItemArrayToReleaseListItems(url, items)
    );

    if (sortByLatestDateVisited) {
      releasesList.sortByLatestDateVisited();
    }
  });
}

export interface ReleasesListItem {
  id: string;
  title: string;
  visit?: Date;
  controls: HTMLAnchorElement[];
}

function ArtistOrReleaseItemArrayToReleaseListItems(
  currentTabUrl: string,
  items: ArtistOrReleaseItemArray
): ReleasesListItem[] {
  const releasesListItems: ReleasesListItem[] = [];
  const isDiscogsEditPage = isValidDiscogsReleaseEditUrl(currentTabUrl);

  items.forEach((item) => {
    const isReleaseItem = item instanceof ReleaseItem;
    const isRelease = false;
    const controls = [];

    if (isReleaseItem) {
      controls.push(createReleaseViewLink(item));
    }

    if (isDiscogsEditPage && isRelease) {
      // controls.push(createApplyMetadataLink(item));
    }

    const id = item.uuid;
    const title = isReleaseItem
      ? `${item.artist} - ${item.title}`
      : `${item.name}`;
    const visit = item.visit;

    releasesListItems.push({
      id,
      title,
      visit,
      controls
    });
  });

  return releasesListItems;
}

const createReleaseViewLink = (releaseItem: ReleaseItem) =>
  createIconLink({
    href: '#view',
    iconDefault: 'card-text',
    className: 'link-view',
    title: 'View release detailed info',
    onClick: () => {
      getReleaseByUuid(releaseItem.uuid).then((release) => {
        if (release instanceof Release) {
          showReleaseCardTab(release);
        } else {
          openTabsAndClose([releaseItem.url]).then(() => {
            setTimeout(() => {
              getReleaseByUuid(releaseItem.uuid).then((release) => {
                if (release instanceof Release) {
                  // Show release card
                  showReleaseCardTab(release);
                }
              });
            }, 3000);
          });
        }
      });
      return true;
    }
  });

export const createApplyMetadataLink = (release: Release) =>
  createIconLink({
    title: 'Load release hints into the current Discogs release draft',
    iconDefault: 'file-arrow-down',
    iconOnClick: 'file-arrow-down-fill',
    onClick: () => {
      const metadata = Metadata.fromRelease(release);
      chromeSendMessageToCurrentTab({
        type: 'B2D_METADATA',
        metadata
      });

      return true;
    }
  });
