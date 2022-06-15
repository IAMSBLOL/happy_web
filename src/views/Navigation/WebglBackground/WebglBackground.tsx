
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  AnimationMixer,
  Clock,
  // PointLightHelper,
  // PointLight,
  Fog,

  Color,
  // Color,
  RectAreaLight,

  // TextureLoader,
  // Color,
  Vector2
} from 'three'
import { useCallback, useEffect, useRef } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import './WebglBackground.module.less'

let effectComposer :any = null

const { innerWidth, innerHeight } = window

const aspect = innerWidth / innerHeight
const clock = new Clock();
const WebglBackground = (): JSX.Element => {
  const canvasIns = useRef<HTMLCanvasElement | null>(null)
  const glRender = useRef<THREE.WebGLRenderer|null>(null)
  const camera = useRef<THREE.PerspectiveCamera>(new PerspectiveCamera(
    75, aspect, 1, 1200
  ))
  const scene = useRef<THREE.Scene>(new Scene())

  const mixer = useRef<THREE.AnimationMixer | null>()

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
  }, [])

  const initCameraPos = useCallback(() => {
    camera.current.position.setZ(-45)
    camera.current.position.setY(5)
    camera.current.position.setX(-10)
    camera.current.lookAt(0, 0, 0)

    function getCameraViewSize () {
      const vFOV = (camera.current.fov * Math.PI) / 180
      const h = 2 * Math.tan(vFOV / 2) * Math.abs(camera.current.position.z)
      const w = h * camera.current.aspect
      return [w, h]
    }

    const [width, height] = getCameraViewSize()

    if (glRender.current) {
      const renderPass = new RenderPass(scene.current, camera.current)
      const bloomPass = new UnrealBloomPass(new Vector2(width, height), 1.5, 0.5, 0.1)
      effectComposer = new EffectComposer(glRender.current)
      effectComposer.addPass(renderPass)
      effectComposer.addPass(bloomPass)
    }
  }, [])

  const flashGL = useCallback(() => {
    const controls = new OrbitControls(camera.current, canvasIns.current as HTMLCanvasElement);
    const renderCvs = () => {
      glRender.current?.render(scene.current, camera.current)

      if (mixer.current) mixer.current.update(clock.getDelta());
      effectComposer.render()
      controls.update();
      requestAnimationFrame(renderCvs)
    }

    renderCvs()
  }, [])

  const addGltfModels = useCallback(() => {
    const loader = new GLTFLoader();

    loader.load('/terem/scene.gltf', function (gltf) {
      console.log(gltf, 'blackhole')

      mixer.current = new AnimationMixer(gltf.scene);
      mixer.current.clipAction(gltf.animations[0]).play();
      // gltf.scene.position.set(20, 0, 15)
      scene.current.add(gltf.scene)

      gltf.scene.traverse((child:any) => {
        if (child.isMesh) {
          if (child.material.isMeshStandardMaterial) {
            console.log(child, 'child')
            child.material.needsUpdate = true
          }
        }
      });
    }, undefined, function (error) {
      console.error(error);
    });
  }, [])

  const addBg = useCallback(() => {
    // const texture = new TextureLoader().load('/bg1.jpg');
    // scene.current.background = texture
  }, [])

  useEffect(() => {
    if (canvasIns.current) {
      const width = 6;
      const height = 6;
      const intensity = 2;
      const rectLight = new RectAreaLight(new Color('rgb(252, 107, 3)'), intensity, width, height);
      rectLight.position.set(-10, 8, 0);
      rectLight.lookAt(0, 1, 0);
      scene.current.add(rectLight)

      scene.current.fog = new Fog('#fafafa', 1, 200)

      // init render
      initRender()

      initCameraPos()
      // 刷新GL
      flashGL()
      // 添加model
      addGltfModels()
      addBg()
    }
  }, [initRender, flashGL, addGltfModels, initCameraPos, addBg])
  return (
    <div styleName='WebglBackground'>
      <canvas ref={canvasIns} className='canvas' />
    </div>
  )
}

export default WebglBackground
