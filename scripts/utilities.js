var Utilities = function () {
    var COLORS = [
        0x6666ff, 0x66ffff, 0xcc68EE, 0x666633, 0x66ff66, 0x9966ff,
        0x00ff66, 0x66EE33, 0x003399, 0x330099, 0xFFA500, 0x99ff00,
        0xee1289, 0x71C671, 0x00BFFF, 0x666633, 0x669966, 0x9966ff
    ];

    var TETROMINOES = [
        [
            {x: 1, y: 2, z: 0},
            {x: 1, y: 1, z: 0},
            {x: 1, y: 0, z: 0},
            {x: 0, y: 0, z: 0}
        ],
        [
            {x: 0, y: 0, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 0, y: 2, z: 0}
        ],
        [
            {x: 0, y: 0, z: 0},
            {x: 0, y: 1, z: 0},  //1
            {x: 1, y: 0, z: 0},
            {x: 1, y: 1, z: 0}   // 2
        ],
        [
            {x: 0, y: 0, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 0, y: 2, z: 0},
            {x: 1, y: 1, z: 0}
        ],
        [
            {x: 0, y: 0, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 1, y: 1, z: 0},
            {x: 1, y: 2, z: 0}
        ]
    ];

    var cleanInfoBar = function () {
        var viewport, divsCollection, ind;

        viewport = document.getElementById('viewport');
        divsCollection = viewport.getElementsByTagName('div');
        for (ind = 0; ind < divsCollection.length; ind += 1) {
            divsCollection[ind].innerHTML = '';
        }
    };

    var cloneVector = function (v) {
        return {x: v.x, y: v.y, z: v.z};
    };

    return {
        cleanScreen: cleanInfoBar,
        cloneVector: cloneVector,
        Colors: COLORS,
        Tetrominoes: TETROMINOES
    }
}();

