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
    const checkbox = createBootstrapCheckbox(
      convertToAlias(release.title),
      release.url,
      release.artist + " - " + release.title,
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
  label.textContent = labelText;

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
