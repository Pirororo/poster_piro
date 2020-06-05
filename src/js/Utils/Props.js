/**
 * Publically accessible parameters
 */

import { EVENT as _EVENT } from "./EventManager";

const VR = {
  enable: false,
};

const KEYCODE = {
  SPACE: 32,
};

const EVENT = _EVENT;
// const EVENT = {
//   ShowPoster: "ShowPoster",
//   ShowDetail: "ShowDetail",
//   BackToCategory: "BackToCategory",
//   BackToPoster: "BackToPoster",

//   VRModeStart: "VRModeStart",
//   ShowCategoryA: "ShowCategoryA",
//   ShowCategoryB: "ShowCategoryB",
//   ShowCategoryC: "ShowCategoryC",
//   ShowCategoryD: "ShowCategoryD",
//   ShowCategoryE: "ShowCategoryE",
//   ShowCategoryF: "ShowCategoryF",
//   ShowCategoryG: "ShowCategoryG"
// };

const SELECTORS =
{
  BackgroundContainer: "background_container",
  BackgroundStage: "WebGL-output",

  HudContainer: "hud_container",
  HudUIStage: "hud_ui_stage",

  CategoryContainer: "category_container",
  CategoryStage: "category_stage",

  GalleryContainer: "gallery_container",
  GalleryStage: "gallery_stage",

  DetailContainer: "detail_container",
  DetailStage: "detail_stage",
  DetailBlocker: "detail_blocker",

  XRScene: "xr_scene",
  XRCamera: "xr_camera",
  XRPlayer: "xr_player",
  Raycaster: "xr_raycaster",
  RaycastTarget: "xr_raycast_target",
  XRHudContainer: "xr_hud_container",

  XRCategoryBoardContainer: "xr_category_board_container",
  XRGalleryPosterPanelContainer: "xr_poster_panel_container",
  XRGalleryPosterTitleContainer: "xr_poster_title_container",

  XRDetailContainer: "xr_detail_container"
};

const COMPONENTS = {
  Background: "background-component",
  Gallery: "gallery-component",
  Detail: "detail-component",
  RaycastCheck: "raycast-check-component",
  RaycastTarget: "raycast-target-component",
};

const BOARD_ID = {
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

export {
	KEYCODE,
	EVENT,
	VR,
  SELECTORS,
  COMPONENTS,
  BOARD_ID,
  COLOR
};
