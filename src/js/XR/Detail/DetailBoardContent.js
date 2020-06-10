export default (data) =>
{
	const {
		slug,
		category_jp,
		category_en,
		theme_jp,
		theme_en,
		title_jp,
		title_en,
		leader_name_jp,
		leader_name_en,
		research_field_jp,
		research_field_en,
		group_members_jp,
		group_members_en,
		summary
		// summary_jp,
		// summary_en,
		// summary_split
	} = data;
	let output = `
	<div class="detail_content_container summary entry_${slug}">
	<div class="detail_content_container_inner">
	`;

	// console.log(data.key);

	switch(data.key)
	{
		case "meta":
			output = `${output}
			<header class="detail_header_container">
			<div class="slug">${slug.toUpperCase()}</div>
			<div class="detail_header_label_container">
			<p class="category_jp">${category_jp}</p>
			<p class="category_en">${category_en}</p>
			</div>
			</header>

			<div class="detail_theme_container">
			<p class="theme_jp">${theme_jp}</p>
			<p class="theme_en">${theme_en}</p>
			</div>
			<div class="detail_title_container">
			<h1 class="title_jp">${title_jp}</h1>
			<p class="title_en">${title_en}</p>
			</div>
			<div class="detail_author_container">
			<p class="leader_name_jp">${leader_name_jp}</p>
			<p class="leader_name_en">${leader_name_en}</p>
			<p class="research_field_jp">${research_field_jp}</p>
			<p class="research_field_en">${research_field_en}</p>
			<p class="group_members_jp">${group_members_jp}</p>
			<p class="group_members_en">${group_members_en}</p>
			</div>
			`;
			break;
		case "summary":
			output = `${output}
			<div class="detail_summary_container">
			<p class="summary">${summary}</p>
			</div>
			`;
			// output = `${output}
			// <div class="detail_summary_container ${summary_split ? 'split' : ""}">
			// <p class="summary_jp">${summary_jp || ""}</p>
			// <p class="summary_en">${(summary_jp == summary_en ? "" : summary_en) || ""}</p>
			// </div>
			// `;
			break;
		default:
			break;
	}

	output = `${output}</div></div>`;

	return output;
}
