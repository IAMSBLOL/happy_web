varying float qnoise;

uniform float time;
uniform bool redhell;

void main() {
    float r, g, b;

    if(!redhell == true) {
        r = cos(qnoise + 0.5);
        g = cos(qnoise - 0.5);
        b = 0.0;
    } else {
        r = cos(qnoise + 0.5);
        g = cos(qnoise - 0.5);
        b = abs(qnoise);
    }
    gl_FragColor = vec4(r, g, b, 1.0);
}