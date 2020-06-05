import * as THREE from "three";
import BoardViewBase from "./BoardViewBase";
import { BOARD_ID } from "../../Utils/Props";

export default class XRHudBoard extends BoardViewBase
{
  constructor(params)
  {
    super(params);

    this.width = 12;
    this.height = 12;
    this.scale = new THREE.Vector3(this.width, this.height, 1);
    this.init();
  }

  init()
  {
    let content;

    switch(this.boardId)
    {
      case BOARD_ID.UI.ShowCategoryA:
        content = `
        <div class="hud_ui" style="background-color: #ccc">A</div>
        `;
        break;
      case BOARD_ID.UI.ShowCategoryD:
        content = `
        <div class="hud_ui" style="background-color: #ccc">D</div>
        `;
        break;
      case BOARD_ID.UI.ShowCategoryG:
        content = `
        <div class="hud_ui" style="background-color: #ccc">G</div>
        `;
        break;
      case BOARD_ID.UI.VRModeStart:
        content = `
        <div class="hud_ui" style="background-color: #ccc">VR Mode Start</div>
        `;
        break;
      default:
        content = `
        <div class="hud_ui" style="background-color: #ccc">BACK</div>
        `;
        break;
    }

    this.containers.boardContentBody = this.createContent(content);
    this.createBoard();
    // console.log("HUD Generated.");
    // console.dir(this.entities.board);
  }
}
