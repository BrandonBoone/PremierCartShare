function removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    var urlparts= url.split('?');   
    if (urlparts.length>=2) {

        var prefix= encodeURIComponent(parameter)+'=';
        var pars= urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i= pars.length; i-- > 0;) {    
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                pars.splice(i, 1);
            }
        }

        url= urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
        return url;
    } else {
        return url;
    }
}

const printTotal = (totalAdded, len) => `Adding Item ${totalAdded} / ${len}`;

// Event listener
document.addEventListener('cart_connectExtension', function(e) {
    // e.detail contains the transferred data (can be anything, ranging
    // from JavaScript objects to strings).
	// Do something, for example:
    if(e.detail)
    {
        debugger;
        var loadingDiv = null;
        try {
            loadingDiv = document.createElement('div');
            const loadingText = document.createElement('span');
            loadingDiv.appendChild(loadingText);
            loadingDiv.className = 'xyz_loading';

            document.body.appendChild(loadingDiv);

            var promiseChain = Promise.resolve();
            const items = e.detail.split('|');
            const len = items.length;
            var totalAdded = 1;

            loadingText.innerText = printTotal(totalAdded, len);

            items.forEach((item) => {
                promiseChain = promiseChain.then(() => new Promise((resolve, reject) => {
                    $.ajax(app.API.postOptions("cart", "addToCart", {code: item, quantity: "1"}))
                    .then((n) => {
                        if (n.success) {
                            totalAdded = totalAdded + 1 <= len ? totalAdded + 1 : totalAdded;
                            loadingText.innerText = printTotal(totalAdded, len);
                            resolve();
                        } else {
                            reject();
                        }
                    });
                }));
            });
            promiseChain.then(() => setTimeout(() => {
                loadingText.innerText = `Almost Ready...`;
                window.location = removeURLParameter(window.location.href, 'addToCart');
            }, 150))
            .catch(() => document.body.removeChild(loadingDiv));
        } catch (ex) {
            document.body.removeChild(loadingDiv)
        }
    }
});

// https://stackoverflow.com/a/18527191/402706
var css = `
.xyz_loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8WA8AAicBUm5VYI8AAAAASUVORK5CYII=);
}
  
.xyz_loading span {
    font-family: "VivaBeautifulProB";
    font-size: 6rem;
    color: #32d8e2;
    padding: 20px 20px 5px 20px;
    border-radius: 5px;
    background-color: #fff;
    position:relative;
    top:50%;
}
`;

// https://stackoverflow.com/a/524721/402706
var head = document.head;
var style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet){
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}

head.appendChild(style);
