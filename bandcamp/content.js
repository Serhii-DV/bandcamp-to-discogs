'use strict';

let TralbumData, BandData = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let response;

  if (TralbumData !== undefined && request.type === 'getBandcampData') {
    response = {
      TralbumData: TralbumData,
      BandData: BandData,
      coverSrc: {
        small: document.querySelector('link[rel~="shortcut"]').href,
        big: document.querySelector('link[rel="image_src"]').href,
      },
    };
  }

  sendResponse(response);

  return true;
});

// Injecting script.js
var s = document.createElement('script');
s.src = chrome.runtime.getURL('bandcamp/script.js');
(document.head||document.documentElement).appendChild(s);
s.onload = () => {
  s.remove();
};

window.addEventListener('BC_Data', (e) => {
  // Getting data from script.js
  TralbumData = e.detail.TralbumData;
  BandData = e.detail.BandData;
});
