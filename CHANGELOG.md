# Change log

## 0.5.x (2023-XX-YY)

### Features

- Introduced artists filter widget on the bandcamp label page
- Artists filter widget is synchronized with the popup releases data widget

## 0.4.1 (2023-09-29)

### Fixed

- Bancamp keywords convertion to Discogs genres/styles when creating draft CSV file for multiple releases
- Show notifications on the Discgos page longer. Now it's 20 seconds

## 0.4.0 (2023-09-22)

### Features

- Introduced notifications on Discogs release edit page. It shows messages regarding actions on the page
- Show the list of releases on the artist or label page
- It's possible now to save the list of releases to the single Discogs CSV draft file. Feature works on label's bandcamp pages
- Show the list of releases from the local storage
- Added the ability to filter the list of releases
- Added button to remove items from the storage
- Added button to clear the storage

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
