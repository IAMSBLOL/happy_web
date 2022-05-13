
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  AnimationMixer,
  Clock,

  AmbientLightProbe,
  Fog,
  // Color,

} from 'three'
import { useCallback, useEffect, useRef } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './WebglBackground.module.less'

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
  }, [])

  const flashGL = useCallback(() => {
    const controls = new OrbitControls(camera.current, canvasIns.current as HTMLCanvasElement);
    const renderCvs = () => {
      glRender.current?.render(scene.current, camera.current)

      if (mixer.current) mixer.current.update(clock.getDelta());

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

      scene.current.add(gltf.scene)

      gltf.scene.traverse((child:any) => {
        console.log(child, 'child')
        if (child.material) {
          // child.material.emissive = new Color('#fff')
        }
      });
    }, undefined, function (error) {
      console.error(error);
    });
  }, [])

  useEffect(() => {
    if (canvasIns.current) {
      const directionalLight = new AmbientLightProbe('#245266', 0.6);
      const directionalLight1 = new AmbientLightProbe('#245266', 0.1);
      directionalLight.position.setX(-1)
      directionalLight.position.setY(0)
      directionalLight.position.setZ(0)
      scene.current.add(directionalLight);
      scene.current.add(directionalLight1);

      scene.current.fog = new Fog('#fff', 1, 150)

      // init render
      initRender()

      initCameraPos()
      // 刷新GL
      flashGL()
      // 添加model
      addGltfModels()
    }
  }, [initRender, flashGL, addGltfModels, initCameraPos])
  return (
    <div styleName='WebglBackground'>
      <canvas ref={canvasIns} className='canvas' />
    </div>
  )
}

export default WebglBackground
