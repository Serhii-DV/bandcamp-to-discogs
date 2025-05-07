import { onClick } from '../../utils/html';
import { FormElement } from '../app/draft/types';
import { Variation } from '../app/draft/variation';
import { setFormElementValue } from '../modules/draft/html';

const ICON_MAGIC = `<i class="icon icon-magic" role="img" aria-hidden="true"></i>`;

/**
 * Class representing a hint button that can be attached to form elements
 * Shows a dropdown with variations when clicked
 */
export class HintButton {
  elements: FormElement[];
  variations: Variation[];
  target: HTMLElement;
  placement: 'before' | 'after';
  button: HTMLElement | null = null;

  /**
   * Create a new HintButton
   * @param elements Form elements to update values for when a hint is selected
   * @param variations Variations to show in the dropdown
   * @param target Element to place the button before or after
   * @param placement Whether to place the button before or after the target element
   */
  constructor(
    elements: FormElement[],
    variations: Variation[],
    target: HTMLElement,
    placement: 'before' | 'after' = 'before'
  ) {
    this.elements = elements;
    this.variations = variations;
    this.target = target;
    this.placement = placement;
  }

  /**
   * Create and attach the hint button
   * @returns The created hint button element or null if not applicable
   */
  setup(): HTMLElement | null {
    this.button = this.createButton();
    return this.button;
  }

  /**
   * Create a button element with hint functionality and attach it to the target
   * @returns The created button element or null if button already exists
   */
  private createButton(): HTMLElement | null {
    // Check if a hint button has already been added to this target element
    const siblingProperty =
      this.placement === 'before'
        ? 'previousElementSibling'
        : 'nextElementSibling';
    if (
      this.target[siblingProperty] &&
      this.target[siblingProperty]?.classList.contains('b2d-hint-button')
    ) {
      return null; // Hint button already exists for this element
    }

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

      if (!this.variations.length) return;

      // Create dropdown container
      const dropdown = document.createElement('div');
      dropdown.className = 'b2d-hint-dropdown';

      // Add variations as dropdown items
      this.variations.forEach((variation) => {
        const item = document.createElement('div');
        item.className = 'b2d-hint-item';

        // Always show the full text without truncation
        item.textContent = variation.toString();
        item.title = variation.toString();

        onClick(item, () => {
          // Apply the variation value to all the elements
          this.elements.forEach((element) => {
            setFormElementValue(element, variation.toString());
          });
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

      // Set appropriate width based on first element type (if available)
      const firstElement = this.elements[0];
      if (firstElement && firstElement instanceof HTMLTextAreaElement) {
        // For TextArea, make dropdown wider to show more text
        const width = Math.max(firstElement.offsetWidth, 300); // At least 300px or element width
        dropdown.style.minWidth = `${width}px`;
        dropdown.style.maxWidth = '500px'; // Cap the maximum width
      } else {
        dropdown.style.minWidth = `${Math.max(buttonRect.width, 150)}px`;
      }

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

    // Insert the button before or after the target element
    const insertPosition =
      this.placement === 'before' ? 'beforebegin' : 'afterend';
    this.target.insertAdjacentElement(insertPosition, button);

    return button;
  }
}
