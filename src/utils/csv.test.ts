import { objectsToCsv, downloadCsv } from './csv';

describe('objectsToCsv', () => {
  it('should return an empty string for an empty array', () => {
    expect(objectsToCsv([])).toBe('');
  });

  it('should convert an array of objects to CSV format', () => {
    const objects = [
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 }
    ];
    const expectedCsv = 'name,age\nAlice,25\nBob,30';
    expect(objectsToCsv(objects)).toBe(expectedCsv);
  });
});

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'mock-url');
  global.URL.revokeObjectURL = jest.fn();
});

describe('downloadCsv', () => {
  it('should create a downloadable CSV file', () => {
    document.body.innerHTML = '<div id="root"></div>'; // Optional, ensures a clean DOM

    const mockClick = jest.fn();
    jest.spyOn(document, 'createElement').mockImplementation(() => {
      return { click: mockClick } as unknown as HTMLAnchorElement;
    });

    downloadCsv('test,data', 'test-file');

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
});
