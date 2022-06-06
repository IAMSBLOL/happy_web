

uniform sampler2D uvmap;
varying vec2 vUv;
varying vec3 pos;
uniform mat4 modelMatrix;

float sphereRim(vec3 spherePosition) {
    vec3 normal = normalize(spherePosition.xyz);
    vec3 worldNormal = normalize(mat3(modelMatrix) * normal.xyz);
    vec3 worldPosition = (modelMatrix * vec4(spherePosition, 1.0)).xyz;
    vec3 V = normalize(cameraPosition - worldPosition);
    float rim = 1.0 - max(dot(V, worldNormal), 0.0);
    return pow(smoothstep(0.0, 1.0, rim), 0.5);
}

void main() {
    float rim = sphereRim(pos);
    vec4 imgae = texture2D(uvmap, vUv);
    gl_FragColor = imgae + rim * 0.15;
}