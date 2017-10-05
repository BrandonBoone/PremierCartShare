// https://stackoverflow.com/a/20023723/402706

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Inform the background page that 
// this tab should have a page-action
chrome.runtime.sendMessage({
	from:    'content',
	subject: 'showPageAction'
});


// https://stackoverflow.com/a/20513730/402706
// https://stackoverflow.com/a/9636008/402706
var s = document.createElement('script');
s.src = chrome.extension.getURL('src/inject/updateCart.js');
(document.head||document.documentElement).appendChild(s);
s.onload = function() {
    s.remove();
};

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
	// First, validate the message's structure
	if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
		// Collect the necessary data 
		// (For your specific requirements `document.querySelectorAll(...)`
		//  should be equivalent to jquery's `$(...)`)
		const nodes = document.querySelectorAll('[data-item-code]');
		if(nodes && nodes.length > 0) {

			const values = Array.prototype.map.call(
				nodes,
				(node) => node.attributes.getNamedItem('data-item-code').nodeValue
			);
			// console.log(values);
			response(values);
		}
		// Directly respond to the sender (popup), 
		// through the specified callback */
		
	} else if ((msg.from === 'popup') && (msg.subject === 'updateMyCart')) {
		document.dispatchEvent(new CustomEvent('cart_connectExtension', {
			detail: msg.values
		}));
	}
});

const updateCartFromUrl = () => {
	var param = getParameterByName('addToCart');

	if (param) {
		document.dispatchEvent(new CustomEvent('cart_connectExtension', {
			detail: param
		}));
	}
}
setTimeout(() => updateCartFromUrl(), 150);

