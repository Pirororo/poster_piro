import { CSS3DObject } from "./CSS3DRenderer";

const pdfjsLib = window.pdfjsLib;

export default class PdfElement
{
	constructor( x, y, z, ry )
	{
		this.room_id = 'a07';

		var canvas = document.createElement( 'canvas' );
		canvas.width = 800;
		canvas.height = 500;

		var ctx = canvas.getContext('2d');

		var loadingTask = pdfjsLib.getDocument(`./pdf/${this.room_id}.pdf`);
		loadingTask.promise.then(function(pdf) {
			var scale = 800 / 720;
			var pageNum = 1;
			var pdfDoc = pdf;
			renderPage(pageNum);

			function renderPage(num){
				pdfDoc.getPage(num).then(function(page) {
					var viewport = page.getViewport({scale: scale});
					var renderContext = {
						canvasContext: ctx,
						viewport: viewport
					};
					var renderTask = page.render(renderContext);
					renderTask.promise.then(
						function () {
							console.log('Page rendered');
						}
					);
				});
			}
		});

		var object = new CSS3DObject( canvas );
		object.position.set( x, y, z );
		object.rotation.y = ry;

		return object;
	}
}

