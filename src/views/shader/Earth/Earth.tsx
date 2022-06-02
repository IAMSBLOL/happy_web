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
  return (
    <div styleName='Earth'>

      <canvas ref={canvasIns} className='canvas' />
    </div>
  )
}

export default Earth
