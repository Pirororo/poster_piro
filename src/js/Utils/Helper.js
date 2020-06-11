/**
 *  Helper.js
 *
 *
 */

import { VR, DebugMode } from "./Props";

const WebXRPermissionHelper =
{
	clickRequestDeviceSensor()
	{
			//. ユーザーに「許可」を求めるダイアログを表示
			DeviceOrientationEvent.requestPermission().then( function( response ){
				if( response === 'granted' ){
					//. 許可された場合のみイベントハンドラを追加できる
					window.addEventListener( "deviceorientation", this.deviceOrientation );
					//. 画面上部のボタンを消す
					document.getElementById("sensorrequest").style.display = "none";
				}
			}).catch( function( e ){
				console.log(e);
			});
	},
	deviceOrientation(e)
	{
		e.preventDefault();
		var dir = e.alpha;   //. 北極方向に対する向きの角度
		var fb = e.beta;      //. 前後の傾き角度
		var lr = e.gamma;  //. 左右の傾き角度
	},
	init()
	{
		if( window.DeviceOrientationEvent )
		{
			if( DeviceOrientationEvent.requestPermission && typeof DeviceOrientationEvent.requestPermission === 'function' )
			{
				var banner = '<button id="sensorrequest">センサーの有効化</button>';
				document.getElementById("dialog").innerHTML = banner;
				document.getElementById("sensorrequest").addEventListener("click", this.clickRequestDeviceSensor);

			}else{
				window.addEventListener( "deviceorientation", this.deviceOrientation );
			}
		}
	}
};

const getVRMode = () => VR.enable;
const setVRMode = (value = true) => VR.enable = value;
const isVR = () => VR.enable;

const setDebugMode = (value = true) => DebugMode.enable = value;
const getDebugMode = () => DebugMode.enable;
const isDebugMode = () => DebugMode.enable;

const getWidth = () => {
	return window.innerWidth;
};
const getHeight = () => {
	return window.innerHeight;
};
const getStageSize = () => {
	return { w: getWidth(), h: getHeight() }
};

const invoke = (func, time = 0, args = {}) =>
{
	if (func == null) { return; }
	setTimeout(() => func(args), time);
};

const getElement = id => {
	if (id == null) { return null; }
	return document.getElementById(id);
};

const display = (id, action = "show") => {
	const element = document.getElementById(id);
	if (element == null) {
		console.log(`${id} is not found`);
		return false;
	}
	if (action === "show")
	{
		element.classList.add("show");
		element.classList.remove("hide");
	}
	else if (action === "hide")
	{
		element.classList.add("hide");
		element.classList.remove("show");
	}
};
const show = id => {
	display(id, "show");
};
const hide = id => {
	display(id, "hide");
};

const getParamsFromURIQueries = () =>
{
	const queryString = location.search.substring(1);
	if (queryString == null) { return null; }

	const queries = queryString.split("&");
  const params = {};
	for (let i = 0, len = queries.length; i < len; i++)
	{
		const keyValue = queries[i].split("=");
		params[keyValue[0]] = keyValue[1];
	}
	return params;
}

export {
	WebXRPermissionHelper,

	isVR,
	setVRMode,
	getVRMode,
	isDebugMode,
	setDebugMode,
	getDebugMode,

	getWidth,
	getHeight,
	getStageSize,

	invoke,
	getElement,
	show,
	hide,
	getParamsFromURIQueries
}