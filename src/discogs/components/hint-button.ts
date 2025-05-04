import { onClick } from '../../utils/html';
import { truncateText } from '../../utils/string';
import { FormElement } from '../app/draft/types';
import { Variation } from '../app/draft/variation';
import { setFormElementValue } from '../modules/draft/html';

const ICON_MAGIC = `<i class="icon icon-magic" role="img" aria-hidden="true"></i>`;

/**
 * HintButton Web Component
 * Creates a button that shows suggestions when clicked
 */
export class HintButton extends HTMLElement {
  private variations: Variation[] = [];
  private targetElement: FormElement | null = null;

  static get observedAttributes() {
    return ['title'];
  }

  constructor() {
    super();
    this.innerHTML = ICON_MAGIC;
    this.className = 'b2d-hint-button';
    this.title = this.getAttribute('title') || 'Click to show suggestions';
    this.setupEventListeners();
  }

  /**
   * Connect the component to a form element
   */
  connectToElement(element: FormElement) {
    if (!element) return;
    this.targetElement = element;
  }

  /**
   * Set the variations to be displayed in the dropdown
   */
  setVariations(variations: Variation[]) {
    this.variations = variations;
  }

  /**
   * Initialize event listeners
   */
  private setupEventListeners() {
    onClick(this, (event) => {
      event.stopPropagation(); // Prevent document click from immediately closing dropdown
      this.showDropdown();
    });
  }

  /**
   * Show the dropdown with variations
   */
  private showDropdown() {
    // Remove any existing dropdown
    const existingDropdown = document.querySelector('.b2d-hint-dropdown');
    if (existingDropdown) existingDropdown.remove();

    if (!this.targetElement || !this.variations.length) return;

    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'b2d-hint-dropdown';

    // Add variations as dropdown items
    this.variations.forEach((variation) => {
      const item = document.createElement('div');
      item.className = 'b2d-hint-item';
      item.textContent = truncateText(variation.toString(), 50);
      item.title = variation.toString();

      onClick(item, () => {
        setFormElementValue(
          this.targetElement as FormElement,
          variation.toString()
        );
        dropdown.remove();
      });

      dropdown.appendChild(item);
    });

    // Add dropdown to document body for absolute positioning
    document.body.appendChild(dropdown);

    // Position the dropdown directly under the button
    const buttonRect = this.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    dropdown.style.position = 'absolute';
    dropdown.style.top = `${buttonRect.bottom + scrollY}px`;
    dropdown.style.left = `${buttonRect.left + scrollX}px`;
    dropdown.style.minWidth = `${Math.max(buttonRect.width, 150)}px`;
    dropdown.style.zIndex = '1000';

    // Close dropdown when clicking outside
    const closeDropdown = (e: MouseEvent) => {
      if (!dropdown.contains(e.target as Node) && e.target !== this) {
        dropdown.remove();
        document.removeEventListener('click', closeDropdown);
      }
    };

    // Add delayed listener to allow the current click to complete
    setTimeout(() => {
      document.addEventListener('click', closeDropdown);
    }, 0);
  }

  /**
   * Utility method to create a new hint button for a form element
   */
  static createFor(
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

    // Create element using createElement instead of constructor
    const hintButton = document.createElement('hint-button') as HTMLElement;

    // Safely access methods if they exist
    if (typeof (hintButton as any).connectToElement === 'function') {
      (hintButton as any).connectToElement(element);
    }

    if (typeof (hintButton as any).setVariations === 'function') {
      (hintButton as any).setVariations(variations);
    }

    element.insertAdjacentElement('beforebegin', hintButton);
    return hintButton;
  }
}

// Add this function at the bottom of hint-button.ts
export function registerHintButton() {
  // More robust checking for customElements API
  if (typeof customElements === 'undefined') {
    console.warn('customElements API is not available');
    return;
  }

  try {
    // Check if already defined
    if (!customElements.get('hint-button')) {
      customElements.define('hint-button', HintButton);
      console.log('HintButton custom element registered successfully');
    }
  } catch (error) {
    console.error('Failed to register HintButton custom element:', error);
  }
}

// Try to register the element during module load, but wrap in try/catch
try {
  registerHintButton();
} catch (error) {
  console.error('Error during initial HintButton registration:', error);
}
