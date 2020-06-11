import * as THREE from "three";
import BoardViewBase from "../Common/BoardViewBase";
import Content from "./EntranceBoardContent";

export default class EntranceBoard_xr extends BoardViewBase
{
  constructor(params)
  {
    super(params);

    this.width = 20;
    this.height = this.width * 0.5625;
    this.scale = new THREE.Vector3(this.width, this.height, 1);
    this.materials = {
      board: `shader: flat; color: #fff; transparent: true; src: /img/ui/vr_start_screen.png`
    };
    this.init();
  }

  init()
  {
    this.createBoard();
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
