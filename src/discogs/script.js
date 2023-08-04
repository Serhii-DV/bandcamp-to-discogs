'use strict';

((document) => {
  let qtyInput;
  let trackNumInputs;
  let trackTitleInputs;
  let trackDurationInputs;

  setTimeout(() => {
    detectElements();
    updateQuantity(trackNumInputs.length);
    selectFormatFileType('FLAC');
    selectFormatDescription('Album');
  }, 2000);

  function detectElements() {
    qtyInput = document.querySelector('input[aria-label="Quantity of format"]');
    trackNumInputs = document.querySelectorAll('.track-number-input');
    trackTitleInputs = document.querySelectorAll('.track_input');
    trackDurationInputs = document.querySelectorAll('input[aria-label="Track duration"]');
  }

  /**
   * @param {Number} qty
   */
  function updateQuantity(qty) {
    const oldQty = qtyInput.value;
    qtyInput.value = qty;
    console.log('B2D: Quantity has been updated from ' + oldQty + ' to ' + qty);
  }

  /**
   * @param {String} fileType
   */
  function selectFormatFileType(fileType) {
    const fileTypeInput = document.querySelector('input[value="' + fileType + '"]');

    if (fileTypeInput) {
      fileTypeInput.checked = true;
      console.log(`B2D: Format file type ${fileType} was checked`);
    } else {
      console.log(`B2D: Format file type ${fileType} not found`);
    }
  }

  /**
   * @param {String} formatDescription
   */
  function selectFormatDescription(formatDescription) {
    const descriptionInput = document.querySelector('.format_descriptions_type input[value="' + formatDescription + '"]');

    if (descriptionInput) {
      descriptionInput.checked = true;
      console.log(`B2D: Format description ${formatDescription} was checked`);
    } else {
      console.log(`B2D: Format description ${formatDescription} not found`);
    }
  }
})(document);
