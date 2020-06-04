import * as THREE from "three";
import BoardViewBase from "./BoardViewBase";

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
      default:
        content = `
        <div class="hud_ui_back" style="background-color: #ccc">BACK</div>
        `;
        break;
    }

    this.containers.boardContentBody = this.createContent(content);
    this.createBoard();
    console.log("HUD Generated.");
    console.dir(this.entities.board);
  }
}
