# Change log

## 0.3.0 (2023-XX-YY)

### Features

- Introduced notifications on Discogs release edit page. It shows messages regarding actions on the page
- Show the list of releases on the artist or label page
- It's possible now to save the list of releases to the single Discogs CSV draft file. Feature works on label bandcamp page
- Added the ability to filter the list of releases

### Fixed

- Each word in release title must be capitalized

## 0.2.0 (2023-08-14)

### Features

- Save release metadata as JSON value in notes field
- Outofill release fields from metadata on Discogs draft page
- Updated "About extension" information

## 0.1.3

### Features

- Added "How to use" information to the "About" section
- Discogs notes field is empty by default. It should not be automatically filled
- Use bandcamp "publish_date" as a release date
- Output generated "Submission notes" value
- Output current extension version in the "About" section

### Fixes

- Always load `about.html` from the source code and not from the Gist
