(function () {
    var startGame = function () {
        Engine.getEngine(Block, Tetris, Utilities);
        Engine.run();
    };

    var unnecessary = true;

    if (unnecessary) {
        require(['libs/raphael', 'jquery'], function (Raphael, $) {
            var width = window.innerWidth,
                height = window.innerHeight;

            $('#viewport').css('width', width).css('height', height);

            var r = Raphael("viewport");
            r.rect(0, 0, width, height).attr({
                fill: 'black'
            });

            $('#contentLogo').attr({
                width: width,
                height: height
            });

            var textMojito = r.text(0, height / 2, 'Team "Mojito"').attr({
                font: '10px "Consolas',
                fill: "white",
                opacity: 0.1
            });

            var textMojitoRotated = [{
                x: width / 3,
                opacity: 1,
                transform: "t100,0r360s5"
            }, {
                "font-size": 30,
                transform: ""
            }];

            var textPresents = r.text(width / 2 - 100, -10, 'presents').attr({
                font: '6px Consolas',
                fill: 'white',
                opacity: 0.1
            });

            var textPresentsRotated = [{
                y: 2 * height / 3,
                opacity: 1,
                transform: "t120,0r0s5"
            }, {
                "font-size": 30,
                transform: ""
            }];

            var animateMojito = Raphael.animation(textMojitoRotated[0], 5000, 'elastic');
            textMojito.animate(animateMojito);

            var animatePresents = Raphael.animation(textPresentsRotated[0], 2000, 'bounce', function () {
                $('#contentLogo').show();
                $('div#viewport > svg').hide();
            });

            textPresents.animate(animatePresents.delay(1000));

            $('#s-text').attr({
                cursor: 'pointer'
            }).click(function () {
                $('#contentLogo').hide();
                startGame();
            });
        });
    } else {
        startGame();
    }
}());
