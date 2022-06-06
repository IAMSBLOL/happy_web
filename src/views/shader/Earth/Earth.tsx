import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  SphereBufferGeometry,
  Mesh,

  Color,
  TextureLoader,
  ShaderMaterial,
  Quaternion,
  Euler,
  PointLight,
  PointLightHelper
  //   Mesh
} from 'three'
import { useCallback, useEffect, useRef } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import shaders from './glsl';
import './Earth.module.less'

const { innerWidth, innerHeight } = window

const aspect = innerWidth / innerHeight

const Earth = (): JSX.Element => {
  const canvasIns = useRef<HTMLCanvasElement | null>(null)

  const glRender = useRef<THREE.WebGLRenderer | null>(null)
  const camera = useRef<THREE.PerspectiveCamera>(new PerspectiveCamera(
    75, aspect, 1, 1200
  ))
  const scene = useRef<THREE.Scene>(new Scene())
  const shaderMaterial = useRef<THREE.ShaderMaterial | null>(null)

  const geometryMesh = useRef<THREE.Mesh>()

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
    camera.current.position.setZ(-60)

    camera.current.lookAt(0, 0, 0)
  }, [])

  const AddSphere = useCallback(
    () => {
      const geometry = new SphereBufferGeometry(25, 64, 64)
      const texture = new TextureLoader().load('/2k_earth_daymap.jpg');
      const uniforms = {
        uvmap: {
          value: texture
        },

      }
      shaderMaterial.current = new ShaderMaterial({
        uniforms,
        transparent: true,
        wireframe: false,
        vertexShader: shaders.vertex.default,
        fragmentShader: shaders.fragment.default,
        // lights: true
      });
      console.log(shaderMaterial.current)

      geometryMesh.current = new Mesh(geometry, shaderMaterial.current)

      // geometryMesh.current.position.setZ(30)
      scene.current.add(geometryMesh.current)
    }, []
  )

  const addLinght = useCallback(
    () => {
      const pointLight = new PointLight(0xff0000, 1, 100);
      pointLight.position.set(0, 30, 0);
      scene.current.add(pointLight);

      const sphereSize = 1;
      const pointLightHelper = new PointLightHelper(pointLight, sphereSize);
      scene.current.add(pointLightHelper);
    }, []
  )

  const flashGL = useCallback(() => {
    const controls = new OrbitControls(camera.current, canvasIns.current as HTMLCanvasElement);
    const quaternion = new Quaternion();
    // const axias = new THREE.Vector3(0, 1, 0)
    const euler = new Euler(0, -0.005, 0, 'XYZ');
    quaternion.setFromEuler(euler);

    const renderCvs = () => {
      controls.update();
      geometryMesh.current?.applyQuaternion(quaternion)
      glRender.current?.render(scene.current, camera.current)
      requestAnimationFrame(renderCvs)
    }

    renderCvs()
  }, [])

  useEffect(() => {
    if (canvasIns.current) {
      scene.current.background = new Color('rgba(0,0,0,0.85)');

      // init render
      initRender()

      initCameraPos()
      //
      AddSphere()
      flashGL()
      addLinght()
    }
  }, [initRender, initCameraPos, AddSphere, flashGL, addLinght])
  return (
    <div styleName='Earth'>

      <canvas ref={canvasIns} className='canvas' />
    </div>
  )
}

export default Earth
