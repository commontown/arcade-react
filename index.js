// 1. tell parent window ready for appletData
// 2. wait for parent window to postMessage with appletData
// 3. call callback with the supplied appletData
// let __server;
export function portalRequestAppletData(dataFunction, topsFunction) {
  // do only if embeded
  if (window.parent !== window) {
    // listen for events from parents: pause, unpause and appletData
    window.addEventListener('message', ev => {
      const { type, params } = ev;
      // console.log('message:', { type, params });
      switch (type) {
        case 'appletData':
          dataFunction(params);
          break;
        case 'getTops':
          topsFunction(params);
          break;
      }
    });

    // tell parent i am ready
    window.parent.postMessage('requestAppletData', '*');
  } else {
    callback(null);
  }
}

export function portalReportAppletResult(score, callback) {
  if (__server) {
    // gameId: is the path of the embedded portal page, eg. "/ca4_dd/books/848-4f5f/game5test"
    // highscoreUrl: the url to post, eg. "https://dd.ca4dev.url3.net/cos/o.x?c=/ca4_dd/etitle&func=furl&furlpath=/api/highscore"
    const { highscoreUrl, gameId } = __server;
    if (highscoreUrl && gameId) {
      requestXHR(highscoreUrl, {
        method: 'post',
        data: {
          cat: gameId,
          total: score,
        }
      }).then(data => {
        if (callback) callback(data);
      });
    }
  }
  else console.warn('Must call portalRequestAppletData before to obtain server info');
}