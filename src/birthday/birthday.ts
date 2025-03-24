import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import { createAmbientLight, createLight, setAmbientLightTo } from './light.ts'
import { createTable } from './table.ts'
import { createCake } from './cake.ts'
import { createCandles } from './candle.ts'
import { createBalloon31 } from './balloon.ts'

export class Birthday {
  private readonly scene: Scene = new THREE.Scene()
  private readonly camera: PerspectiveCamera
  private readonly renderer: WebGLRenderer
  private readonly controls: OrbitControls
  private ambientLight: AmbientLight = new THREE.AmbientLight()
  private light: DirectionalLight = new DirectionalLight()
  private table: THREE.Mesh = new THREE.Mesh()
  private cake: THREE.Group = new THREE.Group()
  private candles: THREE.Group = new THREE.Group()
  private flameMaterials: THREE.ShaderMaterial[] = []
  private balloon: THREE.Mesh = new THREE.Mesh()

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.camera = this.createCamera()
    this.renderer = this.createRenderer()
    this.controls = this.createControls()
  }

  public invoke(): void {
    this.ambientLight = createAmbientLight()
    this.light = createLight()
    this.table = createTable()
    this.cake = createCake()
    this.candles = createCandles(this.flameMaterials)
    this.balloon = createBalloon31()

    this.scene.add(this.ambientLight)
    this.scene.add(this.light)
    this.scene.add(this.table)
    this.scene.add(this.cake)
    this.cake.add(this.candles)
    this.scene.add(this.balloon)

    this.animate()

    window.addEventListener('resize', () => this.onWindowResize())
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

  createRenderer(): THREE.WebGLRenderer {
    const renderer: WebGLRenderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x101005)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    return renderer
  }

  createControls(): OrbitControls {
    const controls: OrbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement,
    )
    controls.enablePan = false
    controls.minPolarAngle = THREE.MathUtils.degToRad(60)
    controls.maxPolarAngle = THREE.MathUtils.degToRad(95)
    controls.minDistance = 7
    controls.maxDistance = 20
    controls.autoRotate = false
    controls.autoRotateSpeed = 1
    controls.target.set(0, 2, 0)
    controls.update()

    return controls
  }

  animate(): void {
    const clock: THREE.Clock = new THREE.Clock()

    const render = (): void => {
      requestAnimationFrame(render)

      const elapsedTime: number = clock.getElapsedTime()

      for (const material of this.flameMaterials) {
        material.uniforms.time.value = elapsedTime
      }

      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    }

    render()
  }

  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  blowOutCandles(): void {
    this.candles.children.forEach((candle): void => {
      const speed: number = 1 + Math.random() * 3
      this.extinguishCandle(candle, speed)
    })

    setAmbientLightTo(this.ambientLight, 0.1)
  }

  extinguishCandle(candle: THREE.Object3D, speed: number): void {
    const flames = candle.children.filter(this.isShaderMesh)

    const lights = candle.children.filter(
      (child): child is THREE.PointLight => child instanceof THREE.PointLight,
    )

    let progress = 0
    const extinguishInterval = setInterval(() => {
      progress += 0.02 * speed
      const factor = 1 - progress

      if (progress >= 1) {
        clearInterval(extinguishInterval)
        flames.forEach((flame) => {
          flame.visible = false
          flame.material.opacity = 0
        })
        lights.forEach((light) => {
          light.intensity = 0
        })
      } else {
        flames.forEach((flame) => {
          flame.material.opacity = factor
          flame.scale.set(factor, factor, factor)
        })

        lights.forEach((light) => {
          light.intensity = factor
        })
      }
    }, 30)
  }

  igniteCandles(): void {
    this.candles.children.forEach((candle): void => {
      const speed: number = 1 + Math.random() * 3
      this.lightCandle(candle, speed)
    })

    setAmbientLightTo(this.ambientLight, 0.5)
  }

  lightCandle(candle: THREE.Object3D, speed: number): void {
    const flames = candle.children.filter(this.isShaderMesh)

    const lights = candle.children.filter(
      (child): child is THREE.PointLight => child instanceof THREE.PointLight,
    )

    let progress = 0
    const lightInterval = setInterval(() => {
      progress += 0.02 * speed
      const factor = Math.min(progress, 1)

      if (progress >= 1) {
        clearInterval(lightInterval)
        flames.forEach((flame) => {
          flame.material.opacity = 1
          flame.scale.set(1, 1, 1)
        })
        lights.forEach((light) => {
          light.intensity = 1
        })
      } else {
        flames.forEach((flame) => {
          if (!flame.visible) flame.visible = true
          flame.material.opacity = factor
          flame.scale.set(factor, factor, factor)
        })

        lights.forEach((light) => {
          light.intensity = factor
        })
      }
    }, 30)
  }

  isShaderMesh(
    obj: unknown,
  ): obj is THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial> {
    return (
      obj instanceof THREE.Mesh && obj.material instanceof THREE.ShaderMaterial
    )
  }
}
