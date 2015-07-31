function guideScreen(){
    require(['app'],function(app){
        {
            //foo is now loaded.
            console.log('GUIDE');

            var buttons, stage, layer, rect;
            var positionTop = 180;
            $('#guide').css('display');
            $('#container').show();
            $('#showGuide').show();

            $('#guide').fadeToggle("slow", "linear");
            var blob, circle, curvedLine, layer, polygon, rect, stage, straightLine, background, bgRect;


            stage = new Kinetic.Stage({
                container: 'container',
                width: 540,
                height: 500
            });

            // Background
            background = new Kinetic.Layer();
            bgRect = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: 540,
                height: 400,
                fill: 'gray',
                opacity: 0.9,
                stroke: '#CCCCCC',
                cornerRadius: 25
            });
            background.add(bgRect);
            stage.add(background);

            // Cube
            var cubeLayer = new Kinetic.Layer({
                x: 20,
                y: 30
            });
            var cube = new Kinetic.Line({
                points: [
                    50, 100,  //1
                    50, 300,   //2
                    250, 300,
                    250, 100,
                    50, 100,
                    100, 0,
                    300, 0,
                    300, 200,
                    250, 300,
                    250, 100,
                    300, 0],
                stroke: 'green',
                strokeWidth: 4,
                lineJoin: 'round'
            });

            var innerOutline = new Kinetic.Line({
                points: [
                    100, 0,
                    100, 200,
                    50, 300,
                    100, 200,
                    300, 200
                ],
                stroke: 'yellowgreen',
                strokeWidth: 2
            });
            cubeLayer.add(innerOutline);
            cubeLayer.add(cube);

            // Block
            layer = new Kinetic.Layer();
            var height = 150;
            var width = 150;
            var x = 180;
            var y = 200;
            var block = new Kinetic.Group({
                x: x,
                y: y,

                offset: {x: 150, y: 200},
                draggable: true
            });

            // Sub blocks
            for (var i = 2; i < 5; i += 1) {
                rect = new Kinetic.Rect({
                    x: i * 50,
                    y: 200,
                    width: 50,
                    height: 50,
                    fill: 'yellowgreen',
                    stroke: '#CCCCCC',
                    name: 'static'
                });
                block.add(rect);
            }

            rect = new Kinetic.Rect({
                x: 150,
                y: 150,
                width: 50,
                height: 50,
                fill: 'yellowgreen',
                stroke: '#CCCCCC',
                draggable: true,
                name: 'movable'

            });

            block.add(rect);
            layer.add(block);

            stage.add(layer);
            stage.add(cubeLayer);

            // Buttons - Rotation
            buttons = $("#guideButtons button");
            buttons.each(function (index, element) {
                $(element).addClass("buttons")
                    .attr('id', 'btnRotation' + index)
                    .css('top', positionTop + 'px');
                console.log($(element));
            });


            // axis X
            $('#btnRotation0').on("click", function () {
                console.log('ROTATE X');

                var m = stage.find('.movable');
                var x = m.getPosition()[0].attrs.x;
                var y = m.getPosition()[0].attrs.y;

                var newPos = (400 - y);

                m.setY(newPos);
                layer.draw();
            });
            // TODO: axis Y
            //axis Z
            $('#btnRotation2').on("click", function () {
                console.log('ROTATE Z');
                var angularSpeed = 360 / 3;//Math.PI / 2;
                var anim = new Kinetic.Animation(function (frame) {
                    // var angleDiff = frame.timeDiff * angularSpeed / 1000;
                    if (frame.time > 20) {
                        console.log(frame);
                        return;
                    }
                    block.rotate(90);

                }, layer);
                anim.start();

            });

            //Buttons - Move by direction

            var navButtons = $("#nav button");
            var upArrow = String.fromCharCode('0x2191');
            var leftArrow = String.fromCharCode('0x2190');
            var downArrow = String.fromCharCode('0x2193');
            var rightArrow = String.fromCharCode('0x2192');

            navButtons.each(function (index, element) {
                var arrow = String.fromCharCode('0x219' + index);
                $(element).addClass("buttons")
                    .attr('id', 'btnNav' + index)
                    .text(arrow);

                console.log($(element));
            });
            $('#btnNav1').css('margin-top', -60 + 'px').css('position', 'absolute');
            $('#btnNav2').css('margin-left', 55 + 'px').css('position', 'absolute');

            $('#btnNav0').on("click", function () {
                console.log('ROTATE X');

                var x = layer.getAbsolutePosition().x;
                ;
                var newPos = (x - 10);

                layer.setX(newPos);
                layer.draw();
            });

            $('#btnNav1').on("click", function () {
                console.log('ROTATE X');

                var y = layer.getAbsolutePosition().y;
                ;
                var newPos = (y - 10);

                layer.setY(newPos);
                layer.draw();
            });

            $('#btnNav2').on("click", function () {
                console.log('ROTATE X');

                var x = layer.getAbsolutePosition().x;
                ;
                var newPos = (x + 10);

                layer.setX(newPos);
                layer.draw();
            });

            $('#btnNav3').on("click", function () {
                console.log('ROTATE X');

                var y = layer.getAbsolutePosition().y;
                ;
                var newPos = (y + 10);

                layer.setY(newPos);
                layer.draw();
            });
            $('#startGameFromGuide').addClass('buttons')


            //here
        }
    });
};


