
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,

  Fog,
  BoxGeometry,
  ShaderMaterial,
  Mesh
} from 'three'
import { useCallback, useEffect, useRef } from 'react'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import shaders from './glsl';
import './CircularMask.module.less'

const { innerWidth, innerHeight } = window

const aspect = innerWidth / innerHeight
// const clock = new Clock();
const CircularMask = (): JSX.Element => {
  const canvasIns = useRef<HTMLCanvasElement | null>(null)
  const glRender = useRef<THREE.WebGLRenderer | null>(null)
  const camera = useRef<THREE.PerspectiveCamera>(new PerspectiveCamera(
    75, aspect, 1, 1200
  ))
  const scene = useRef<THREE.Scene>(new Scene())
  const shaderMaterial = useRef<THREE.ShaderMaterial|null>(null)

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
    camera.current.position.setZ(-5)

    camera.current.lookAt(0, 0, 0)
  }, [])

  const flashGL = useCallback(() => {
    const controls = new OrbitControls(camera.current, canvasIns.current as HTMLCanvasElement);
    const renderCvs = () => {
      controls.update();
      glRender.current?.render(scene.current, camera.current)
      if (shaderMaterial.current) {
        shaderMaterial.current.uniforms.time.value += 0.1
      }
      requestAnimationFrame(renderCvs)
    }

    renderCvs()
  }, [])

  const addMaskCube = useCallback(() => {
    const cube = new BoxGeometry(2, 2, 2)
    const uniforms = {
      time: { type: 'f', value: 0.0 },
    }
    shaderMaterial.current = new ShaderMaterial({
      vertexShader: shaders.vertex.default,
      fragmentShader: shaders.fragment.default,
      transparent: true,
      uniforms: uniforms
    })
    const mesh = new Mesh(cube, shaderMaterial.current)
    scene.current.add(mesh)
  }, [])

  useEffect(() => {
    if (canvasIns.current) {
      scene.current.fog = new Fog('#fff', 1, 150)

      // init render
      initRender()

      initCameraPos()
      // 刷新GL
      flashGL()

      addMaskCube()
    }
  }, [initRender, flashGL, initCameraPos, addMaskCube])
  return (
    <div styleName='CircularMask'>
      <canvas ref={canvasIns} className='canvas' />
    </div>
  )
}

export default CircularMask
