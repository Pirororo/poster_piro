import * as THREE from 'three';
import { posterData } from './posterData';
import PosterBoard_xr from './elements/posterBoard_xr';

import { EVENT, SELECTORS } from "./../Utils/Props";
export default class App
{
  constructor(){}

  init(scene)
  {
    this.scene = scene;

    this.setup();
    this.addBoard();
  }

  setup()
  {
    this.containers = {
      image: null,
      title: null
    };

    this.posterData = posterData.a;
    this.boardLength = this.posterData.imgPath.length;
    this.boardPosRadius = 20;
    this.boardAngle = 360 / this.boardLength;
    this.categoryAngle = 360 + this.boardAngle / 2;
    this.boardPositionY = 0;


    this.boardList = [];
  }

  draw(){}

  addBoard()
  {
    const imageEntity = document.createElement("a-entity");
    const titleEntity = document.createElement("a-entity");

    this.containers.image = this.scene.appendChild(imageEntity);
    this.containers.title = this.scene.appendChild(titleEntity);

        // for (let i = 0; i < this.boardLength; i++) {
    for (let i = 0; i < 10; i++)
    {
      const parameter = {
        scene: this.scene,
        index: i,
        imgPath: this.posterData.imgPath[i],
        posterTitle: this.posterData.posterTitle[i],
        titleContainer: this.containers.title
      };
      const board = new PosterBoard_xr(parameter);

      let posY

      if (i % 2 === 0)
      {
        posY = 10;
      } else {
        posY = 0;
      }

      board.setPosition(
        this.boardPosRadius * Math.cos(THREE.Math.degToRad(i * this.boardAngle + this.categoryAngle)),
        this.boardPositionY,
        // posY,
        this.boardPosRadius * Math.sin(THREE.Math.degToRad(i * this.boardAngle + this.categoryAngle))
      );
      board.lookAt();

      this.containers.image.appendChild(board.entity);
      this.boardList.push(board);
    }


  }
}
