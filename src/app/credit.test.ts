import { extractCredits } from '../app/credit'; // Adjust the path if needed
import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('extractCredits from JSON files', () => {
  const testDirectory = path.join(__dirname, '../test/credits'); // Path to credits folder
  const testFiles = fs
    .readdirSync(testDirectory)
    .filter((file) => file.endsWith('.json'));

  testFiles.forEach((file) => {
    const filePath = path.join(testDirectory, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const testData = JSON.parse(fileContent);

    it(`parses ${file} correctly`, () => {
      const credits = extractCredits(testData.input);

      if (testData.debug) {
        console.log(credits);
      }

      expect(credits).toEqual(testData.expected);
    });
  });
});
