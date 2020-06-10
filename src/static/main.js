/**
 * main.js
 *
 * script for TOP page
 */

import "./style.scss";
import { UA } from "./../js/Utils/Props";


window.addEventListener('DOMContentLoaded', (event) => {
	console.dir(UA);

	const startWrap = document.getElementById('start-wrap');
	const notification = document.getElementById('notification');


	if (!UA.isValid()) {
		// location.href = "/invalid.html";
		startWrap.setAttribute('class', 'invalid');
		notification.setAttribute('class', 'invalid');
	}
});


