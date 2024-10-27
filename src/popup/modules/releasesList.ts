import { ArtistItem } from '../../app/artistItem';
import { ReleasesList } from '../components/releases-list';
import { Release } from '../../app/release';
import {
  chromeSendMessageToCurrentTab,
  getCurrentTabUrl,
  openTabsAndClose
} from '../../utils/chrome';
import { isValidDiscogsReleaseEditUrl } from '../../discogs/app/utils';
import { createIconLink } from '../../utils/html';
import { showReleaseCardTab, showReleasesTabContent } from './main';
import { Metadata } from '../../discogs/app/metadata';
import { ReleaseItem } from '../../app/releaseItem';
import { BandcampItem } from '../../app/bandcampItem';
import { Music } from '../../app/music';

export type ArtistOrReleaseItem = ArtistItem | ReleaseItem;

export function populateReleasesList(
  releasesList: ReleasesList,
  items: ArtistOrReleaseItem[],
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
  items: ArtistOrReleaseItem[]
): ReleasesListItem[] {
  const releasesListItems: ReleasesListItem[] = [];
  const isDiscogsEditPage = isValidDiscogsReleaseEditUrl(currentTabUrl);

  items.forEach((item) => {
    const isReleaseItem = item instanceof ReleaseItem;
    const isBandcampItem = item instanceof BandcampItem;
    const controls = [];

    if (isDiscogsEditPage && isReleaseItem) {
      controls.push(createApplyMetadataLink(item));
    }

    if (isBandcampItem) {
      controls.push(createItemViewLink(item));
    }

    const id = item.uuid;
    const title = isReleaseItem
      ? `<span class="badge text-bg-success" title="Release">R</span> ${item.artist} - ${item.title}`
      : `<span class="badge text-bg-secondary" title="Artist or Label">A</span> ${item.name}`;
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

const createItemViewLink = (item: BandcampItem) =>
  createIconLink({
    href: '#view',
    iconDefault: 'card-text',
    className: 'link-view',
    title: 'View information',
    onClick: () => {
      storage.getByUuid(item.uuid).then((storageItem) => {
        if (storageItem instanceof Release) {
          showReleaseCardTab(storageItem);
        } else if (storageItem instanceof Music) {
          showReleasesTabContent(storageItem, undefined);
        } else {
          openTabsAndClose([item.url]).then(() => {
            setTimeout(() => {
              storage.getByUuid(item.uuid).then((storageItem) => {
                if (storageItem instanceof Release) {
                  showReleaseCardTab(storageItem);
                } else if (storageItem instanceof Music) {
                  showReleasesTabContent(storageItem, undefined);
                }
              });
            }, 3000);
          });
        }
      });

      return true;
    }
  });

export const createApplyMetadataLink = (item: ReleaseItem) =>
  createIconLink({
    title: 'Load release hints into the current Discogs release draft',
    iconDefault: 'file-arrow-down',
    iconOnClick: 'file-arrow-down-fill',
    onClick: () => {
      storage.getByUuid(item.uuid).then((storageItem) => {
        if (storageItem instanceof Release) {
          const metadata = Metadata.fromRelease(storageItem);
          chromeSendMessageToCurrentTab({
            type: 'B2D_METADATA',
            metadata
          });
        }
      });

      return true;
    }
  });
