"use strict";

const vertexShaderSource = `#version 300 es
  precision highp float;

  in vec2 a_position;
  in vec4 color;
  
  uniform int layerPerTile;
  uniform vec2 u_resolution;
  uniform float screenOffset;
  uniform int worldSize;
  uniform float tileSize;
  
  out vec4 v_color;
 
  void main() {
    int index = gl_InstanceID / layerPerTile;
    int x = index % worldSize;
    int y = index / worldSize;
    
    float fX = float(x);
    float fY = float(y);
    float fWorldSize = float(worldSize);
    
    float offsetX = fX + (screenOffset / tileSize);
    float boundedOffsetX = offsetX < 0.0 ? offsetX + fWorldSize : offsetX > fWorldSize ? offsetX - fWorldSize : offsetX;
    vec2 newOffset = vec2(boundedOffsetX - 1.0, fY) * tileSize;
    
    vec2 rect = a_position * vec2(tileSize, tileSize);
    vec2 actualPosition = rect + newOffset; 
    
    vec2 clipSpace = 2.0 * (actualPosition / u_resolution) - 1.0;
    gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
    
    v_color = color;
  }
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec4 v_color;

out vec4 outColor;

vec3 hsl2rgb( in vec3 c )
{
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

void main() {
  vec3 rgb = hsl2rgb(vec3(v_color.x / 360.0, v_color.y / 100.0, v_color.z / 100.0));
  outColor = vec4(rgb, v_color.w);
}
`;

export function RedPixels({canvas}) {
    const gl = canvas.getContext("webgl2", {premultipliedAlpha: false, alpha: false, antialias: false});
    if (!gl) {
        return;
    }

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const screenOffsetLocation = gl.getUniformLocation(program, "screenOffset");
    gl.uniform1f(screenOffsetLocation, 0);
    const worldSizeLocation = gl.getUniformLocation(program, "worldSize");
    gl.uniform1i(worldSizeLocation, 0);
    const tileSizeLocation = gl.getUniformLocation(program, "tileSize");
    gl.uniform1f(tileSizeLocation, 0);
    const layerPerTileLocation = gl.getUniformLocation(program, "layerPerTile");
    gl.uniform1i(layerPerTileLocation, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendEquation(gl.FUNC_ADD);

    let entityCount = 0;
    const colorBuffer = gl.createBuffer();
    const colorAttributeLocation = gl.getAttribLocation(program, "color");

    return {
        generateVertices,
        startRender,
        renderPixels
    };

    function generateVertices(tileSize, worldWidth, worldHeight, layerPerTile) {
        // SETUP INSTANCED MESH
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectangleMesh()), gl.STATIC_DRAW);
        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(
            positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        // SETUP COLOR
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        {
            const colorData = [];
            let worldX = 0;
            let worldY = 0;
            for (let x = 0; x < worldWidth; x++) {
                worldX = x * tileSize;

                for (let y = 0; y < worldHeight; y++) {
                    worldY = y * tileSize;
                    const d = [Math.random() * 360,Math.random() * 100,Math.random() * 100,Math.random()];

                    // Color for each paint layer
                    colorData.push(...d);
                    colorData.push(...d);
                    colorData.push(...d);
                    colorData.push(...d);
                    colorData.push(...d);

                    entityCount += 5;
                }
            }
            gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(colorData),
                gl.DYNAMIC_DRAW);

            gl.enableVertexAttribArray(colorAttributeLocation);
            gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(colorAttributeLocation, 1);
        }

        gl.uniform1i(layerPerTileLocation, layerPerTile);
    }

    function startRender() {
        // There was no need to clear anything, but maybe there is something else that needs to be done?
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    function renderPixels(colorData, screenOffsetX, worldSize, tileSize) {
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, colorData);
        gl.uniform1i(worldSizeLocation, worldSize);
        gl.uniform1f(tileSizeLocation, tileSize);
        gl.uniform1f(screenOffsetLocation, screenOffsetX);

        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, entityCount);
    }
}

function rectangleMesh() {
    const x1 = 0;
    const x2 = 1;
    const y1 = 0;
    const y2 = 1;

    return [
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ];
}

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

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

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
