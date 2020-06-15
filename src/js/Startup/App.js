import { ICommonFacadeModuleObject } from "./../Utils/Interfaces";
import { SELECTORS } from "./../Utils/Props";
import { EVENT, Action } from "./../Utils/EventManager";
import { show, hide } from "./../Utils/Helper";
import { SYNTH } from "./../Utils/Sound";

import "./style.scss";
import Content from "./content.html";

const App =
{
	...ICommonFacadeModuleObject,
	props: {
		isSelected: false
	},
	elements: {},
	init() {
		console.log("Startup Init.");

		this.elements.body = document.body;
		this.elements.container = document.getElementById(SELECTORS.StartupStage);
		this.elements.container.insertAdjacentHTML("afterbegin", Content);

		this.elements =
		{
			...this.elements,
			vrMode: document.getElementById(SELECTORS.StartupVRMode),
			normalMode: document.getElementById(SELECTORS.StartupNormalMode)
		};

		return this;
	},

	setup() {
		if (this.props.isSelected) { return; }
		this.props.isSelected = true;
		show(SELECTORS.StartupContainer);
		SYNTH.categoryIn();
	},

	destroy() {
		hide(SELECTORS.StartupContainer);
	},

	addEvent() {
		this.elements.vrMode.addEventListener("click", () => {
			console.log("VR MODE");
			this.destroy();
			setTimeout(() => {
				Action.dispatch(EVENT.VRModeSelected);
				Action.dispatch(EVENT.VRModeStart);
			}, 1000);
			SYNTH.btnSound();

		});

		this.elements.normalMode.addEventListener("click", () => {
			console.log("Normal MODE");
			this.destroy();

			Action.dispatch(EVENT.ShowCategory, {
				mode: "normal"
			});
			SYNTH.btnSound();

		});

		Action.add(EVENT.SkipOpening, () => this.setup());
		Action.add(EVENT.ShowStartup, () => this.setup());

		// setTimeout(() => {
		// 	Action.dispatch(EVENT.ShowStartup);
		// }, 100);
	}

};

export default App;
