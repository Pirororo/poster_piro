import { ICommonFacadeModuleObject } from "./../Utils/Interfaces";
import { SELECTORS } from "./../Utils/Props";
import { EVENT, Action } from "./../Utils/EventManager";

import "./style.scss";
import Content from "./content.html";

const App =
{
	...ICommonFacadeModuleObject,
	props: {},
  elements: {},
	init()
	{
    console.log("Startup Init.");

		this.elements.body = document.body;
		this.elements.container = document.getElementById(SELECTORS.StartupStage);
		this.elements.container.insertAdjacentHTML("afterbegin", Content);
		this.elements.contentContainer = document.getElementById(SELECTORS.StartupContentContainer);

		this.elements =
		{
			...this.elements,
			vrMode: document.getElementById(SELECTORS.StartupVRMode),
			normalMode: document.getElementById(SELECTORS.StartupNormalMode)
		};

		this.addEvent();

		return this;
	},

	setup()
	{
		this.elements.contentContainer.classList.add("active");
	},

	destroy()
	{
		this.elements.contentContainer.classList.remove("active");
	},

	addEvent()
	{
		this.elements.vrMode.addEventListener("click", () => {
			console.log("VR MODE");
			this.destroy();
			setTimeout(() => {
				Action.dispatch(EVENT.VRModeSelected);
			}, 1000);
		});

		this.elements.normalMode.addEventListener("click", () => {
			console.log("Normal MODE");
			this.destroy();
			Action.dispatch(EVENT.ShowCategory);
		});

		Action.add(EVENT.ShowStartup, () => this.setup());

		// setTimeout(() => {
		// 	Action.dispatch(EVENT.ShowStartup);
		// }, 100);
	}

};

export default App;
