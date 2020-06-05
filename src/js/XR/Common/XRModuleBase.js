import * as THREE from "three";
import { BOARD_ID, SELECTORS } from "../../Utils/Props";
import XRHudBoard from "./XRHudBoard";

export default
{
  init_base(scene)
  {
    this.scene = scene;
    this.containers = {
      hud: {
        back: null
      }
    };
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
  },
  destroy()
  {
    this.boardList.forEach(board => board.destroy());
    this.hudUIList.forEach(ui => ui.destroy());
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

  generateHUD(id = BOARD_ID.UI.BackToCategory, position = [0, 12, -20])
  {
    this.containers[id] = this.generateContainer(SELECTORS.XRHudContainer, this.scene);

    const boardContent = document.getElementById(SELECTORS.HudUIStage);
    const parameter =
      {
        boardId: id,
        containers: {
          board: this.containers[id],
          boardContent
        }
      };
    const instance = new XRHudBoard(parameter)
    instance.setPosition(...position);
    this.hudUIList.push(instance);

  },
  showBoard(width, boardList = this.boardList, radius = 20, offset = null)
  {
    const amount = boardList.length;
    const angle = width != null ? width + 2 : 360 / amount;
    offset = offset == null ? -90 - (amount - 1) * angle / 2 : offset;

    for (let i = 0; i < amount; i++)
    {
      const board = boardList[i];
      const boardAngle = i * angle + offset;

      board.setPosition(
        radius * Math.cos(THREE.Math.degToRad(boardAngle)),
        board.position.y,
        radius * Math.sin(THREE.Math.degToRad(boardAngle))
      );
      board.lookAt();
    }
  }

}
