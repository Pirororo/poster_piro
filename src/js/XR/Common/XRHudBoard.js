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
    let content = `<div class="hud_ui">`;

    switch(this.boardId)
    {
      case BOARD_ID.UI.ShowCategoryA:
        content += "A";
        break;
      case BOARD_ID.UI.ShowCategoryD:
        content += "D";
        break;
      case BOARD_ID.UI.ShowCategoryG:
        content += "G";
        break;
      case BOARD_ID.UI.VRModeStart:
        content += "VR Mode Start";
        break;
      default:
        content += "BACK";
        break;
    }
    content += "</div>";

    this.containers.boardContentBody = this.createContent(content);
    this.createBoard();
    // console.log("HUD Generated.");
    // console.dir(this.entities.board);
  }
}
