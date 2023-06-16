
setTimeout(() => {
  window.dispatchEvent(new CustomEvent('BC_TralbumData', {
    detail: window.TralbumData
  }));
}, 0);
