
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  AnimationMixer,
  //   Clock,
  //   PointLightHelper,
  //   AmbientLightProbe,
  Fog,
  //   PointLight,
  //   Color,
  // Color,
  //   TextureLoader
  // Color,

  Clock,
  Vector2,
  Line,
  Vector3,
  CubicBezierCurve3,
  BufferGeometry,
  // LineBasicMaterial,
  ShaderMaterial
} from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { useCallback, useEffect, useRef } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import shaders from './glsl';
import './LoginWebgl.module.less'

const { innerWidth, innerHeight } = window

let effectComposer = null

const aspect = innerWidth / innerHeight
const clock = new Clock();
const LoginWebgl = (): JSX.Element => {
  const canvasIns = useRef<HTMLCanvasElement | null>(null)
  const glRender = useRef<THREE.WebGLRenderer | null>(null)
  const camera = useRef<THREE.PerspectiveCamera>(new PerspectiveCamera(
    75, aspect, 1, 1200
  ))
  const scene = useRef<THREE.Scene>(new Scene())

  const mixer = useRef<THREE.AnimationMixer | null>()
  const curveObject = useRef<any>(null)

  const gl_scene = useRef<any>(null)

  const initRender = useCallback(() => {
    glRender.current = new WebGLRenderer(
      {
        antialias: true,
        canvas: canvasIns.current as HTMLCanvasElement,
        alpha: true
      }
    )
    glRender.current.setPixelRatio(window.devicePixelRatio)
    glRender.current.setSize(window.innerWidth, window.innerHeight)

    function getCameraViewSize () {
      const vFOV = (camera.current.fov * Math.PI) / 180
      const h = 2 * Math.tan(vFOV / 2) * Math.abs(camera.current.position.z)
      const w = h * camera.current.aspect
      return [w, h]
    }

    const [width, height] = getCameraViewSize()

    if (glRender.current) {
      const renderPass = new RenderPass(scene.current, camera.current)
      const bloomPass = new UnrealBloomPass(new Vector2(width, height), 2.5, 1.5, 1)
      effectComposer = new EffectComposer(glRender.current)
      effectComposer.addPass(renderPass)
      effectComposer.addPass(bloomPass)
    }
  }, [])

  const initCameraPos = useCallback(() => {
    camera.current.position.setZ(-4)
    camera.current.position.setY(0.5)
    camera.current.lookAt(0, 0, 0)
  }, [])

  const flashGL = useCallback(() => {
    const renderCvs = () => {
      if (curveObject.current) {
        if (curveObject.current.material.uniforms.time.value > 0) {
          curveObject.current.material.uniforms.time.value = -5
        } else {
          curveObject.current.material.uniforms.time.value += 0.05;
        }
      }

      glRender.current?.render(scene.current, camera.current)
      if (mixer.current) mixer.current.update(clock.getDelta());
      requestAnimationFrame(renderCvs)
    }

    renderCvs()
  }, [])

  const addGltfModels = useCallback(() => {
    const loader = new GLTFLoader();

    loader.load('/blackhole/scene.gltf', function (gltf) {
      console.log(gltf, 'blackhole')
      mixer.current = new AnimationMixer(gltf.scene);
      mixer.current.clipAction(gltf.animations[0]).play();
      scene.current.add(gltf.scene)
      gl_scene.current = gltf.scene
    }, undefined, function (error) {
      console.error(error);
    });
  }, [])

  //   const addBg = useCallback(() => {
  //     const texture = new TextureLoader().load('/bg1.jpg');
  //     scene.current.background = texture
  //   }, [])

  useEffect(() => {
    if (canvasIns.current) {
      const curve = new CubicBezierCurve3(
        new Vector3(-1, 0, 0),
        new Vector3(-1.5, 2, 0),
        new Vector3(1.5, 2, 0),
        new Vector3(1, 0, 0)
      );

      const points = curve.getPoints(50);
      const geometry = new BufferGeometry().setFromPoints(points);
      const colorf :any = {
        r: 0.0,
        g: 0.0,
        b: 0.0
      };
      const colort:any = {
        r: 1.0,
        g: 1.0,
        b: 1.0
      };
      const uniforms = {
        time: { type: 'f', value: -5.0 },
        size: { type: 'f', value: 2.0 },
        colort: {
          type: 'v3',
          value: new Vector3(colort.r, colort.g, colort.b)
        },
        colorf: {
          type: 'v3',
          value: new Vector3(colorf.r, colorf.g, colorf.b)
        }
      };

      const material = new ShaderMaterial({
        uniforms: uniforms,

        vertexShader: shaders.vertex.default,
        fragmentShader: shaders.fragment.default,
        transparent: true
      });

      // Create the final object to add to the scene
      curveObject.current = new Line(geometry, material);

      scene.current.add(curveObject.current)

      // init render
      initRender()

      initCameraPos()
      // 刷新GL
      flashGL()
      // 添加model
      addGltfModels()
      //   addBg()
      scene.current.fog = new Fog('#fff', -1, 10)
    }
  }, [initRender, flashGL, addGltfModels, initCameraPos])
  return (
    <div styleName='LoginWebgl'>
      <canvas ref={canvasIns} className='canvas' />
    </div>
  )
}

export default LoginWebgl
