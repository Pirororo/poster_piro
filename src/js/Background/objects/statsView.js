import * as THREE from "three";
import { convertCSVtoArray2D, loadCSV } from "../../Utils/AssetsLoader";
//米倉先生より

// export default class statsView extends THREE.Object3D {
export default class StatsView {

    constructor(stage) {
    // constructor() {

        // super();

        this.loadCSVandConvertToArray2D = this.loadCSVandConvertToArray2D.bind(this);
        this.doSomething = this.doSomething.bind(this);

        this.DATAisOK = false;
        this.data = [];
        this.Times = 0;

        this.stage = stage;

        this.statsData =[
            {
            area:"HOKKAIDO",
            in: 123456789,
            out:987654321
            },
            {
            area:"CHUBU",
            in: 123456789,
            out:987654321
            },
            {
            area:"KINKI",
            in: 123456789,
            out:987654321
            },
            {
            area:"CHUGOKU/SHIKOKU",
            in: 123456789,
            out:987654321
            },
            {
            area:"KYUSHU",
            in: 123456789,
            out:987654321
            },
            {
            area:"AMSTERDAM",
            in: 123456789,
            out:987654321
            },
            {
            area:"LOSANGELES",
            in: 123456789,
            out:987654321
            },
        ];
    }

    setup(){
        this.createElement();
        this.loadCSVandConvertToArray2D();
    }


    createElement(){
        this.statsContainer = document.createElement('div');
        this.statsContainer.setAttribute('id','stats-container');

        // tiitle SINET DATA TRAFFIC [BPS] : KANTO TO
        this.statsTitle = document.createElement('div');
        this.statsTitle.setAttribute('id','stats-title');
        this.statsTitleText = "SINET DATA TRAFFIC [BPS] : EACH AREA <-> KANTO "
        const textNode = document.createTextNode(this.statsTitleText);
        this.statsTitle.appendChild(textNode);
        this.statsContainer.appendChild(this.statsTitle);
        this.statsList = document.createElement('ul');
        this.statsList.setAttribute('id','stats-list');

        // //headlist'IN OUT'
        // this.statsHeadList = document.createElement('li');
        // this.statsHeadList.setAttribute('id','stats-list-head');
        // this.statsList.appendChild(this.statsHeadList);

        // //inout list
        // this.inoutList = document.createElement('ul');
        // this.inList = document.createElement('li');
        // this.inList.appendChild(document.createTextNode('IN'));
        // this.inoutList.appendChild(this.inList);
        // this.outList = document.createElement('li');
        // this.outList.appendChild(document.createTextNode('OUT'));
        // this.inoutList.appendChild(this.outList);
        // this.statsHeadList.appendChild(this.inoutList);

        //area list
        this.areaListContainer =[];
        this.areaListUl=[];

        // this.areaList
        for (let i = 0; i < this.statsData.length; i++) {
            this.areaListContainer[i] = document.createElement('li');
            this.areaListContainer[i].setAttribute('class','area-list-container');

            this.areaListUl[i] = document.createElement('ul');
            this.areaListContainer[i].appendChild(this.areaListUl[i]);
            this.currentData = {};
            this.currentData = this.statsData[i];

            this.elementArea = document.createElement('li');
            this.elementArea.appendChild(document.createTextNode(this.currentData.area));
            this.areaListUl[i].appendChild(this.elementArea);

            this.elementInData = document.createElement('li');
            this.elementInData.appendChild(document.createTextNode(this.currentData.in));
            this.areaListUl[i].appendChild(this.elementInData);

            this.elementOutData = document.createElement('li');
            this.elementOutData.appendChild(document.createTextNode(this.currentData.out));
            this.areaListUl[i].appendChild(this.elementOutData);
            this.statsList.appendChild(this.areaListContainer[i]);
        }
        this.statsContainer.appendChild(this.statsList);
        this.stage.appendChild(this.statsContainer);

    }


    loadCSVandConvertToArray2D(){
		loadCSV("../data/kanto_7area_raw_short.csv", e =>
		{
			const result = e.result;
			let getData = convertCSVtoArray2D(result);
			this.doSomething(getData);

		});
	}

	doSomething(getData){
		this.DATAisOK = true;
        this.data = getData;
    }

    update(){
        
        if(this.DATAisOK ==  true){

            for(let i=0; i<this.statsData.length; i++){
                this.statsData[i].in = this.data[this.Times][2*i+1];
                this.statsData[i].out = this.data[this.Times][2*i+2];
                // console.log(this.statsData[i].in);//値の取得はok
            }
			this.Times += 1;//304+303 = 607で止まる

            if(this.Times > 303){this.Times = 0;}//304まで呼ばれてた
        }
    }
}