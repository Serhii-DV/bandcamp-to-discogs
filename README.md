![Bandcanmp to Discogs](https://github.com/Serhii-DV/bandcamp-to-discogs/blob/main/images/b2d_logo_128.png?raw=true)

# Bandcamp to Discogs

Bandcamp to Discogs (B2D) - is a Google Chrome extension designed to assist in converting a Bandcamp artist release page into a draft CSV file for Discogs.

## Features

* Exports Bandcamp artists release information into a CSV file
* The CSV file can be imported into Discogs as a draft ([CSV to Draft page](https://www.discogs.com/release/csv_to_draft))
* Limit amount of Bandcamp keywords that can be transformed into the Discogs genres and styles (TODO)

### Chrome Webstore Link

[Bandcamp to Discogs Extension](https://chrome.google.com/webstore/detail/bandcamp-to-discogs-b2d/hipnkehalkffbdjnbbeoefmoondaciok)

### Installation

#### 1. Prerequisites

* **OS**: Windows, macOS, Linux
* **Node.js**: 20.x or later
* **npm**: 10.x or later
* **Firefox Developer Edition**: [Download](https://www.mozilla.org/en-US/firefox/developer/)
* **Google Chrome**: [Download](https://www.google.com/chrome/)

#### 2. Setup

Clone the repository:

```bash
gh repo clone Serhii-DV/bandcamp-to-discogs
cd bandcamp-to-discogs
```

Install dependencies:

```bash
npm install
```

### 3. Build and Run

Development

```bash
npm run dev
```

Production

```bash
npm run build
```

The extension files will be created in the `dist/` folder.

### 4. Lint and Format

Linting:

```bash
npm run lint
```

Fix lint issues:

```bash
npm run lint:fix
```

Prettier check:

```bash
npm run prettier:check
```

Fix code formatting:

```bash
npm run prettier:fix
```

### 5. Testing in Firefox

Build:

```bash
npm run build
```

Load in Firefox:

Open `about:debugging#/runtime/this-firefox` in Firefox Developer Edition and click "Load Temporary Add-on", selecting the `manifest.json`.

### 6. Testing in Google Chrome

Build:

```bash
npm run build
```

Load in Chrome:

* Open Chrome and go to `chrome://extensions/`.
* Enable Developer mode (top right corner).
* Click "Load unpacked" and select the build folder containing `manifest.json`.

## Author

**Serhii Diahovchenko** - [Serhii-DV](https://github.com/Serhii-DV)

## License

This project is licensed under the GPL License - see the [LICENSE](LICENSE) file for details
