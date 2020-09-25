/* Sergio Perez-Valentin */
/* September 24, 2020 */

function getWidth() {
    document.documentElement.clientWidth
}

function getHeight() {
    document.documentElement.clientHeight
}

timer = setInterval(function() {
	var wid = (getWidth()/1770);
	document.body.style.transform = 'scale(' + getWidth()/1770 + ')';
	document.body.style['-o-transform'] = 'scale(' + document.documentElement.clientWidth/1770 + ')';
	document.body.style['-webkit-transform'] = 'scale(' + document.documentElement.clientWidth/1770 + ')';
	document.body.style['-moz-transform'] = 'scale(' + document.documentElement.clientWidth/1770 + ')';
}, 200);
