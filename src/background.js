chrome.omnibox.onInputEntered.addListener((url, disposition) => {
    switch (disposition) {
      case "currentTab":
        chrome.tabs.update({url});
        break;
      case "newForegroundTab":
        chrome.tabs.create({url});
        break;
      case "newBackgroundTab":
        chrome.tabs.create({url, active: false});
        break;
    }
  });