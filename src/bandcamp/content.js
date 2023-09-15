'use strict';

let TralbumData, BandData = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let response;

  if (request.type === 'getBandcampData') {
    if (isOnReleasesListPage()) {
      sendResponse(generateListResponse());
    } else {
      const currentTabUrl = window.location.href;
      chrome.storage.local.get([currentTabUrl], (result) => {
        if (result[currentTabUrl] && result[currentTabUrl]['release']) {
          response = {
            type: 'release',
            data: result[currentTabUrl]['release']
          };
        }

        sendResponse(response);
      });
    }
  }

  return true;
});

function extractReleaseData() {
  return {
    tralbumData: TralbumData,
    bandData: BandData,
    schemaData: getSchemaData(),
    coverSrc: {
      small: document.querySelector('link[rel~="shortcut"]').href,
      big: document.querySelector('link[rel="image_src"]').href,
    },
  };
}

function getSchemaData() {
  const scriptElement = document.querySelector('script[type="application/ld+json"]');
  const scriptContent = scriptElement.textContent;
  return JSON.parse(scriptContent);
}

function generateListResponse() {
  const releases = [];
  const releaseElements = document.querySelectorAll('#music-grid .music-grid-item');
  const imgBandPhoto = document.querySelector('.band-photo');

  releaseElements.forEach(element => {
    let artist = element.querySelector('.artist-override')?.innerText;

    if (!artist) {
      artist = document.querySelector('#band-name-location .title').innerText;
    }

    const titleParts = element.querySelector('.title').innerText.split("\n");
    const title = titleParts[0];
    const url = element.querySelector('a').getAttribute('href');
    releases.push({
      url: (url[0] === '/' ? window.location.origin : '') + url,
      artist: artist,
      title: title
    });
  });

  return {
    type: 'list',
    data: releases,
    popup: {
      imageSrc: imgBandPhoto.src,
    }
  };
}

function isOnReleasesListPage() {
  const location = window.location;
  return location.pathname === '/' || location.pathname === '/music';
}

(async () => {
  const src = chrome.runtime.getURL("src/bandcamp/content_module.js");
  const contentMain = await import(src);
  contentMain.main();
})();
