/**
 * Publically accessible parameters
 */

import { EVENT as _EVENT } from "./EventManager";
import { getElement } from "./Helper";

const VR = {
  enable: false,
};

const KEYCODE = {
  SPACE: 32,
};

const EVENT = _EVENT;

const SELECTORS =
{
  ContentContainer: "content_container",
  ContentContainerXR: "xr_mode",

  BackgroundContainer: "background_container",
  BackgroundStage: "WebGL-output",

  HudContainer: "hud_container",
  HudUIStage: "hud_ui_stage",

  StartupContainer: "startup_container",
  StartupStage: "startup_stage",
  StartupContentContainer: "startup_content_container",
  StartupVRMode: "startup_vrmode_container",
  StartupNormalMode: "startup_normalmode_container",

  EntranceContainer: "entrance_container",
  EntranceStage: "entrance_stage",

  CategoryContainer: "category_container",
  CategoryStage: "category_stage",

  GalleryContainer: "gallery_container",
  GalleryStage: "gallery_stage",

  DetailContainer: "detail_container",
  DetailStage: "detail_stage",
  DetailFrame: "detail_frame",

  XRScene: "xr_scene",
  XRCamera: "xr_camera",
  XRPlayer: "xr_player",
  Raycaster: "xr_raycaster",
  RaycastTarget: "xr_raycast_target",
  XRHudContainer: "xr_hud_container",

  XREntranceBoardContainer: "xr_entrance_board_container",
  XRCategoryBoardContainer: "xr_category_board_container",
  XRGalleryPosterPanelContainer: "xr_poster_panel_container",
  XRGalleryPosterTitleContainer: "xr_poster_title_container",

  XRDetailContainer: "xr_detail_container"
};

const COMPONENTS = {
  Background: "background-component",
  Entrance: "entrance-component",
  Gallery: "gallery-component",
  Detail: "detail-component",
  RaycastCheck: "raycast-check-component",
  RaycastTarget: "raycast-target-component",
  RaycastCursorListener: "raycast-cursor-listener-component",
};

const BOARD_ID = {
  Entrance: "entrance",
  Category: "category",
  Poster: "poster",
  Detail: "detail",
  UI: {
    BackToCategory: "ui_back_category",
    BackToPoster: "ui_back_poster",

    VRModeStart: "VRModeStart",
    ShowCategoryA: "ShowCategoryA",
    ShowCategoryB: "ShowCategoryB",
    ShowCategoryC: "ShowCategoryC",
    ShowCategoryD: "ShowCategoryD",
    ShowCategoryE: "ShowCategoryE",
    ShowCategoryF: "ShowCategoryF",
    ShowCategoryG: "ShowCategoryG"

  }
};

const COLOR = {
  RaycastFocusOff: 0x999999,
  RaycastFocusOn: 0xFFFFFF
};

const UA = ((ua) =>
{
	return {
		ua,
		isIE: (() => ua.indexOf('msie') != -1 || ua.indexOf('trident') != -1)(),
		isEdge: (() => ua.indexOf('edge') != -1)(),
		isChrome: (() => ua.indexOf('chrome') != -1)(),
		isSafari: (() => ua.indexOf('safari') != -1 && ua.indexOf('chrome') == -1)(),
		isFirefox: (() => ua.indexOf('firefox') != -1)(),
		isOpera: (() => ua.indexOf('opera') != -1)(),
		isIOS: /i(phone|pod|pad)/.test(ua),
		isIOSChrome: /crios/.test(ua),
		isIPhone: /i(phone|pod)/.test(ua),
		isIPad: /ipad/.test(ua),
		isAndroid: /android/.test(ua),
		isAndroidMobile: /android(.+)?mobile/.test(ua),
		isTouchDevice: 'ontouchstart' in window,
		isMobile: /i(phone|pod)/.test(ua)||/android(.+)?mobile/.test(ua),
		isTablet: /ipad/.test(ua)||/android(.+)(?!mobile)/.test(ua)
	}
})(window.navigator.userAgent.toLowerCase());

UA.isValid = () => {
  const pc = !UA.isMobile && (UA.isChrome || UA.isSafari);
  const mobile = UA.isMobile && (UA.isSafari || UA.isChrome)

//  console.log(`Result: ${pc || mobile}, PC: ${pc}, Mobile: ${mobile}`);

  return pc || mobile;
};

UA.isAndroidChrome = () => {
  return UA.isAndroidMobile && UA.isChrome;
};

export {
	KEYCODE,
	EVENT,
	VR,
  SELECTORS,
  COMPONENTS,
  BOARD_ID,
  COLOR,
  UA
};
