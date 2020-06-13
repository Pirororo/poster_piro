import { convertCSVtoArray2D, loadCSV } from "../../Utils/AssetsLoader";


var Stats = function () {

	var mode = 0;
	let data = [];
	let DATAisOK = false;

	var container = document.createElement( 'div' );
	container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
	container.addEventListener( 'click', function ( event ) {

		event.preventDefault();
		showPanel( ++ mode % container.children.length );

	}, false );

	//

	function addPanel( panel ) {

		container.appendChild( panel.dom );
		return panel;

	}

	function showPanel( id ) {

		for ( var i = 0; i < container.children.length; i ++ ) {

			container.children[ i ].style.display = i === id ? 'block' : 'none';

		}
		mode = id;
	}


	function loadCSVandConvertToArray2D(){
		loadCSV("../data/kanto_7area_raw.csv", e =>
		{
			const result = e.result;
			let getData = convertCSVtoArray2D(result);
			doSomething(getData);

		});
	}

	function doSomething(getData){
		DATAisOK = true;
		data = getData;

		console.log("dosom");
		console.log(data[0][0]);
	}


	var fpsPanel = addPanel( new Stats.Panel( '#E8e8E8', '#000000' ) );

	
	loadCSVandConvertToArray2D();
	showPanel( 0 );


	return {

		REVISION: 16,

		dom: container,

		addPanel: addPanel,
		showPanel: showPanel,


		update: function () {

			if(DATAisOK ==  true){
				fpsPanel.update( data );
			}
		},

		domElement: container,
		setMode: showPanel

	};

};


Stats.Panel = function ( fg, bg ) {

	
	let Times = 0;
	var round = Math.round;
	var PR = round( window.devicePixelRatio || 1 );

	var WIDTH = 480 * PR, HEIGHT = 36 * PR,
			TEXT_X = 3 * PR, TEXT_Y = 2 * PR;
	var canvas = document.createElement( 'canvas' );
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.cssText = 'width:1080px;height:81px';//////大きさ?

	var context = canvas.getContext( '2d' );
	context.font = 'reguler ' + ( 9 * PR ) + 'px Helvetica,Arial,sans-serif';
	context.textBaseline = 'top';
	context.fillStyle = bg;
	context.fillRect( 0, 0, WIDTH, HEIGHT );

	context.fillStyle = fg;
	context.fillText( name, TEXT_X, TEXT_Y );

	return {

		dom: canvas,

		update: function ( data ) {

			context.fillStyle = bg;
			context.globalAlpha = 1.0;
			context.fillRect( 0, 0, WIDTH, HEIGHT );

			context.fillStyle = fg;
			
			let title = " SINET DATA TRAFFIC [BPS] : KANTO TO";
			context.fillText( title , TEXT_X, TEXT_Y +5);

			let area = ["HOKKAIDO                        ",
						"CHUBU                           ",
						"   KINKI                           ",
						"     CHUGOKU/SHIKOKU          ",
						"KYUSHU                          ",
						"AMSTERDAM                       ",
						"LOS ANGELES                     "];
			context.fillText("           "
								+ area[0] + area[1] + area[2] 
								+ area[3] + area[4] + area[5] + area[6],
							TEXT_X,TEXT_Y +20 );

			let nameIN = "  IN      ";
			context.fillText( nameIN 
								+ data[Times][2*0+1] + '                     '
								+ data[Times][2*1+1] + '                     '
								+ data[Times][2*2+1] + '                     '
								+ data[Times][2*3+1] + '                     '
								+ data[Times][2*4+1] + '                     '
								+ data[Times][2*5+1] + '                     '
								+ data[Times][2*6+1] + '                     '
								, TEXT_X, TEXT_Y +35 );

			let nameOUT = "  OUT  ";
			context.fillText( nameOUT 
								+ data[Times][2*0+2] + '                     '
								+ data[Times][2*1+2] + '                     '
								+ data[Times][2*2+2] + '                     '
								+ data[Times][2*3+2] + '                     '
								+ data[Times][2*4+2] + '                     '
								+ data[Times][2*5+2] + '                     '
								+ data[Times][2*6+2] + '                     '
								, TEXT_X, TEXT_Y +50 );

			Times += 1;
		}

	};

};

export default Stats;
