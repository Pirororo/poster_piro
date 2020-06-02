import axios from "axios";

const loadCSV = (path, callback) =>
{
	if (path == null) { return; }

	const request = new XMLHttpRequest();

	request.addEventListener('load', e =>
	{
		const result = e.target.responseText;

		callback({ result });
	});

	request.open('GET', path, true);
	request.send();
};

const convertCSVtoArray2D = (str, column = 3) =>
// const convertCSVtoArray2D = (str, column = 3) =>
{
	if (str == null) { return []; }

	let result = [];
	const tmp = str.split("\n");

	for(let i = 0; i < tmp.length; i++)
	{
		result[i] = tmp[i].split(",");
	}

	return result;
};

export {
	loadCSV,
	convertCSVtoArray2D
}
