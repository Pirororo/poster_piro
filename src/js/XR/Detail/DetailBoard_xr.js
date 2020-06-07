import * as THREE from "three";
import BoardViewBase from "../Common/BoardViewBase";
import Content from "./DetailBoardContent";

export default class DetailBoard_xr extends BoardViewBase
{
  constructor(params)
  {
    super(params);

    this.width = 18;
    this.height = 18; //this.width * 0.5625;
    this.scale = new THREE.Vector3(this.width, this.height, 1);
    this.materials = {
      board: `shader: html; color: #fff; transparent: true; target: #${this.name}`
    };
    this.init();
  }

  init()
  {
    const { data } = this.params;
    const key = Object.keys(data)[0];
    const imageDir = "./../session/pdf_img/";

    switch(key)
    {
      case "image":
        this.materials.board = `shader: flat; color: #fff; src: ${imageDir}${data[key]}`;
        this.width = 18;
        this.height = this.width * 0.5625;
        this.scale = new THREE.Vector3(this.width, this.height, 1);
        break
      default:
        data[key].key = key;
        this.containers.boardContentBody = this.createContent(Content(data[key]));
    }
    this.createBoard(
      "board",
      this.containers.board,
      this.materials.board,
      false
    );
  }
}
