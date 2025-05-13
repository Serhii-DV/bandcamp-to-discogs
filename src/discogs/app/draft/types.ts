export type FormTextElement = HTMLInputElement | HTMLTextAreaElement;
export type FormElement = FormTextElement | HTMLSelectElement;

export function instanceOfFormElement(
  element?: Element | null
): element is FormTextElement {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
}

export function instanceOfFormTextElement(
  element?: EventTarget | null
): element is FormTextElement {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  );
}
