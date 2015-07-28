(function () {
    require(['libs/raphael', 'libs/jquery-2.1.4.min'], function (Raphael) {
        var startGame = function () {
            Engine.getEngine(Block, Tetris, Utilities);
            Engine.run();
        };

        var unnecessary = true; // set false to stop intro

        if (unnecessary) {
            $('body').addClass('stop-scrolling');
            var width = window.innerWidth,
                height = window.innerHeight;

            $('#viewport').css('width', width).css('height', height);
            $('#logoSvg').css('width', width).css('height', height);

            var r = Raphael("viewport");
            r.rect(0, 0, width, height).attr({
                fill: 'black'
            });

            $('#contentLogo').attr({
                width: width,
                height: height
            });

            var textMojito = r.text(0, height / 3, 'Team "Mojito"').attr({
                font: '10px "Consolas',
                fill: "white",
                opacity: 0.1
            });

            var textMojitoWidth = textMojito.getBBox().width;
            var textMojitoRotated = [{
                x: width / 2 - textMojitoWidth / 2,
                opacity: 1,
                transform: "r360s8"
            }, {
                transform: ""
            }];

            var textPresents = r.text(width / 1.5, -10, 'presents').attr({
                font: '6px Consolas',
                fill: 'white',
                opacity: 0.1
            });

            var textPresentsWidth = textPresents.getBBox().width;
            var textPresentsRotated = [{
                x: width/2 - textPresentsWidth/2,
                y: height / 2,
                opacity: 1,
                transform: "r0s6"
            }, {
                transform: ""
            }];

            var animateMojito = Raphael.animation(textMojitoRotated[0], 3700, 'elastic');
            textMojito.animate(animateMojito);

            var animatePresents = Raphael.animation(textPresentsRotated[0], 3000, 'bounce', function () {
                $('#contentLogo').show();
                $('div#viewport > svg').fadeOut(400);
            });

            textPresents.animate(animatePresents.delay(1000));

            $('#s-text').attr({
                cursor: 'pointer'
            }).click(function () {
                $('#contentLogo').hide();
                startGame();
            });
        } else {
            startGame();
        }
    });
}());
