/**
 *  Helper.js
 *
 *
 */

import { VR } from "./Props";

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

const isVR = (scene = null) => {
	return VR.enable;
};

const setVRMode = (value = true) => {
	VR.enable = value;
};

const getWidth = () => {
	return window.innerWidth;
};
const getHeight = () => {
	return window.innerHeight;
};
const getStageSize = () => {
	return { w: getWidth(), h: getHeight() }
};
const getter = {
	getWidth, getHeight, getStageSize
};

export {
	WebXRPermissionHelper,
	isVR,
	setVRMode,
	getWidth,
	getHeight,
	getStageSize,
	getter
}