# Change log

## 0.19.0 (2025-01-XX)

### Features

- popup: Improved Discogs Search button. Added more options for searching
- popup: Added Bandcamp release and search links to the release card navigation
- popup: Output album styles on the album card and Bandcamp latest viewed widget
- bandcamp: Improved getting artists from tracks in case of various artists release
- discogs: Improve importing metadata logic. Added more choices for fields.
- discogs: Metadata. Added more choices for format types.
- discogs: Metadata. Added more choices for genres and styles.

## 0.18.1 (2024-12-25)

### Features

- popup: Show again artist and album information in the separate Card tab

## 0.18.0 (2024-12-24)

### Features

- discogs: Removed extension link from the release notes
- discogs: Set default release country to `Worldwide`
- popup: Added Bandcamp wishlist and feed links to the main navigation
- popup: Added Discogs Drafts page link to the main navigation
- popup: Small improvements on the release card tab for release urls
- popup: Use one tab for the latest viewed releases, release card and releases
- core: Improved initialization of console log commands
- core: Removed CSV data tab. Data is available through console
- core: Introduced Bandcamp URL class
- bandcamp: Improved styling for albums filter widget
- bandcamp: Added clear filter button to the albums filter widget

### Fixed

- discogs: Fixed extracting track time with hours on draft page

## 0.17.0 (2024-10-30)

### Features

- core: Use Chrome History API for history data instead of saving it to storage
- core: Save artist/label data with albums in the storage
- popup: Show Bandcamp artist/label page in the history
- popup: Open artist/label page in the releases tab

## 0.16.0 (2024-10-08)

### Features

- core: Refactor rendering Release Card
- core: A small refactor of getting data from the local storage
- popup: Make popup wider
- popup: Moved download CSV button and search buttons to the Release Card
- popup: Load release data into the release card from the history tab and latest visited releases widget
- popup: Output release info, credits, tracklist and history information on the release card

### Fixed

## 0.15.1 (2024-10-01)

### Features

- popup: Show visited date as related time value
- popup: Improved visited releases widget
- popup: Renamed Dashboard tab to Bandcamp tab

## 0.15.0 (2024-09-30)

### Features

- core: Save release visited history
- popup: Show releases history sorted by visited date by default
- popup: Show latest visited releases on the Dashboard tab

## 0.14.1 (2024-09-24)

### Fixed

- core: Storage method `getBytesInUse` is not supported in Firefox.

## 0.14.0 (2024-09-24)

### Features

- core: Make the extension compatible with Firefox add-ons.

## 0.13.1 (2024-09-23)

### Features

- bandcamp: Always save/update release data in the extension storage

### Fixed

- bandcamp: Credit text can be missing in schema

## 0.13.0 (2024-09-22)

### Features

- discogs: Show credits hint on the Discogs edit page
- popup: Receive bandcamp artist schema
- popup: Show apply metadata icon only on Discogs edit page
- core: Use a generic method for sending messages from popup to the page

## 0.12.0 (2024-08-16)

### Features

- core: Start using TypoScript with JS
- core: Converted modules to TS utils
- core: Minimize CSS files
- core: Minimize JSON data files
- core: Content scripts loading refactored
- core: Minimize popup HTML file
- core: Removed `External Content` custom component
- core: Start using `eslint` and `prettier` tools
- core: Minimize JS

## 0.11.1 (2024-07-31)

### Features

- popup: Added console command for printing release metadata

### Fixed

- popup: Dashboard was not active on non-bandcamp pages
- popup: Console was broken
- popup: Fixed release Discogs search link

## 0.11.0 (2024-07-29)

### Features

- discogs page: Added release hints on the Discogs edit page
- popup: Added load hints link to the release on History page
- popup: Added clear search button to the releases and history table
- popup: Don't display the prepared discogs release csv data in the popup
- core: Some code refactoring. Improved module loading

### Fixed

- discogs page: The artist input is selected by default after parsing metadata.
- popup: Improved initialization logic. Fixed sending chrome messages.

## 0.10.2 (2024-07-17)

### Fixed

- popup: Fixed broken multi download feature

## 0.10.1 (2024-06-23)

### Fixed

- popup: Fixed broken releases tab

## 0.10.0 (2024-06-23)

### Features

- popup: Added a Discogs search form on the main dashboard tab
- popup: Introduced a Dashboard tab
- popup: Added Discogs copy date buttons for the published and modified release dates

### Fixed

- bandcamp page: Fixed an error when track list is empty

## 0.9.1 (2024-05-16)

### Fixed

- core: release time detection was broken introduced in 0.8.0 version
- core: restore Output release published and modified dates feature introduced in 0.8.0 version
- core: deleting history item works again

## 0.9.0 (2024-05-07)

### Features

- popup: Added a Bandcamp search form on the Warning message tab
- popup: Added link to the changelog file on "About" tab
- core: Added `externalContentLoaded` event to `external-content` custom HTML tag element

### Fixed

- popup: Fixed renaming "Storage" tab to "History" tab

## 0.8.0 (2024-04-23)

### Features

- core: Better webpack development setup
- popup: Output release published and modified dates
- popup: Renamed "Storage" tab to "History" tab

### Fixed

- popup: Output release track time without leading zeroes

## 0.7.0 (2023-11-16)

### Features

- core: Use webpack to compile assets
- core: Use nmp modules: twitter bootstrap, uuidjs, etc.
- core: Re-organize folder structure
- popup: Introduced sorting data feature in the releases table

### Fixed

- popup: fixed saved CSV file name

## 0.6.1 (2023-10-19)

### Fixed

- Multiple releases download feature is broken

## 0.6.0 (2023-10-19)

### Features

- extension: Re-organize file structure
- popup: Introduced console command feature with one command "log.storage"
- popup: Add a badge that displays the storage size

### Fixed

- BC music page: Artists filter trimmed spaces in wrong way

## 0.5.0 (2023-10-10)

### Features

- Introduced artists filter widget on the bandcamp label page
- Artists filter widget is synchronized with the popup releases data widget

## 0.4.1 (2023-09-29)

### Fixed

- Bandcamp keywords conversion to Discogs genres/styles when creating draft CSV file for multiple releases
- Show notifications on the Discogs page longer. Now it's 20 seconds

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
- Autofill release fields from metadata on Discogs draft page
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
