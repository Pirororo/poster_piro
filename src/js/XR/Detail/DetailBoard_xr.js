import * as THREE from "three";
import BoardViewBase from "../Common/BoardViewBase";
import Content from "./DetailBoardContent";

export default class DetailBoard_xr extends BoardViewBase
{
  constructor(params)
  {
    super(params);

    this.width = 15;
    this.height = 15;
    this.scale = new THREE.Vector3(this.width, this.height, 1);
    this.materials = {
      board: `shader: html; color: #fff; transparent: true; target: #${this.name}`
    };
    this.init();
  }

  init()
  {
    const imgPath = "./../session/img/D05.png";

    switch(this.params.index)
    {
      case 1:
        this.materials.board = `shader: flat; color: #fff; src: ./../session/img/D05.png`;
        this.scale = new THREE.Vector3(this.width, this.height * 0.5625, 1);
        break
      case 3:
        this.materials.board = `shader: flat; color: #fff; src: ./../session/img/D06.png`;
        this.scale = new THREE.Vector3(this.width, this.height * 0.5625, 1);
        break;
      default:
        this.containers.boardContentBody = this.createContent(Content(this.params));
    }
    this.createBoard(
      "board",
      this.containers.board,
      this.materials.board,
      false
    );
  }
}
