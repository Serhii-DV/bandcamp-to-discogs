import { convertToAlias } from "../modules/utils.js";

/**
 *
 * @param {Array} releases
 * @param {HTMLElement} form
 * @param {Boolean} checked
 */
export function fillReleasesForm(releases, form, checked) {
  const checkboxes = form.querySelector('.checkboxes');
  checkboxes.innerHTML = '';

  for (const release of releases) {
    const linkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
    <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
  </svg>`;

    const releaseLink = document.createElement("a");
    releaseLink.href = release.url;
    releaseLink.target = '_blank';
    releaseLink.innerHTML = linkIcon;

    const checkbox = createBootstrapCheckbox(
      form.id + ':' + convertToAlias(release.title),
      release.url,
      release.artist + " - " + release.title + ' ' + releaseLink.outerHTML,
      checked
    );

    checkboxes.appendChild(checkbox);
  }
}

export function createBootstrapCheckbox(id, value, labelText, checked) {
  // Create the checkbox input element
  const checkboxInput = document.createElement("input");
  checkboxInput.classList.add("form-check-input");
  checkboxInput.type = "checkbox";
  checkboxInput.id = id;
  checkboxInput.value = value;
  checkboxInput.checked = checked;

  // Create the label element
  const label = document.createElement("label");
  label.classList.add("form-check-label");
  label.htmlFor = id;
  label.innerHTML = labelText;

  // Create the div container for the checkbox and label
  const container = document.createElement("div");
  container.classList.add("form-check");
  container.appendChild(checkboxInput);
  container.appendChild(label);

  return container;
}

export function isValidBandcampURL(url) {
  const pattern = /^(https?:\/\/)?([a-z0-9-]+\.)*bandcamp\.com(\/[a-z0-9-]+)*(\/[a-z0-9-]+\/[a-z0-9-]+)?$/;
  return pattern.test(url);
}

/**
 * @param {Element} element
 */
export function triggerClick(element) {
  var event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
  });
  element.dispatchEvent(event);
}
