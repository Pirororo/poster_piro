import Router from "vanilla-router";
import { EVENT, Action } from "./../Utils/EventManager";

const _Router =
{
	router: null,
	init()
	{
		const router = new Router({
			mode: 'history',
			page404(path)
			{
					console.log('"/' + path + '" Page not found');
			}
		});

		router.add("", () =>
		{
			console.log('Home page');
			// router.navigateTo("/");
		});

		router.add("session", query =>
		{
			console.log(query);
		});

		router.add("session/(:any)", query =>
		{
			console.log(query);
		});

		// router.addUriListener();
		// router.navigateTo("/");
	}
};

export default _Router;