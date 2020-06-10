
const dispatcher = {
	instance: null,
	events: []
};

const EVENT =
{
SkipOpening: "SkipOpening",
ShowStartup: "ShowStartup", // スタートアップ画面表示。VRか、NORMALか選択する画面
ShowCategory: "ShowCategory", // スタートアップ画面 --> カテゴリ一覧を表示
ShowPoster: "ShowPoster", // カテゴリ一覧画面 --> ポスター画面表示
ShowDetail: "ShowDetail", // ポスター画面 --> 詳細画面表示
BackToCategory: "BackToCategory", // ポスター画面 --> カテゴリー一覧に戻る
BackToPoster: "BackToPoster", // 詳細画面 --> ポスター画面に戻る

VRModeSelected: "VRModeSelected", // VRモードを選択した時
VRModeStart: "VRModeStart", // VRモードをスタートした時
ShowVREnterace: "ShowVREnterace",

// ぶちょーデバッグ用（※のちほど、以下全てはShowCategoryに差し替えます）
  ShowCategoryA: "ShowCategoryA", // カテゴリーAを選択したとき
  ShowCategoryB: "ShowCategoryB", // カテゴリーBを選択したとき
  ShowCategoryC: "ShowCategoryC", // カテゴリーCを選択したとき
  ShowCategoryD: "ShowCategoryD", // カテゴリーDを選択したとき
  ShowCategoryE: "ShowCategoryE", // カテゴリーEを選択したとき
  ShowCategoryF: "ShowCategoryF", // カテゴリーFを選択したとき
  ShowCategoryG: "ShowCategoryG", // カテゴリーSを選択したとき
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
