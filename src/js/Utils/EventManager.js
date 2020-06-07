
const dispatcher = {
	instance: null,
	events: []
};

const EVENT = {
  ShowPoster: "ShowPoster",
  ShowDetail: "ShowDetail",
  BackToCategory: "BackToCategory",
  BackToPoster: "BackToPoster",

  VRModeStart: "VRModeStart",
  ShowCategoryA: "ShowCategoryA",
  ShowCategoryB: "ShowCategoryB",
  ShowCategoryC: "ShowCategoryC",
  ShowCategoryD: "ShowCategoryD",
  ShowCategoryE: "ShowCategoryE",
  ShowCategoryF: "ShowCategoryF",
  ShowCategoryG: "ShowCategoryG"
};

const createDispatcher = () =>
{
	if (dispatcher.instance != null)
	{
		return dispatcher.instance;
	}
	return document.createElement("div");
};

const Action =
{
	dispatch: (event, args) =>
	{
		if (!(event in EVENT) || dispatcher.instance == null) {
			return false;
		}
		dispatcher.instance.dispatchEvent(new CustomEvent(event, { detail: args }));
	},

	addListener: (event, callback) =>
	{
		if (!(event in EVENT)) {
			return false;
		}
		dispatcher.instance = createDispatcher();
		dispatcher.instance.addEventListener(event, e => {
			if (callback != null) {
				callback(e.detail);
			}
		});
		dispatcher.events.push({ event: callback });
	},
	addEventListener(event, callback){ this.addListener(event, callback); },
	add(event, callback) { this.addListener(event, callback); }
}

export {
	EVENT,
	Action
};
