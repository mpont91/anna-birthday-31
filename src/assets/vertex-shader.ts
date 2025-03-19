export const vertexShader: string = `
uniform float time;
varying vec2 vUv;
varying float hValue;

//https://thebookofshaders.com/11/
// 2D Random
float random (in vec2 st) {
return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
vec2 i = floor(st);
vec2 f = fract(st);
float a = random(i);
float b = random(i + vec2(1.0, 0.0));
float c = random(i + vec2(0.0, 1.0));
float d = random(i + vec2(1.0, 1.0));
vec2 u = f*f*(3.0-2.0*f);
return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
vUv = uv;
vec3 pos = position;
pos *= vec3(0.8, 2, 0.725);
hValue = position.y;
float posXZlen = length(position.xz);
pos.y *= 1. + (cos((posXZlen + 0.25) * 3.1415926) * 0.25 + noise(vec2(0, time)) * 0.125 + noise(vec2(position.x + time, position.z + time)) * 0.5) * position.y;
pos.x += noise(vec2(time * 2., (position.y - time) * 4.0)) * hValue * 0.0312;
pos.z += noise(vec2((position.y - time) * 4.0, time * 2.)) * hValue * 0.0312;
gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
}
`

export const fragmentShader: string = `
varying float hValue;
varying vec2 vUv;

vec3 heatmapGradient(float t) {
return clamp((pow(t, 1.5) * 0.8 + 0.2) * vec3(smoothstep(0.0, 0.35, t) + t * 0.5, smoothstep(0.5, 1.0, t), max(1.0 - t * 1.7, t * 7.0 - 6.0)), 0.0, 1.0);
}

void main() {
float v = abs(smoothstep(0.0, 0.4, hValue) - 1.);
float alpha = (1. - v) * 0.99;
alpha -= 1. - smoothstep(1.0, 0.97, hValue);
gl_FragColor = vec4(heatmapGradient(smoothstep(0.0, 0.3, hValue)) * vec3(0.95,0.95,0.4), alpha);
gl_FragColor.rgb = mix(vec3(0,0,1), gl_FragColor.rgb, smoothstep(0.0, 0.3, hValue));
gl_FragColor.rgb += vec3(1, 0.9, 0.5) * (1.25 - vUv.y);
gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.66, 0.32, 0.03), smoothstep(0.95, 1., hValue));
}
`
