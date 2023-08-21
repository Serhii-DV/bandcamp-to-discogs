'use strict';

let TralbumData, BandData = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let response;

  if (TralbumData !== undefined && request.type === 'getBandcampData') {
    if (isOnReleasesListPage()) {
      response = {
        type: 'list',
        data: extractReleasesListData()
      }
    } else {
      response = {
        type: 'release',
        data: extractReleaseData()
      }
    }
  }

  sendResponse(response);

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

function extractReleasesListData() {
  const releases = [];
  const releaseElements = document.querySelectorAll('#music-grid .music-grid-item');
  releaseElements.forEach(element => {
    let artist = element.querySelector('.artist-override')?.innerText;

    if (!artist) {
      artist = document.querySelector('#band-name-location .title').innerText;
    }

    const titleParts = element.querySelector('.title').innerText.split("\n");
    const title = titleParts[0];
    const url = element.querySelector('a').getAttribute('href');
    releases.push({
      url: window.location.origin + url,
      artist: artist,
      title: title
    });
  });
  return releases;
}

function isOnReleasesListPage() {
  const location = window.location;
  return location.pathname === '/' || location.pathname === '/music';
}

// Injecting script.js
var s = document.createElement('script');
s.src = chrome.runtime.getURL('src/bandcamp/script.js');
(document.head||document.documentElement).appendChild(s);
s.onload = () => {
  s.remove();
};

window.addEventListener('BC_Data', (e) => {
  // Getting data from script.js
  TralbumData = e.detail.TralbumData;
  BandData = e.detail.BandData;
});
