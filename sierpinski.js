"use strict";

var canvas;
var gl;

var points = [];

var numTimesToSubdivide = 3;

var program;
var bufferId;
var colorLoc;

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),   // Black
    vec4( 1.0, 0.0, 0.0, 1.0 ),   // Red
    vec4( 0.0, 1.0, 0.0, 1.0 ),   // Green
    vec4( 0.0, 0.0, 1.0, 1.0 )    // Blue
];

var currentColor = 0;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );

    if ( !gl ) {
        alert( "WebGL isn't available" );
    }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    program = initShaders(
        gl,
        "vertex-shader",
        "fragment-shader"
    );

    gl.useProgram( program );

    bufferId = gl.createBuffer();

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        bufferId
    );

    var vPosition =
        gl.getAttribLocation(
            program,
            "vPosition"
        );

    gl.vertexAttribPointer(
        vPosition,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.enableVertexAttribArray(
        vPosition
    );

    colorLoc =
        gl.getUniformLocation(
            program,
            "color"
        );


    document.getElementById("slider").onchange =
        function(event)
    {
        numTimesToSubdivide =
            parseInt(event.target.value);

        createCarpet();
    };

    document.getElementById("ColorMenu").onchange =
        function(event)
    {
        currentColor =
            event.target.selectedIndex;

        render();
    };


    createCarpet();
};



function createCarpet()
{
    points = [];

    divideSquare(
        -0.8,
        -0.8,
        1.6,
        numTimesToSubdivide
    );


    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        bufferId
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        flatten(points),
        gl.STATIC_DRAW
    );


    render();
}



function square( a, b, c, d )
{
    points.push(
        a, b, c,
        a, c, d
    );
}


function divideSquare( x, y, size, count )
{


    if ( count === 0 ) {

        var a = vec2( x,        y );
        var b = vec2( x + size, y );
        var c = vec2( x + size, y + size );
        var d = vec2( x,        y + size );

        square( a, b, c, d );
    }

    else {

        var newSize =
            size / 3.0;

        --count;


        for ( var row = 0; row < 3; row++ ) {

            for ( var col = 0; col < 3; col++ ) {

                // Do not draw center square

                if ( row === 1 && col === 1 ) {
                    continue;
                }


                divideSquare(
                    x + col * newSize,
                    y + row * newSize,
                    newSize,
                    count
                );
            }
        }
    }
}



function render()
{
    gl.clear(
        gl.COLOR_BUFFER_BIT
    );


    gl.uniform4fv(
        colorLoc,
        flatten(colors[currentColor])
    );


    gl.drawArrays(
        gl.TRIANGLES,
        0,
        points.length
    );
}
