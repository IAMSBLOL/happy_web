varying vec2 vUv;
uniform float time;

void main(void) {
    vec2 center = vec2(0.5, 0.5);
    vec2 pos = mod(vUv * 6.0, 1.0);
    float d = distance(center, pos);
    float mask = step(0.1 + sin(time + vUv.x * 2.0) * 0.25, d);
    float color = 1.0 - mask;
    vec3 fargColor = mix(vec3(0.2, 0.8, 0.4), vec3(1.0), color);
    gl_FragColor = vec4(vec3(fargColor), 1.0);
}