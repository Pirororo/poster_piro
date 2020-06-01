/**
 * Publically accessible parameters
 */

const KEYCODE = {
  SPACE: 32,
};

const EVENT = {
  ShowDetail: "ShowDetail",
};

const VR = {
  enable: false,
};

const SELECTORS = {
  GalleryContainer: "gallery_container",
  GalleryStage: "gallery_stage",
  GalleryPostersContainer: "gallery_poster_container",

  DetailContainer: "detail_container",
  DetailStage: "detail_stage",
  DetailBlocker: "detail_blocker",

  XRScene: "xr_scene",
  XRCamera: "xr_camera",
  XRPlayer: "xr_player",
  Raycaster: "xr_raycaster",
  RaycastTarget: "xr_raycast_target",
};

const COMPONENTS = {
  Background: "background-component",
  Gallery: "gallery-component",
  Detail: "detail-component",
  RaycastCheck: "raycast-check-component",
  RaycastTarget: "raycast-target-component",
};

export {
	KEYCODE,
	EVENT,
	VR,
  SELECTORS,
  COMPONENTS
};
