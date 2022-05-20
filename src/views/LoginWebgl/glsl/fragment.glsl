uniform float time;
uniform float size;
uniform vec3 colorf;
uniform vec3 colort;

varying vec3 iPosition;

void main(void) {
    float end = time + size;
    vec4 color;
    if(iPosition.x > end || iPosition.x < time) {
        discard;
            //color = vec4(0.213,0.424,0.634,0.3);
    } else if(iPosition.x > time && iPosition.x < end) {
        float step = fract((iPosition.x - time) / size);

        float dr = abs(colort.x - colorf.x);
        float dg = abs(colort.y - colorf.y);
        float db = abs(colort.z - colorf.z);

        float r = colort.x > colorf.x ? (dr * step + colorf.x) : (colorf.x - dr * step);
        float g = colort.y > colorf.y ? (dg * step + colorf.y) : (colorf.y - dg * step);
        float b = colort.z > colorf.z ? (db * step + colorf.z) : (colorf.z - db * step);

        color = vec4(r, g, b, 1.0);
    }
    float d = distance(gl_PointCoord, vec2(0.5, 0.5));
    if(abs(iPosition.x - end) < 0.2 || abs(iPosition.x - time) < 0.2) {
        if(d > 0.5) {
            discard;
        }
    }
    gl_FragColor = color;
}