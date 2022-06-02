
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  IcosahedronBufferGeometry,
  //   Fog,
  Points,
  Object3D,
  Color,
  //   BoxGeometry,
  ShaderMaterial,
//   Mesh
} from 'three'
import { useCallback, useEffect, useRef } from 'react'
import * as dat from 'dat.gui';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import shaders from './glsl';
import './Noise.module.less'
const start = Date.now();

const { innerWidth, innerHeight } = window

const aspect = innerWidth / innerHeight

const Noise = (): JSX.Element => {
  const canvasIns = useRef<HTMLCanvasElement | null>(null)
  const glRender = useRef<THREE.WebGLRenderer | null>(null)
  const camera = useRef<THREE.PerspectiveCamera>(new PerspectiveCamera(
    75, aspect, 1, 1200
  ))
  const scene = useRef<THREE.Scene>(new Scene())
  const shaderMaterial = useRef<THREE.ShaderMaterial | null>(null)
  const object3d = useRef<any>(null)

  const initRender = useCallback(() => {
    glRender.current = new WebGLRenderer(
      {
        antialias: true,
        canvas: canvasIns.current as HTMLCanvasElement,
        alpha: false
      }
    )
    glRender.current.setPixelRatio(window.devicePixelRatio)
    glRender.current.setSize(window.innerWidth, window.innerHeight)
  }, [])

  const initCameraPos = useCallback(() => {
    camera.current.position.setZ(-12)

    // camera.current.lookAt(0, 0, 0)
  }, [])

  const primitiveElement = useCallback(() => {
    object3d.current = new Object3D();
    const uniforms = {
      time: {
        type: 'f',
        value: 0.0
      },
      pointscale: {
        type: 'f',
        value: 0.0
      },
      decay: {
        type: 'f',
        value: 0.96
      },
      complex: {
        type: 'f',
        value: 0.0
      },
      waves: {
        type: 'f',
        value: 20.0
      },
      eqcolor: {
        type: 'f',
        value: 11.0
      },
      fragment: {
        type: 'i',
        value: true
      },
      redhell: {
        type: 'i',
        value: true
      }
    }
    shaderMaterial.current = new ShaderMaterial({
      wireframe: false,
      // fog: true,
      uniforms,
      vertexShader: shaders.vertex.default,
      fragmentShader: shaders.fragment.default,
      transparent: true,
    });
    const geo = new IcosahedronBufferGeometry(3, 117);
    const mesh = new Points(geo, shaderMaterial.current);

    // ---
    object3d.current.add(mesh);
    console.log(object3d.current, 'object3d.current')
    scene.current.add(object3d.current)
  }, [])

  useEffect(() => {
    if (canvasIns.current) {
      scene.current.background = new Color(0x000000);

      // init render
      initRender()

      initCameraPos()
      primitiveElement()
    }
  }, [initRender, initCameraPos, primitiveElement])

  useEffect(() => {
    const options = {
      perlin: {
        vel: 0.002,
        speed: 0.00050,
        perlins: 1.0,
        decay: 0.90,
        complex: 0.30,
        waves: 20.0,
        eqcolor: 20.02,
        fragment: true,
        redhell: true
      },
      spin: {
        sinVel: 0.0,
        ampVel: 80.0,
      }
    }
    function createGUI () {
      const gui = new dat.GUI();
      const camGUI = gui.addFolder('Camera');
      // cam.add(, 'speed', 0.0, 30.00).listen();
      camGUI.add(camera.current.position, 'z', 3, 20).name('Zoom').listen();
      camGUI.add(options.perlin, 'vel', 0.000, 0.02).name('Velocity').listen();
      // camGUI.open();

      const mathGUI = gui.addFolder('Math Options');
      mathGUI.add(options.spin, 'sinVel', 0.0, 0.50).name('Sine').listen();
      mathGUI.add(options.spin, 'ampVel', 0.0, 90.00).name('Amplitude').listen();
      // mathGUI.open();

      const perlinGUI = gui.addFolder('Setup Perlin Noise');
      perlinGUI.add(options.perlin, 'perlins', 1.0, 5.0).name('Size').step(1);
      perlinGUI.add(options.perlin, 'speed', 0.00000, 0.00050).name('Speed').listen();
      perlinGUI.add(options.perlin, 'decay', 0.0, 1.00).name('Decay').listen();
      perlinGUI.add(options.perlin, 'waves', 0.0, 20.00).name('Waves').listen();
      perlinGUI.add(options.perlin, 'fragment', true).name('Fragment');
      perlinGUI.add(options.perlin, 'complex', 0.1, 1.00).name('Complex').listen();
      perlinGUI.add(options.perlin, 'redhell', true).name('Electroflow');
      perlinGUI.add(options.perlin, 'eqcolor', 0.0, 15.0).name('Hue').listen();
      perlinGUI.open();
    }
    createGUI()
    console.log(object3d.current, ' object3d.current.mesh')
    function animation () {
      requestAnimationFrame(animation);
      const performance = Date.now() * 0.003;

      object3d.current.rotation.y += options.perlin.vel;
      object3d.current.rotation.x = (Math.sin(performance * options.spin.sinVel) * options.spin.ampVel) * Math.PI / 180;

      const mat = shaderMaterial.current
      if (mat) {
        mat.uniforms.time.value = options.perlin.speed * (Date.now() - start);
        mat.uniforms.pointscale.value = options.perlin.perlins;
        mat.uniforms.decay.value = options.perlin.decay;
        mat.uniforms.complex.value = options.perlin.complex;
        mat.uniforms.waves.value = options.perlin.waves;
        mat.uniforms.eqcolor.value = options.perlin.eqcolor;
        mat.uniforms.fragment.value = options.perlin.fragment;
        mat.uniforms.redhell.value = options.perlin.redhell;
        // ---
        camera.current.lookAt(scene.current.position);
        glRender.current?.render(scene.current, camera.current);
      }
      // ---
    }
    animation()
  }, [])
  return (
    <div styleName='Noise'>

      <canvas ref={canvasIns} className='canvas' />
    </div>
  )
}

export default Noise
