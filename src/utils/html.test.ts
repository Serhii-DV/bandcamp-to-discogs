import {
  elements,
  element,
  hasDataAttribute,
  setDataAttribute,
  getDataAttribute,
  show,
  hide,
  toggleElements,
  disable,
  enable,
  click,
  onClick,
  input,
  createElementFromHTML,
  addClass,
  removeClass,
  toggleClass
} from './html';

describe('HTML utility functions', () => {
  let testElement: HTMLElement;
  let parentElement: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="parent">
        <div id="child1" class="test-class" data-attr="value"></div>
        <div id="child2"></div>
      </div>
    `;

    testElement = document.getElementById('child1') as HTMLElement;
    parentElement = document.getElementById('parent') as HTMLElement;
  });

  afterEach(() => {
    document.body.innerHTML = ''; // Cleanup
  });

  test('elements() should select multiple elements', () => {
    const results = elements('.test-class');
    expect(results).toHaveLength(1);
    expect(results[0]).toBe(testElement);
  });

  test('element() should select a single element', () => {
    const result = element('#child1');
    expect(result).toBe(testElement);
  });

  test('hasDataAttribute() should check for a data attribute', () => {
    expect(hasDataAttribute(testElement, 'attr')).toBe(true);
    expect(hasDataAttribute(testElement, 'nonexistent')).toBe(false);
  });

  test('setDataAttribute() should set data attributes', () => {
    setDataAttribute(testElement, 'newAttr', 'newValue');
    expect(testElement.getAttribute('data-newAttr')).toBe('newValue');

    setDataAttribute(testElement, { multi1: 'val1', multi2: 'val2' });
    expect(testElement.getAttribute('data-multi1')).toBe('val1');
    expect(testElement.getAttribute('data-multi2')).toBe('val2');
  });

  test('getDataAttribute() should retrieve data attributes with a fallback', () => {
    expect(getDataAttribute(testElement, 'attr', 'default')).toBe('value');
    expect(getDataAttribute(testElement, 'nonexistent', 'default')).toBe(
      'default'
    );
  });

  test('show() should remove visually-hidden class', () => {
    testElement.classList.add('visually-hidden');
    show(testElement);
    expect(testElement.classList.contains('visually-hidden')).toBe(false);
  });

  test('hide() should add visually-hidden class', () => {
    hide(testElement);
    expect(testElement.classList.contains('visually-hidden')).toBe(true);
  });

  test('toggleElements() should toggle visibility based on condition', () => {
    testElement.classList.add('visually-hidden');

    toggleElements(true, testElement);
    expect(testElement.classList.contains('visually-hidden')).toBe(false);

    toggleElements(false, testElement);
    expect(testElement.classList.contains('visually-hidden')).toBe(true);
  });

  test('disable() should disable elements', () => {
    const inputElement = document.createElement('input');
    disable(inputElement);
    expect(inputElement.disabled).toBe(true);
  });

  test('enable() should enable elements', () => {
    const inputElement = document.createElement('input');
    inputElement.disabled = true;
    enable(inputElement);
    expect(inputElement.disabled).toBe(false);
  });

  test('click() should trigger a click event', () => {
    const mockClickHandler = jest.fn();
    testElement.addEventListener('click', mockClickHandler);
    click(testElement);
    expect(mockClickHandler).toHaveBeenCalled();
  });

  test('onClick() should attach a click event listener', () => {
    const mockCallback = jest.fn();
    onClick(testElement, mockCallback);
    testElement.click();
    expect(mockCallback).toHaveBeenCalled();
  });

  test('input() should set input value and trigger event', () => {
    const inputElement = document.createElement('input');
    const mockInputHandler = jest.fn();
    inputElement.addEventListener('input', mockInputHandler);

    input(inputElement, 'new value');

    expect(inputElement.value).toBe('new value');
    expect(mockInputHandler).toHaveBeenCalled();
  });

  test('createElementFromHTML() should create an element from HTML string', () => {
    const element = createElementFromHTML('<div class="test">Content</div>');
    expect(element).not.toBeNull();
    expect(element?.classList.contains('test')).toBe(true);
    expect(element?.textContent).toBe('Content');
  });

  test('addClass() should add a class', () => {
    addClass(testElement, 'new-class');
    expect(testElement.classList.contains('new-class')).toBe(true);
  });

  test('removeClass() should remove a class', () => {
    testElement.classList.add('remove-me');
    removeClass(testElement, 'remove-me');
    expect(testElement.classList.contains('remove-me')).toBe(false);
  });

  test('toggleClass() should toggle a class', () => {
    toggleClass(testElement, 'toggle-class');
    expect(testElement.classList.contains('toggle-class')).toBe(true);

    toggleClass(testElement, 'toggle-class');
    expect(testElement.classList.contains('toggle-class')).toBe(false);
  });
});
