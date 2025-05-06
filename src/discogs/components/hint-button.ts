import { onClick } from '../../utils/html';
import { truncateText } from '../../utils/string';
import { FormElement } from '../app/draft/types';
import { Variation } from '../app/draft/variation';
import { setFormElementValue } from '../modules/draft/html';

const ICON_MAGIC = `<i class="icon icon-magic" role="img" aria-hidden="true"></i>`;

/**
 * Create a button element with hint functionality
 * Shows a dropdown with variations when clicked
 */
function createHintButton(
  element: FormElement,
  variations: Variation[]
): HTMLElement {
  const button = document.createElement('button');
  button.type = 'button'; // Prevent form submission
  button.className = 'b2d-hint-button';
  button.innerHTML = ICON_MAGIC;
  button.title = 'Click to show suggestions';

  onClick(button, (event) => {
    event.stopPropagation();

    // Remove any existing dropdown
    const existingDropdown = document.querySelector('.b2d-hint-dropdown');
    if (existingDropdown) existingDropdown.remove();

    if (!variations.length) return;

    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'b2d-hint-dropdown';

    // Add variations as dropdown items
    variations.forEach((variation) => {
      const item = document.createElement('div');
      item.className = 'b2d-hint-item';
      item.textContent = truncateText(variation.toString(), 50);
      item.title = variation.toString();

      onClick(item, () => {
        setFormElementValue(element, variation.toString());
        dropdown.remove();
      });

      dropdown.appendChild(item);
    });

    // Add dropdown to document body
    document.body.appendChild(dropdown);

    // Position dropdown
    const buttonRect = button.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    dropdown.style.position = 'absolute';
    dropdown.style.top = `${buttonRect.bottom + scrollY}px`;
    dropdown.style.left = `${buttonRect.left + scrollX}px`;
    dropdown.style.minWidth = `${Math.max(buttonRect.width, 150)}px`;
    dropdown.style.zIndex = '1000';

    // Close dropdown when clicking outside
    const closeDropdown = (e: MouseEvent) => {
      if (!dropdown.contains(e.target as Node) && e.target !== button) {
        dropdown.remove();
        document.removeEventListener('click', closeDropdown);
      }
    };

    // Delayed listener
    setTimeout(() => {
      document.addEventListener('click', closeDropdown);
    }, 0);
  });

  return button;
}

/**
 * Create a hint button for a form element
 * @param element The form element to attach the hint button to
 * @param variations The variations to show in the dropdown
 * @returns The created hint button element or null if not applicable
 */
export function createHintButtonFor(
  element: FormElement,
  variations: Variation[]
): HTMLElement | null {
  // Skip checkbox inputs
  if (element instanceof HTMLInputElement && element.type === 'checkbox') {
    return null;
  }

  // Check if a hint button has already been added to this input or select
  if (
    element.previousElementSibling &&
    element.previousElementSibling.classList.contains('b2d-hint-button')
  ) {
    return null; // Hint button already exists for this element
  }

  const hintButton = createHintButton(element, variations);

  // Insert the button before the element
  element.insertAdjacentElement('beforebegin', hintButton);
  return hintButton;
}

/**
 * Set up hint buttons for multiple form elements
 * @param elements Array of form elements to attach hint buttons to
 * @param variations Array of variations to use for all elements
 * @returns Array of created hint buttons (excluding nulls)
 */
export function setupHintButtonsForElements(
  elements: FormElement[],
  variations: Variation[]
): (HTMLElement | null)[] {
  return elements.map((element) => {
    return createHintButtonFor(element, variations);
  });
}
