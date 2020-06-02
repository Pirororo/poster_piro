/**
 * Class Composer
 *
 * Assembling each module instances.
 */

import Background from "./Background/Facade"; // will be created by Piro
import Gallery from "./Gallery/Facade"; // will be created by Yonekura
import Detail from "./Detail/Facade"; // will be created by Shinagawa
import XRHelper from "./XR/Facade"; // will be created by Beharu

import { isVR } from "./Utils/Helper";
// import { convertCSVtoArray2D, loadCSV } from "./Utils/AssetsLoader";

const Composer =
{
	props: {
		isPause: false,
	},
	instances: {},
	init()
	{
		if (isVR()) {
			this.instances.xr = XRHelper.init();
		}
		else
		{
			this.instances.background = Background.init();
			this.instances.gallery = Gallery.init();
			this.instances.detail = Detail.init();
		}

		this.addEvent();
		this.setup();

		// // This is just test code
		// this.loadCSVandConvertToArray2D();

		return this;
  },
	setup(options = {})
	{
		this.instances.forIn((k, instance) => instance.setup());
    this.update();
  },
	update()
	{
		this.instances.forIn((k, instance) => instance.update());

		window.requestAnimationFrame(() =>
		{
			if (!this.props.isPause)
			{
				this.update();
			}
		});

		this.draw();
	},
	draw()
	{
		this.instances.forIn((k, instance) => instance.draw());
	},
	destroy()
	{
	},
	pause()
	{
		this.props.isPause = true;
	},
	resume()
	{
		this.props.isPause = false;
	},

	onResize()
	{
		this.instances.forIn((k, instance) => instance.onResize());
	},
	onMouseMove(e)
	{
		this.instances.forIn((k, instance) => instance.onMouseMove(e));
	},
	onKeyUp(e)
	{
		this.instances.forIn((k, instance) => instance.onKeyUp(e));
	},
	onClick(e)
	{
		this.instances.forIn((k, instance) => instance.onClick(e));
	},

	addEvent(events)
	{

	},

	// // This is just test code
	// loadCSVandConvertToArray2D()
	// {
	// 	loadCSV("../data/kanto_hokkaido.csv", e =>
	// 	{
	// 		const result = e.result;
	// 		let data = convertCSVtoArray2D(result);
	// 		this.doSomething(data);

	// 		console.group();
	// 		console.log("Data from csv");
	// 		console.dir(data);
	// 		// console.log(this.data[0][0]);//こっちは値が取得できる
	// 		console.groupEnd();
	// 	});

	// 	// console.log(data[0][0]);//こっちは値が取得できない

	// },

	// doSomething(data)
	// {
	// 	console.log(data[0][0]);//こっちは値が取得できる
	// }
};

export default Composer;