uniform float time;
uniform float size;
varying vec3 iPosition;

void main() {
    iPosition = vec3(position);
    float pointsize = 1.;
    if(position.x > time && position.x < (time + size)) {
        pointsize = (position.x - time) / size;
    }
    gl_PointSize = pointsize * 3.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}