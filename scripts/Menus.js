 //viewpointDiv is the canvas div in index.html, all the calculations are based on him and are scalable
    var viewpointDiv = document.getElementById('viewpoint'),
            oneFifthOfTheDivWidth = viewpointDiv.offsetWidth/ 5,
            oneFifthOfTheDivHeight = viewpointDiv.offsetHeight/ 5,
          svgWidth = oneFifthOfTheDivWidth*3,
          svgHeight = oneFifthOfTheDivHeight,
          menuRectangleX = svgWidth/5,
          menuRectangleY = svgHeight/7,
          menuRectanglesWidth = menuRectangleX*3,
          menuRectanglesHeight = menuRectangleY*2,
          menuBottomRectangleY = menuRectangleY * 4,
            tenthOfSvgWidth = svgWidth/10,
            fifthOfSvgHeight = svgHeight/ 5,
            strokeColor = "blue";
    //Adding the top(start menu) rectangle
    viewpointDiv.innerHTML += '<svg width="'+svgWidth+'" height="'+svgHeight+'" id="topSvg" style="margin-left: '+oneFifthOfTheDivWidth+'px; margin-top: '+oneFifthOfTheDivHeight+'px">';
    var topSvg = document.getElementById('topSvg');
    topSvg.innerHTML += '<rect id="rectOne" height="'+svgHeight+'" width="'+svgWidth+'" stroke="black" stroke-width="3px" fill="red" ></rect></svg>';


    //Adding the bottom(exit menu) rectangle
    viewpointDiv.innerHTML += '<svg width="'+svgWidth+'" height="'+svgHeight+'" id="bottomSvg" style="margin-left: '+oneFifthOfTheDivWidth+'px; margin-top: '+oneFifthOfTheDivHeight+'px">';
    var bottomSvg = document.getElementById('bottomSvg');
    bottomSvg.innerHTML += '<rect id="rectTwo" height="'+svgHeight+'" width="'+svgWidth+'" stroke="black" stroke-width="3px" fill="red" ></rect></svg>';

    //Selecting the two rectangles
    var startGameMenu = document.getElementById('topSvg'),
        exitGameMenu= document.getElementById('bottomSvg');

    //Adding words to the top SVG (must stay here !!! Using startGameMenu which is defined above.
    function wordsInTopSvg() {
        //S
        startGameMenu.innerHTML += '<path d="M '+tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+1.5*tenthOfSvgWidth+' '+fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+tenthOfSvgWidth+' '+2*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+tenthOfSvgWidth+' '+2*fifthOfSvgHeight+' L '+1.5*tenthOfSvgWidth+' '+2*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+1.5*tenthOfSvgWidth+' '+2*fifthOfSvgHeight+' L '+1.5*tenthOfSvgWidth+' '+3*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+1.5*tenthOfSvgWidth+' '+3*fifthOfSvgHeight+' L '+tenthOfSvgWidth+' '+3*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>';
        //T
        startGameMenu.innerHTML +='<path d="M '+2*tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+3*tenthOfSvgWidth+' '+fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+(5*tenthOfSvgWidth)/2+' '+fifthOfSvgHeight+' L '+2.5*tenthOfSvgWidth+' '+3*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>';
        //A
        startGameMenu.innerHTML +='<path d="M '+4*tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+3.5*tenthOfSvgWidth+' '+3*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+4*tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+4.5*tenthOfSvgWidth+' '+3*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+3.75*tenthOfSvgWidth+' '+2*fifthOfSvgHeight+' L '+4.22*tenthOfSvgWidth+' '+2*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>';
        //R
        startGameMenu.innerHTML +='<path d="M '+5*tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+5*tenthOfSvgWidth+' '+3*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+5*tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+5.5*tenthOfSvgWidth+' '+fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+5.5*tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+5.5*tenthOfSvgWidth+' '+1.8*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+5.5*tenthOfSvgWidth+' '+1.8*fifthOfSvgHeight+' L '+5*tenthOfSvgWidth+' '+1.8*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+5*tenthOfSvgWidth+' '+1.8*fifthOfSvgHeight+' L '+5.6*tenthOfSvgWidth+' '+3*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>';

        //T
        startGameMenu.innerHTML +='<path d="M '+6*tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+7*tenthOfSvgWidth+' '+fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+6.5*tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+6.5*tenthOfSvgWidth+' '+3*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>';

        //Gap fillers - broken calculations
        startGameMenu.innerHTML +='<path d="M '+7.5*tenthOfSvgWidth+' '+fifthOfSvgHeight/5+' L '+8.3*tenthOfSvgWidth+' '+fifthOfSvgHeight/5+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+7.5*tenthOfSvgWidth+' '+0.8*tenthOfSvgWidth+' L '+8.3*tenthOfSvgWidth+' '+0.8*tenthOfSvgWidth+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+7.5*tenthOfSvgWidth+' '+1.6*tenthOfSvgWidth+' L '+8.3*tenthOfSvgWidth+' '+1.6*tenthOfSvgWidth+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+8.3*tenthOfSvgWidth+' '+1.6*tenthOfSvgWidth+' L '+8.3*tenthOfSvgWidth+' '+2.4*tenthOfSvgWidth+' " stroke="'+strokeColor+'"></path>'+

        '<path d="M '+7.5*tenthOfSvgWidth+' '+fifthOfSvgHeight/5+' L '+7.5*tenthOfSvgWidth+' '+0.8*tenthOfSvgWidth*3 +' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+7.5*tenthOfSvgWidth+' '+0.8*tenthOfSvgWidth*3 +' L '+9.1*tenthOfSvgWidth+' '+0.8*tenthOfSvgWidth*3 +' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+9.1*tenthOfSvgWidth+' '+0.8*tenthOfSvgWidth*3 +' L '+9.1*tenthOfSvgWidth+' '+0.8*tenthOfSvgWidth*2  +' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+9.1*tenthOfSvgWidth+' '+0.8*tenthOfSvgWidth*2  +' L '+8.3*tenthOfSvgWidth+' '+0.8*tenthOfSvgWidth*2 +' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+8.3*tenthOfSvgWidth+' '+0.8*tenthOfSvgWidth*2 +'  L '+8.3*tenthOfSvgWidth+' '+fifthOfSvgHeight/5+' " stroke="'+strokeColor+'"></path>';

    }
    wordsInTopSvg();
	//Adding words to the bottom SVG
    function wordsInBottomSvg(){
        //E
        bottomSvg.innerHTML += '<path d="M '+tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+1.5*tenthOfSvgWidth+' '+fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+tenthOfSvgWidth+' '+2*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+tenthOfSvgWidth+' '+2*fifthOfSvgHeight+' L '+1.5*tenthOfSvgWidth+' '+2*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+tenthOfSvgWidth+' '+2*fifthOfSvgHeight+' L '+tenthOfSvgWidth+' '+3*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+1.5*tenthOfSvgWidth+' '+3*fifthOfSvgHeight+' L '+tenthOfSvgWidth+' '+3*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>';
        //X
        bottomSvg.innerHTML += '<path d="M '+2.1*tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+3*tenthOfSvgWidth+' '+3*fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+2.1*tenthOfSvgWidth+' '+3*fifthOfSvgHeight+' L '+3*tenthOfSvgWidth+' '+fifthOfSvgHeight+' " stroke="'+strokeColor+'"></path>';

        //I
        bottomSvg.innerHTML +='<path d="M '+3.7*tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+4.7*tenthOfSvgWidth+' '+fifthOfSvgHeight+' "stroke="'+strokeColor+'"></path>'+
        '<path d="M '+4.2*tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+4.2*tenthOfSvgWidth+' '+1.8*tenthOfSvgWidth+' " stroke="'+strokeColor+'"></path>'+
        '<path d="M '+3.7*tenthOfSvgWidth+' '+1.8*tenthOfSvgWidth+' L '+4.7*tenthOfSvgWidth+' '+1.8*tenthOfSvgWidth+' "stroke="'+strokeColor+'"></path>';

        //T
        bottomSvg.innerHTML +='<path d="M '+5.3*tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+6.3*tenthOfSvgWidth+' '+fifthOfSvgHeight+' "stroke="'+strokeColor+'"></path>'+
        '<path d="M '+5.8*tenthOfSvgWidth+' '+fifthOfSvgHeight+' L '+5.8*tenthOfSvgWidth+' '+1.8*tenthOfSvgWidth+' " stroke="'+strokeColor+'"></path>';

        //Gap fillers - broken calculations
        bottomSvg.innerHTML +='<path d="M '+6.6*tenthOfSvgWidth+' '+1.2*tenthOfSvgWidth+' L '+6.6*tenthOfSvgWidth+' '+2*tenthOfSvgWidth+' M '+6.6*tenthOfSvgWidth+' '+2*tenthOfSvgWidth+' L '+9.6*tenthOfSvgWidth+' '+2*tenthOfSvgWidth+' "stroke="'+strokeColor+'"></path>'+
        '<path d="M '+6.6*tenthOfSvgWidth+' '+2*tenthOfSvgWidth+' L '+9.6*tenthOfSvgWidth+' '+2*tenthOfSvgWidth+' "stroke="'+strokeColor+'"></path>'+
        '<path d="M '+9.6*tenthOfSvgWidth+' '+2*tenthOfSvgWidth+' L '+9.6*tenthOfSvgWidth+' '+1.2*tenthOfSvgWidth+' "stroke="'+strokeColor+'"></path>'+
        '<path d="M '+9.6*tenthOfSvgWidth+' '+1.2*tenthOfSvgWidth+' L '+6.6*tenthOfSvgWidth+' '+1.2*tenthOfSvgWidth+' "stroke="'+strokeColor+'"></path>'+
        '<path d="M '+7.6*tenthOfSvgWidth+' '+2*tenthOfSvgWidth+' L '+7.6*tenthOfSvgWidth+' '+0.4*tenthOfSvgWidth+' "stroke="'+strokeColor+'"></path>'+
        '<path d="M '+7.6*tenthOfSvgWidth+' '+0.4*tenthOfSvgWidth+' L '+8.6*tenthOfSvgWidth+' '+0.4*tenthOfSvgWidth+' "stroke="'+strokeColor+'"></path>'+
        '<path d="M '+8.6*tenthOfSvgWidth+' '+0.4*tenthOfSvgWidth+' L '+8.6*tenthOfSvgWidth+' '+2*tenthOfSvgWidth+'  "stroke="'+strokeColor+'"></path>';
    }
    wordsInBottomSvg();



    //Adding event listeners to the two menus!
    var fire = function () {
        console.log(123);
    };
    startGameMenu.addEventListener('click',fire);
    exitGameMenu.addEventListener('click',fire);