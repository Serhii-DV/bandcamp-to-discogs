import { onClick } from '../../utils/html';
import { FormElement } from '../app/draft/types';
import { Variation } from '../app/draft/variation';
import { setCheckboxValue, setFormElementValue } from '../modules/draft/html';

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

    const button = this.createHintButtonElement();

    onClick(button, (event) => {
      event.stopPropagation();
      this.showDropdown(button);
    });

    // Auto-apply first variation if applicable
    this.autoApplyFirstVariation();

    // Insert the button before or after the target element
    this.insertButton(button);

    return button;
  }

  /**
   * Creates the hint button element
   * @returns The created button element
   */
  private createHintButtonElement(): HTMLElement {
    const button = document.createElement('button');
    button.type = 'button'; // Prevent form submission
    button.className = 'b2d-hint-button';
    button.innerHTML = ICON_MAGIC;
    button.title = 'Click to show suggestions based on Bandcamp release';
    return button;
  }

  /**
   * Shows the dropdown with variation options
   * @param button The button element that triggered the dropdown
   */
  private showDropdown(button: HTMLElement): void {
    // Remove any existing dropdown
    const existingDropdown = document.querySelector('.b2d-hint-dropdown');
    if (existingDropdown) existingDropdown.remove();

    if (!this.variations.length) return;

    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'b2d-hint-dropdown';

    // Add variations as dropdown items
    this.variations.forEach((variation) => {
      const item = this.createVariationItem(variation, dropdown);
      dropdown.appendChild(item);
    });

    // Add dropdown to document body
    document.body.appendChild(dropdown);

    // Position the dropdown
    this.positionDropdown(dropdown, button);

    // Setup closing behavior
    this.setupDropdownClosing(dropdown, button);
  }

  /**
   * Creates a variation item for the dropdown
   * @param variation The variation to create an item for
   * @param dropdown The dropdown element containing the items
   * @returns The created variation item element
   */
  private createVariationItem(
    variation: Variation,
    dropdown: HTMLElement
  ): HTMLElement {
    const item = document.createElement('div');
    item.className = 'b2d-hint-item';

    // Check if this variation matches current value
    const isSelected = this.isVariationSelected(variation);
    const itemText = variation.toString();

    // Add selected class for matched items
    if (isSelected) {
      item.classList.add('b2d-hint-selected');
    }

    item.textContent = itemText;
    item.title = itemText;

    onClick(item, () => {
      this.applyVariation(variation);
      dropdown.remove();
    });

    return item;
  }

  /**
   * Positions the dropdown relative to the button
   * @param dropdown The dropdown element to position
   * @param button The button element the dropdown is attached to
   */
  private positionDropdown(dropdown: HTMLElement, button: HTMLElement): void {
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
  }

  /**
   * Sets up event listeners to close the dropdown when clicking outside
   * @param dropdown The dropdown element
   * @param button The button element that triggered the dropdown
   */
  private setupDropdownClosing(
    dropdown: HTMLElement,
    button: HTMLElement
  ): void {
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
  }

  /**
   * Applies the selected variation to the form elements
   * @param variation The variation to apply
   */
  private applyVariation(variation: Variation): void {
    // Check if all elements are checkboxes
    const allCheckboxes = this.elements.every(
      (element) =>
        element instanceof HTMLInputElement && element.type === 'checkbox'
    );
    const variationValue = variation.toString();

    if (allCheckboxes) {
      // Use checkExclusively when all elements are checkboxes
      setCheckboxValue(this.elements as HTMLInputElement[], variationValue);
    } else {
      // Apply the variation value to all the elements (original behavior)
      this.elements.forEach((element) => {
        setFormElementValue(element, variationValue);
      });
    }
  }

  /**
   * Checks if a variation matches the current element value
   * @param variation The variation to check
   * @returns Whether the variation matches the current element value
   */
  private isVariationSelected(variation: Variation): boolean {
    if (!this.elements.length) return false;

    const variationValue = variation.toString().trim();
    const firstElement = this.elements[0];

    // Check if we're dealing with a checkbox list
    const allCheckboxes = this.elements.every(
      (element) =>
        element instanceof HTMLInputElement && element.type === 'checkbox'
    );

    if (allCheckboxes && this.elements.length > 1) {
      // For checkbox lists, check if variation value matches any checked boxes
      const selectedValues = this.getSelectedCheckboxValues();
      return selectedValues.includes(variationValue);
    } else if (
      firstElement instanceof HTMLInputElement &&
      firstElement.type === 'checkbox'
    ) {
      // For a single checkbox, match the variation text to checked status
      return (
        (firstElement.checked && variationValue === 'true') ||
        (!firstElement.checked && variationValue === 'false')
      );
    }

    // For text inputs and textareas, compare with element value
    let currentValue = '';
    if (firstElement instanceof HTMLInputElement) {
      currentValue = firstElement.value;
    } else if (firstElement instanceof HTMLTextAreaElement) {
      currentValue = firstElement.value;
    } else if (typeof firstElement === 'object' && firstElement !== null) {
      currentValue = ((firstElement as any).value || '').toString();
    }

    return currentValue.trim() === variationValue;
  }

  /**
   * Gets the values of all checked checkboxes in the elements array
   * @returns Array of values from checked checkboxes
   */
  private getSelectedCheckboxValues(): string[] {
    const selectedValues: string[] = [];

    this.elements.forEach((element) => {
      if (
        element instanceof HTMLInputElement &&
        element.type === 'checkbox' &&
        element.checked
      ) {
        // Get the value of the checkbox or its associated label text if value is empty
        let value = element.value.trim();

        // If checkbox has no value, try to get its label text or data attribute
        if (!value || value === 'on') {
          const id = element.id;
          if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label) {
              value = label.textContent?.trim() || '';
            }
          }

          // If still no value, check for data attributes
          if (!value) {
            value = element.dataset.value || '';
          }
        }

        if (value) {
          selectedValues.push(value);
        }
      }
    });

    return selectedValues;
  }

  /**
   * Inserts the button before or after the target element
   * @param button The button element to insert
   */
  private insertButton(button: HTMLElement): void {
    const insertPosition =
      this.placement === 'before' ? 'beforebegin' : 'afterend';
    this.target.insertAdjacentElement(insertPosition, button);
  }

  /**
   * Auto-applies the first variation if the first form element is empty
   */
  private autoApplyFirstVariation(): void {
    if (this.elements.length > 0 && this.variations.length > 0) {
      const firstElement = this.elements[0];
      let isEmpty = false;

      // Check if the element value is empty
      if (firstElement instanceof HTMLInputElement) {
        isEmpty = !firstElement.value.trim();
      } else if (firstElement instanceof HTMLTextAreaElement) {
        isEmpty = !firstElement.value.trim();
      } else if (typeof firstElement === 'object' && firstElement !== null) {
        // Handle the case when firstElement is a custom form element object
        const value = (firstElement as any).value || '';
        isEmpty = !value.toString().trim();
      }

      // Apply the first variation if the element is empty
      if (isEmpty) {
        this.elements.forEach((element) => {
          setFormElementValue(element, this.variations[0].toString());
        });
      }
    }
  }
}
