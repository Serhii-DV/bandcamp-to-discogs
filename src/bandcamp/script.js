
setTimeout(() => {
  window.dispatchEvent(new CustomEvent('BC_Data', {
    detail: {
      TralbumData: window.TralbumData,
      BandData: window.BandData
    }
  }));
}, 0);
