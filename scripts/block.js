//TODO: Singleton
var Block = (function () {
    var move, rotate

    var block = {};

    block.init = function () {
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.shape = [];
        return this;
    }
    move = function () {

    };

    rotate = function (axis) {
        var shape = this.shape;

        // frotating only 90 degrees. Add multiplier ?
        if (axis == 'z') {

            for (var ind = 0; ind < shape.children.length; ind += 1) {

                var temp =  shape.children[ind].position.y;
                shape.children[ind].position.y = shape.children[ind].position.z ;
                shape.children[ind].position.z = temp;

            }
        }

        return this;
    };

    Object.defineProperty(block, 'shape', {
        get: function(){
            return this._shape;
        },
        set: function(value){
            this._shape = "bumbabumaye"
        }
    });
    
    return {
        initializeBlock: init,
        // move: move
        rotate: rotate
    }
}());