import { click, createElementFromHTML, getCurrentUrl, isElementDisplayNone, isHtmlElement } from "../modules/html.js";
import { getAlbumRelease } from "../modules/schema.js";
import { addReleaseHistory } from "../modules/storage.js";
import { isObject } from "../modules/utils.js";
import { getMusicAlbumSchemaData } from "./html.js";

// Setup logic for BC albums page
export function setupPageAlbum() {
  setupReleaseCollectedByWidget();
}

function setupReleaseCollectedByWidget() {
  const musicAlbumData = getMusicAlbumSchemaData();
  const bcCollectedByContainer = document.querySelector('.collected-by');
  const collectedByMessage = bcCollectedByContainer.querySelector('.message');

  const loadingElement = createElementFromHTML('<span class="loading">Bandcamp To Discogs:<br>Calculating revenue information</span>');
  const moreWritingElement = bcCollectedByContainer.querySelector('.more-writing');
  const loadingWritingElement = bcCollectedByContainer.querySelector('.loading-writing');
  const moreThumbsElement = bcCollectedByContainer.querySelector('.more-thumbs');
  const loadingThumbsElement = bcCollectedByContainer.querySelector('.loading-thumbs');

  function outputInformation() {
    const fanElements = bcCollectedByContainer.querySelectorAll('.pic');
    const fanAmount = fanElements.length;
    let sponsoredText = `supported by <strong>${fanAmount}</strong> people.`;

    let categoryValues = {};
    categoryValues.fans = fanAmount;

    const digitalAlbumRelease = getAlbumRelease(musicAlbumData, 'DigitalFormat');
    const cdAlbumRelease = getAlbumRelease(musicAlbumData, 'CDFormat');

    if (isObject(digitalAlbumRelease)) {
      const revenue = fanAmount * digitalAlbumRelease.offers.price;
      sponsoredText += `<br>Digital format potential revenue is ${revenue} ${digitalAlbumRelease.offers.priceCurrency}.`;
      categoryValues.digitalRevenue = revenue;
    }

    if (isObject(cdAlbumRelease)) {
      const revenue = fanAmount * cdAlbumRelease.offers.price;
      sponsoredText += `<br>CD format potential revenue is ${revenue} ${cdAlbumRelease.offers.priceCurrency}.`;
      categoryValues.cdRevenue = revenue;
    }

    collectedByMessage.innerHTML = sponsoredText;
    addReleaseHistory(getCurrentUrl(), categoryValues);
  }

  function clickMoreLinks() {
    const isLoadingThumbs = isHtmlElement(loadingThumbsElement) && !isElementDisplayNone(loadingThumbsElement);
    const isLoadingWritings = isHtmlElement(loadingWritingElement) && !isElementDisplayNone(loadingWritingElement);
    const hasMoreWritings = isHtmlElement(moreWritingElement) && !isElementDisplayNone(moreWritingElement);
    const hasMoreThumbs = isHtmlElement(moreThumbsElement) && !isElementDisplayNone(moreThumbsElement);

    if (!isLoadingWritings && !isLoadingThumbs && !hasMoreWritings && !hasMoreThumbs) {
      clearInterval(intervalId);
      outputInformation();
      return;
    }

    if (!isLoadingWritings && hasMoreWritings) {
      click(moreWritingElement);
    }

    if (!isLoadingThumbs && hasMoreThumbs) {
      click(moreThumbsElement);
    }
  }

  // Show loading indicator
  collectedByMessage.innerHTML = '';
  collectedByMessage.append(loadingElement);
  const intervalId = setInterval(clickMoreLinks, 500);
}
