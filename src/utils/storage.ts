const storage = chrome.storage.local;

/**
 * Retrieves the total number of bytes in use by the storage and invokes the callback with this value.
 */
export function getStorageSize(callback: (bytesInUse: number) => void) {
  if (typeof storage.getBytesInUse === 'function') {
    // Chrome supports getBytesInUse
    storage.getBytesInUse(null, callback);
  } else {
    // Fallback for Firefox
    storage.get(null, (items) => {
      const byteSize = Object.values(items).reduce((total, item) => {
        return (
          total +
          (typeof item === 'string' ? item.length : JSON.stringify(item).length)
        );
      }, 0);
      callback(byteSize);
    });
  }
}
