export default {
  // genres_url: 'https://gist.githubusercontent.com/Serhii-DV/14d7ec13fd15e30db1a2a8dff047abbf/raw/discogs_genres_and_styles.json',
  genres_url: '../data/discogs_genres.json',
  // keyword_mapping_url: '../data/keyword_mapping.json',
  keyword_mapping_url:
    'https://gist.githubusercontent.com/Serhii-DV/44181f307548aabac2703147d3c730ba/raw/mapping.json',
  about_url: '../data/about.html',
  chrome_extension_url:
    'https://chromewebstore.google.com/detail/bandcamp-to-discogs/hipnkehalkffbdjnbbeoefmoondaciok',
  firefox_extension_url:
    'https://addons.mozilla.org/en-US/firefox/addon/bandcamp-to-discogs/',
  discogs_search_artist_url:
    'https://www.discogs.com/search?q={artist}&type=artist',
  discogs_search_release_url:
    'https://www.discogs.com/search?q={artist}+{release}&type=release',
  text: {
    // Submission notes text
    notes:
      'This draft was created via CSV upload and Bandcamp To Discogs Google Chrome and Firefox extension\n\nRelease url: {release_url}'
  },
  metadata: {
    country: 'Worldwide'
  }
};
