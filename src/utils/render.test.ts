import { render } from './render';

describe('render', () => {
  let templateElement: HTMLElement;
  let targetElement: HTMLElement;

  beforeEach(() => {
    // Set up the template
    templateElement = document.createElement('script');
    templateElement.setAttribute('type', 'text/template');
    templateElement.innerHTML = 'Hello, {{name}}!';

    // Set up the target container
    targetElement = document.createElement('div');
    targetElement.id = 'target';
    document.body.appendChild(targetElement);
  });

  afterEach(() => {
    document.body.innerHTML = ''; // Clean up the DOM
  });

  it('should render Mustache template using a string template', () => {
    render('Hello, {{name}}!', 'target', { name: 'John' });

    expect(targetElement.innerHTML).toBe('Hello, John!');
  });

  it('should render Mustache template using an HTMLElement template', () => {
    render(templateElement, 'target', { name: 'Alice' });

    expect(targetElement.innerHTML).toBe('Hello, Alice!');
  });

  it('should render into an HTMLElement target', () => {
    const customTarget = document.createElement('div');
    render('Welcome, {{user}}!', customTarget, { user: 'Bob' });

    expect(customTarget.innerHTML).toBe('Welcome, Bob!');
  });

  it('should log an error if the target element does not exist', () => {
    console.error = jest.fn(); // Mock console.error

    render('Hi, {{person}}!', 'non-existent-id', { person: 'Charlie' });

    expect(console.error).toHaveBeenCalledWith(
      'Target element with ID "non-existent-id" not found.'
    );
  });

  it('should not modify target content if target element is not found', () => {
    render('Hey, {{name}}!', 'non-existent-id', { name: 'David' });

    expect(targetElement.innerHTML).toBe(''); // Should remain empty
  });
});
