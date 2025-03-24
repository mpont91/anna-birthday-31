import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import { createAmbientLight, createLight } from './light.ts'
import { createTable } from './table.ts'
import { createCake } from './cake.ts'
import { createCandles } from './candle.ts'
import { createBalloon31 } from './balloon.ts'

export class Birthday {
  private scene: Scene = new THREE.Scene()
  private camera: PerspectiveCamera = this.createCamera()
  private flameMaterials: THREE.ShaderMaterial[] = []

  constructor(private readonly canvas: HTMLCanvasElement) {}

  public invoke(): void {
    const renderer: WebGLRenderer = this.createRenderer(this.canvas)
    const controls: OrbitControls = this.createControls(renderer)

    createAmbientLight(this.scene)
    const light: DirectionalLight = createLight()

    const table = createTable()
    const cake = createCake()
    const candles = createCandles(this.flameMaterials)
    const balloon = createBalloon31()

    this.scene.add(light)
    this.scene.add(table)
    this.scene.add(cake)
    cake.add(candles)
    this.scene.add(balloon)

    this.animate(renderer, controls)

    window.addEventListener('resize', () => this.onWindowResize(renderer))
  }

  createCamera(): THREE.PerspectiveCamera {
    const camera: PerspectiveCamera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000,
    )
    camera.position.set(0, 5, 8).setLength(20)

    return camera
  }

  createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
    const renderer: WebGLRenderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x101005)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    return renderer
  }

  createControls(renderer: THREE.WebGLRenderer): OrbitControls {
    const controls = new OrbitControls(this.camera, renderer.domElement)
    controls.enablePan = false
    controls.minPolarAngle = THREE.MathUtils.degToRad(60)
    controls.maxPolarAngle = THREE.MathUtils.degToRad(95)
    controls.minDistance = 4
    controls.maxDistance = 20
    controls.autoRotate = false
    controls.autoRotateSpeed = 1
    controls.target.set(0, 2, 0)
    controls.update()

    return controls
  }

  animate(renderer: THREE.WebGLRenderer, controls: OrbitControls): void {
    const clock = new THREE.Clock()

    const render = () => {
      requestAnimationFrame(render)

      const elapsedTime = clock.getElapsedTime()
      for (const mat of this.flameMaterials) {
        mat.uniforms.time.value = elapsedTime
      }

      controls.update()
      renderer.render(this.scene, this.camera)
    }

    render()
  }

  onWindowResize(renderer: THREE.WebGLRenderer): void {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
