const setDOMInfo = (data) => {
    if(data && data.values) {
        const jewelryKey = data.values.reduce((prev, next) => prev ? `${prev}|${next}` : next, '');
        const locationParts = data.location.split('/');
        let userName = "JusSparkles";
        if(locationParts.length > 1){
            userName = locationParts[1];
        }
        window._ele.txtStyleId.innerText = `https://www.premierdesigns.com/${userName}/shopping-bag/?addToCart=${jewelryKey}`;
    }
}

const attachToDOM = () => new Promise((resolve) =>
    window.addEventListener('DOMContentLoaded', () => resolve())
);

// ...query for the active tab...
const getTabs = () => new Promise((resolve) =>
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        (tabs) => resolve(tabs)
    )
);

// Once the DOM is ready...
attachToDOM()
.then(() => {
    
    console.log('window resolved');
    window._ele = {
        txtStyleId: document.getElementById('txtStyleId'),
        btnCopy: document.getElementById('btnCopy')
    };
})
.then(() => getTabs())
.then((tabs) => {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'DOMInfo'},
        // ...also specifying a callback to be called 
        //    from the receiving end (content script)
        setDOMInfo
    );

    window._ele.btnCopy.addEventListener('click', () => {
        var input = document.createElement('textarea');
        document.body.appendChild(input);
        input.value = window._ele.txtStyleId.innerText;
        input.focus();
        input.select();
        document.execCommand('Copy');
        input.remove();
        setTimeout(() =>
            window.close()
        , 500);
    });
});
