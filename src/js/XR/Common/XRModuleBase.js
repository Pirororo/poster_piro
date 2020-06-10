import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

import { BOARD_ID, SELECTORS } from "../../Utils/Props";
import XRHudBoard from "./XRHudBoard";

export default
{
  init_base(scene)
  {
    this.isEnable = false;
    this.scene = scene;
    this.category = "a";
    this.containers = {
      hud: {
        back: null
      }
    };
    this.tween = null;
    this.boardList = [];
    this.hudUIList = [];
  },
  init(scene)
  {
    this.init_base(scene);
  },
  draw()
  {
    this.boardList.forEach(board => board.draw());
    this.hudUIList.forEach(ui => ui.draw());
    TWEEN.update();
  },
  destroy()
  {
    this.boardList.forEach(board => board.destroy());
    this.hudUIList.forEach(ui => ui.destroy());
    // TWEEN.removeAll();
  },

  generateContainer(id, container)
  {
    const target = document.getElementById(id);
    if (target != null) {
      return target;
    }
    const entity = document.createElement("a-entity");
    entity.setAttribute("id", id);
    return container.appendChild(entity);
  },

  generateHUD(id = BOARD_ID.UI.BackToCategory, position = [0, 10, -20])
  {
    this.containers[id] = this.generateContainer(SELECTORS.XRHudContainer, this.scene);

    const boardContent = document.getElementById(SELECTORS.HudUIStage);
    const parameter =
      {
        boardId: id,
        containers: {
          board: this.containers[id],
          boardContent,
          boardContentBody: "/img/ui/btn_back_vr.png"
        }
      };
    const instance = new XRHudBoard(parameter)
    instance.setPosition(...position);
    this.hudUIList.push(instance);

  },

  showBoard(width, boardList = this.boardList, radius = 20, offset = null)
  {
    const amount = boardList.length;
    const destAngle = width != null ? width + 2 : 360 / amount;
    offset = offset == null ? -90 - (amount - 1) * destAngle / 2 : offset;

    for (let i = 0; i < amount; i++)
    {
      const board = boardList[i];
      const boardAngle = i * destAngle + offset;

      board.setPosition(
        radius * Math.cos(THREE.Math.degToRad(boardAngle)),
        board.position.y,
        radius * Math.sin(THREE.Math.degToRad(boardAngle))
      );
      board.lookAt();
    }

    // const param = { angle: destAngle * 1 };

    // this.tween = new TWEEN.Tween(param)
    // .to({ angle: destAngle }, 1000)
    // .easing(TWEEN.Easing.Quadratic.InOut)
    // .onUpdate(() =>
    // {
    //   for (let i = 0; i < amount; i++)
    //   {
    //     const board = boardList[i];
    //     const boardAngle = i * param.angle + offset;

    //     board.setPosition(
    //       radius * Math.cos(THREE.Math.degToRad(boardAngle)),
    //       board.position.y,
    //       radius * Math.sin(THREE.Math.degToRad(boardAngle))
    //     );
    //     board.lookAt();
    //   }
    // })
    // .delay(500)
    // .start();
  }

}
