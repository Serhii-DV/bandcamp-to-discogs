export default {
  about_url: '../data/about.html',
  chrome_extension_url:
    'https://chromewebstore.google.com/detail/bandcamp-to-discogs/hipnkehalkffbdjnbbeoefmoondaciok',
  firefox_extension_url:
    'https://addons.mozilla.org/en-US/firefox/addon/bandcamp-to-discogs/',
  bandcamp: {
    search: {
      all: 'https://bandcamp.com/search?q={query}',
      artist: 'https://bandcamp.com/search?q={query}&item_type=b',
      release: 'https://bandcamp.com/search?q={query}&item_type=a'
    }
  },
  discogs: {
    search: {
      all: 'https://www.discogs.com/search/?q={query}',
      artist: 'https://www.discogs.com/search?q={artist}&type=artist',
      release:
        'https://www.discogs.com/search?q={artist}+{release}&type=release'
    },
    draft: {
      self_released: 'Not On Label ({artist} Self-released)',
      // Submission notes text
      submission_notes: {
        default:
          'This draft was created via CSV upload and Bandcamp To Discogs Google Chrome and Firefox extension\n\nRelease url: {release_url}',
        short: 'Release url: {release_url}'
      }
    }
  },
  metadata: {
    country: 'Worldwide'
  }
};
