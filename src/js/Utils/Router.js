import Router from "vanilla-router";
import { EVENT, Action } from "./../Utils/EventManager";
import { UA } from "./../Utils/Props";

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
				const slug = path.replace(/\/|(session)?/g, "");

				// if (!this.check(slug)) {
				// 	location.href = "/session";
				// }

				console.group();
				console.log("Router report:");
				console.log(`path: ${path}, slug: ${slug}`);
				console.groupEnd();

				Action.dispatch(EVENT.ShowDetail, { slug });
			}
		});

		console.dir(UA);

		if (!UA.isValid()) {
			location.href = "/invalid.html";
		}

		router.add("/session", path => {});
		router.addUriListener();
		// router.navigateTo("/session/" + location.search.replace(`?${this.queryLabel}=`, ""));
	},

	check(str)
	{
		const test1 = /^[abcdefgs]\d{2}$/.test(str);

		return test1;
	}
};

export default _Router;