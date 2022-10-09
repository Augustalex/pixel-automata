"use strict";
const vertexShaderSource = `#version 300 es
  in vec2 a_position;
 
  uniform vec2 u_resolution;
 
  void main() {
    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;
 
    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;
 
    // convert from 0->2 to -1->+1 (clip space)
    vec2 clipSpace = zeroToTwo - 1.0;
    
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

uniform float[5] hues;
uniform float[5] saturates;
uniform float[5] lightnesses;
uniform float[5] alphas;

// we need to declare an output for the fragment shader
out vec4 outColor;

vec3 hsl2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

vec4 addAlpha(in vec3 rgb, in float a)
{
    return vec4(rgb.x, rgb.y, rgb.z, a);
} 

vec3 fade(in vec3 rgb, in float a)
{
    return vec3(rgb.x * a, rgb.y * a, rgb.z * a);
}

void main() {
  vec3 finalColor = vec3(0.0,0.0,0.0);
  for (int i = 0; i < 1; i++)
  {
    vec4 rgba = addAlpha( hsl2rgb( vec3( hues[i],saturates[i],lightnesses[i] ) ), alphas[i]);
    vec3 rgb = vec3(rgba.x, rgba.y, rgba.z);
    finalColor = rgb;
    // float mixAlpha = 1.0 - alphas[i];
    // finalColor = fade(finalColor, mixAlpha) + rgb;
    // float a = finalColor.w + (1.0 - finalColor.w) * rgba.w;
    // finalColor = vec4(1.0 / a * (finalColor.w * finalColor.x + (1.0 - finalColor.w) * rgba.w * rgba.x), 1.0 / a * (finalColor.w * finalColor.y + (1.0 - finalColor.w) * rgba.w * rgba.y), 1.0 / a * (finalColor.w * finalColor.z + (1.0 - finalColor.w) * rgba.w * rgba.z), a);
  }

  outColor = vec4(1,.5,.5,1);
}
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));  // eslint-disable-line
    gl.deleteShader(shader);
    return undefined;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
    gl.deleteProgram(program);
    return undefined;
}

export function RedPixels({canvas}) {
    // Get A WebGL context
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }
    // create GLSL shaders, upload the GLSL source, compile the shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Link the two shaders into a program
    const program = createProgram(gl, vertexShader, fragmentShader);
    const colorLocation = gl.getUniformLocation(program, "u_color");

    // look up where the vertex data needs to go.
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // Create a buffer and put three 2d clip space points in it
    const positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

    // Create a vertex array object (attribute state)
    const vao = gl.createVertexArray();

    // and make it the one we're currently working with
    gl.bindVertexArray(vao);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2;          // 2 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);


    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    return {
        startRender,
        renderPixel
    };

    function startRender() {
        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

    }

    function renderPixel(x, y, tileSize, hues, saturates, lightnesses, alphas) {
        // console.log(hues, saturates, lightnesses, alphas);
        // if(Math.random() < .001) throw new Error();
        setRectangle(
            gl, x, y, tileSize, tileSize);

        // Set a random color. H S L
        gl.uniform4f(colorLocation, hues, saturates, lightnesses, alphas);

        const primitiveType = gl.TRIANGLES;
        const offset = 0;
        const count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }

    //
    // function renderPixel(x, y, tileSize, hue, saturation, lightness, alpha) {
    //     setRectangle(
    //         gl, x, y, tileSize, tileSize);
    //
    //     // Set a random color. H S L
    //     gl.uniform4f(colorLocation, hue / 360, saturation / 100, lightness / 100, alpha);
    //
    //     const primitiveType = gl.TRIANGLES;
    //     const offset = 0;
    //     const count = 6;
    //     gl.drawArrays(primitiveType, offset, count);
    // }
}

function setRectangle(gl, x, y, width, height) {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;

    // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
    // whatever buffer is bound to the `ARRAY_BUFFER` bind point
    // but so far we only have one buffer. If we had more than one
    // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2]), gl.STATIC_DRAW);
}