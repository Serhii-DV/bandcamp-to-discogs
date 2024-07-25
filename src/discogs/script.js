'use strict';

import { chromeListenMessage } from "../modules/chrome.js";
import { click } from "../modules/html.js";
import { setSectionHint, fillDurations, getSubmissionFormSectionNotes, selectFormatDescription, selectFormatFileType, setInputValue } from "./modules/draft-page.js";

export function runScript() {
  let artistNameInput;
  let qtyInput;
  let trackTitleInputs;
  let notesTextarea;
  let submissionNotesTextarea;

  // Initialize script after some period of time. We have to wait for elements initializing on the page.
  setTimeout(initialize, 5000);

  function initialize() {
    detectElements();
    setupApplyMetadataButton();

    chromeListenMessage((request, sender, sendResponse) => {
      if (request.type === 'metadata') {
        applyMetadata(request.metadata);
      }

      return true;
    });
  }

  function detectElements() {
    artistNameInput = document.getElementById('artist-name-input');
    qtyInput = document.querySelector('input[aria-label="Quantity of format"]');
    trackTitleInputs = document.querySelectorAll('.track_input');
    notesTextarea = document.querySelector('textarea#release-notes-textarea');
    submissionNotesTextarea = document.querySelector('textarea#release-submission-notes-textarea');
  }

  function setupApplyMetadataButton() {
    const applyBtn = document.createElement('button');
    applyBtn.classList.add('button', 'button-small', 'button-blue');
    applyBtn.textContent = 'Apply metadata';
    applyBtn.addEventListener('click', () => {
      const metadata = deserializeMetadata();

      if (!isObject(metadata)) {
        showNotificationWarning('Release metadata was not found');
        return;
      }

      applyMetadata(metadata);
    });

    const submissionFormSectionNotes = getSubmissionFormSectionNotes();
    submissionFormSectionNotes.append(applyBtn);

    if (submissionNotesTextarea.value) {
      click(applyBtn);
    }
  }

  function deserializeMetadata() {
    const jsonString = notesTextarea.value;
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('B2D: Invalid JSON in Notes');
    }
    return null;
  }

  function applyMetadata(metadata) {
    setMetadataHints(metadata);
    updateQuantity(metadata.format.qty);
    selectFormatFileType(metadata.format.fileType);
    selectFormatDescription(metadata.format.description);
    fillDurations();
    setInputValue(submissionNotesTextarea, metadata.submissionNotes);
    setInputValue(notesTextarea, '');
    showNotificationInfo(`Release metadata was applied.<br>${metadata.artist} - ${metadata.title}`);

    if (artistNameInput) {
      // Focus on artist name input
      artistNameInput.focus();
    }
  }

  /**
   * @param {Number} qty
   */
  function updateQuantity(qty) {
    setInputValue(qtyInput, qty);
  }

  function setMetadataHints(metadata) {
    setSectionHint('artist', metadata.artist, 'Bandcamp artist name');
    setSectionHint('title', metadata.title, 'Bandcamp release title');
    setSectionHint('label', metadata.label, 'Bandcamp page label or artist name');
    setSectionHint('country', metadata.country, 'Bandcamp country');
    setSectionHint('released', metadata.released, 'Bandcamp release dates');
    setSectionHint('credits', metadata.credits, 'Bandcamp credits');
    setSectionHint('genres', metadata.genres, 'Bandcamp genres related data');
  }

  // Notifications

  const notificationStack = createNotificationStack();

  function createNotificationStack() {
    const stack = document.createElement('div');
    stack.className = 'notification-stack';
    document.body.appendChild(stack);
    return stack;
  }

  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<div class="header">Bandcamp to Discogs</div>${message}<span class="notification-close">×</span>`;

    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function () {
      notificationStack.removeChild(notification);
    });

    notificationStack.appendChild(notification);

    setTimeout(function () {
      notificationStack.removeChild(notification);
    }, 20000); // Remove notification after 20 seconds
  }

  function showNotificationDebug(message) { showNotification(message, 'debug'); }
  function showNotificationInfo(message) { showNotification(message, 'info'); }
  function showNotificationWarning(message) { showNotification(message, 'warning'); }
  function showNotificationError(message) { showNotification(message, 'error'); }

}

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function addToast(parentElement) {
  const toastBody =
`<div class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="d-flex">
    <div class="toast-body">
      Hello, world! This is a toast message.
    </div>
    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
</div>`;
  const toastEl = document.createElement('div');
  toastEl.innerHTML = toastBody;
console.log(toastEl.firstChild);
  parentElement.appendChild(toastEl.firstChild);
}
