export default (params) =>
{
	const key = "abcdefs".substr(params.index, 1);
	const { categoryEn, categoryJp, copy } = params.data[key];
	const categoryID = key === "s" ? "特別展示" : key.toUpperCase();

	return `
		<div class="category_content_container category_${key}">
			<div class="category_id">${categoryID}</div>
			<div class="category_title english">${categoryEn}</div>
			<div class="category_title japanese">${categoryJp}</div>
			<div class="category_copy">${copy}</div>
		</div>
	`;
}
