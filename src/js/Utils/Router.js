import Router from "vanilla-router";
import { EVENT, Action } from "./../Utils/EventManager";

const _Router =
{
	router: null,
	queryLabel: "path",
	init()
	{
		console.log("Router init.");

		const router = new Router({
			mode: 'history',
			page404: path =>
			{
				/*
				Convert URL and dispath event
				https://openhouse.nii.ac.jp/session/a/01/
				https://openhouse.nii.ac.jp/session/?path=a/01/
				*/
				const param = path.replace(/\/|(session)?/g, "");

				if (!this.check(param)) {
					location.href = "/session";
				}

				console.group();
				console.log("Router report:");
				console.log(`path: ${path}, slug: ${param}`);
				console.groupEnd();

				Action.dispatch(EVENT.ShowDetail, { slug: param });
			}
		});

		router.add("/session", path => {});
		router.addUriListener();
		router.navigateTo("/session/" + location.search.replace(`?${this.queryLabel}=`, ""));
	},

	check(str)
	{
		const test1 = /^[abcdefgs]\d{2}$/.test(str);

		return test1;
	}
};

export default _Router;