before(function () {

    this.Tetris = Tetris.initScene();
    this.Block = Block.init(Tetris.blockSize);
    this.Utilities = Utilities;
    this.Controller = Controller.getController(this.Tetris, this.Block, this.Utilities).run();
    this.Engine = Engine.getEngine(Tetris, Block, Utilities);

});

describe('Initial tests', function () {

    it('Expect Tetris to have scene, camera and renderer', function () {
        chai.assert.isDefined(Tetris.scene, 'Tetris has scene');
        chai.assert.isDefined(Tetris.camera, 'Tetris has camera');
        chai.assert.isDefined(Tetris.renderer, 'Tetris has renderer');
    });

    it('Expect Block to exist and have properties', function () {
        chai.assert.isDefined(Block, 'Block is defined');
        chai.assert.isDefined(Block.blockSize, 'Block has block size');
    });

    it('Expect creation of Block not to throw', function () {
        function test() {
            var block = Block.init(60);
        }

        chai.assert.doesNotThrow(test);
    });

    it('Expect Block.blockSize to be eql Tetris.blockSize', function () {

        chai.assert.equal(Tetris.blockSize, Block.blockSize);
    });

    it('Expect Block to have methods', function () {

        chai.assert.isDefined(Block.moveByUser, 'moving block by user: Exist');
        chai.assert.isDefined(Block.move, 'moving block down: Exist');
        chai.assert.isDefined(Block.rotate, 'rotate block : Exist');
    });

    it('Expect Engine to be created', function () {
        chai.assert.ok(Engine.getEngine(), 'everything is ok');


    });

});

describe('Collision simulation tests', function () {
    this.timeout(15000);
    it('Should detect collision', function (done) {

        this.Engine.run();

        setTimeout(function () {
            try {

                var blocks = this.Engine.test();
                console.log(blocks);
                console.log(blocks.blocks);

                chai.assert.isDefined(blocks.blocks[5], 'collision on position x=5');
                chai.assert.isUndefined(blocks.blocks[0], 'nothing on on position x=0');
                done()
            } catch (e) {
                done(e)
            }
        }, 12000);

    });

});

