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
    if (this.boardId == BOARD_ID.UI.BackToCategory || this.boardId == BOARD_ID.UI.BackToPoster)
    {
      this.materials.board = `shader: flat; color: #ccc; transparent: true; src: ${this.containers.boardContentBody}`;
      this.width = 8;
      this.height = this.width * 0.55;
      this.scale = new THREE.Vector3(this.width, this.height, 1);
    }
    else
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
    }

    this.createBoard();

    this.hide();
    setTimeout(() => {
      this.fadeIn(this.position);
    }, 1500);
  }

  onRaycastForcedOn(raycaster)
  {
    this.entities.board.object3DMap.mesh.material.color = new THREE.Color(1, 1, 1);
  }

  onRaycastForcedOff(raycaster)
  {
    this.entities.board.object3DMap.mesh.material.color = new THREE.Color(0.9, 0.9, 0.9);
  }
}
