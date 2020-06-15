import * as THREE from "three";
import { convertCSVtoArray2D, loadCSV } from "../../Utils/AssetsLoader";
//米倉先生より

export default class statsView  extends THREE.Object3D {

    // constructor(stage) {
    constructor() {

        super();

        this.loadCSVandConvertToArray2D = this.loadCSVandConvertToArray2D.bind(this);
        this.doSomething = this.doSomething.bind(this);

        this.DATAisOK = false;
        this.data = [];
        this.Times = 0;

        // this.stage = stage;

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

        //headlist'IN OUT'
        this.statsHeadList = document.createElement('li');
        this.statsHeadList.setAttribute('id','stats-list-head');
        this.statsList.appendChild(this.statsHeadList);

        //inout list
        this.inoutList = document.createElement('ul');
        this.inList = document.createElement('li');
        this.inList.appendChild(document.createTextNode('IN'));
        this.inoutList.appendChild(this.inList);
        this.outList = document.createElement('li');
        this.outList.appendChild(document.createTextNode('OUT'));
        this.inoutList.appendChild(this.outList);
        this.statsHeadList.appendChild(this.inoutList);

        //area list
        this.areaListContainer =[];
        this.areaListUl=[];
        // this.areaList
        for (let i = 0; i < this.statsData.length; i++) {
            this.areaListContainer[i] = document.createElement('li');
            this.areaListContainer[i].setAttribute('class','area-list-container');

            this.areaListUl[i] = document.createElement('ul');
            this.areaListContainer[i].appendChild(this.areaListUl[i]);
            let currentData = {};
            currentData = this.statsData[i];

            const elementArea = document.createElement('li');
            elementArea.appendChild(document.createTextNode(currentData.area));
            this.areaListUl[i].appendChild(elementArea);

            const elementInData = document.createElement('li');
            elementInData.appendChild(document.createTextNode(currentData.in));
            this.areaListUl[i].appendChild(elementInData);

            const elementOutData = document.createElement('li');
            elementOutData.appendChild(document.createTextNode(currentData.out));
            this.areaListUl[i].appendChild(elementOutData);
            this.statsList.appendChild(this.areaListContainer[i]);
        }
        this.statsContainer.appendChild(this.statsList);
        // this.stage.appendChild(this.statsContainer);
        return this.statsContainer;
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
            console.log(" update");
            console.log(this.data[this.Times][2*0+1]);

            this.statsData =[
                {
                area:"HOKKAIDO",
                in: this.data[this.Times][2*0+1],
                out:this.data[this.Times][2*0+2]
                },
                {
                area:"CHUBU",
                in: this.data[this.Times][2*1+1],
                out:this.data[this.Times][2*1+2]
                },
                {
                area:"KINKI",
                in: this.data[this.Times][2*2+1],
                out:this.data[this.Times][2*2+2]
                },
                {
                area:"CHUGOKU/SHIKOKU",
                in: this.data[this.Times][2*3+1],
                out:this.data[this.Times][2*3+2]
                },
                {
                area:"KYUSHU",
                in: this.data[this.Times][2*4+1],
                out:this.data[this.Times][2*4+2]
                },
                {
                area:"AMSTERDAM",
                in: this.data[this.Times][2*5+1],
                out:this.data[this.Times][2*5+2]
                },
                {
                area:"LOSANGELES",
                in: this.data[this.Times][2*6+1],
                out:this.data[this.Times][2*6+2]
                },
            ];

			this.Times += 1;
			// console.log(Times);//304+303 = 607で止まる

			if(this.Times > 303){this.Times = 0;}//304まで呼ばれてた
        }
    }



}

  