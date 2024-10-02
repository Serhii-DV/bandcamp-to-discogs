import Mustache from 'mustache';

export function render(
  template: string | HTMLElement,
  targetId: string | HTMLElement,
  view: Record<string, any>
): void {
  const templateContent =
    template instanceof HTMLElement ? template.innerHTML : template;
  const renderedContent = Mustache.render(templateContent, view);
  const targetElement =
    targetId instanceof HTMLElement
      ? targetId
      : document.getElementById(targetId);

  if (!targetElement) {
    console.error(`Target element with ID "${targetId}" not found.`);
    return;
  }

  targetElement.innerHTML = renderedContent;
}
