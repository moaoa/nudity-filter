chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if(tab.url){
        console.log('tab: ', tab)
        console.log('tabId: ', tabId)
    }
})