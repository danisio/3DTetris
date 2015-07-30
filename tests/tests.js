before(function () {

    this.Tetris = Tetris;
    //this.Block = Block.initializeBlock(Tetris.blockSize);

});

describe('Test', function () {
    it('test 1', function () {
        chai.assert.equal(5, 5);
    });

    it('test 1', function () {
        chai.assert.equal(5, 5);
    });

    it('test 2: module Tetris to exist', function () {
        function test() {
            var size = Tetris.blockSize;
        }

        chai.assert.equal(5, 5);
    });

    it('Expect Tetris.blockSize to be eql 60', function () {

        chai.assert.equal(Tetris.blockSize, 60);
    });

   /* it('Expect Block.blockSize to be eql 60', function () {

        chai.assert.equal(Block.blockSize, 60);
    });*/

});