// src/discogs/components/custom-elements.ts
import { registerHintButton } from './hint-button';

/**
 * Register all custom elements used in the application
 * This needs to be called early in the initialization process
 */
export function registerCustomElements() {
  try {
    registerHintButton();
    // Add registrations for any other custom elements here
    console.log('Custom elements registered successfully');
  } catch (error) {
    console.error('Error registering custom elements:', error);
  }
}
