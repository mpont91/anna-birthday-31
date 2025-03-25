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
import { Confetti } from './confetti.ts'
import { isShaderMesh } from './mesh.ts'
import { createDino } from './dino.ts'
import { createBird } from './bird.ts'
import { createTori } from './tori.ts'
import type { Animated } from './animated.ts'
import { createDragon } from './dragon.ts'

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
  private balloon: THREE.Mesh = new THREE.Mesh()
  private confetti: Confetti[] = []
  private dino: THREE.Object3D = new THREE.Object3D()
  private bird: THREE.Object3D = new THREE.Object3D()
  private dragon: Animated = {
    avatar: new THREE.Object3D(),
    mixer: new THREE.AnimationMixer(new THREE.Object3D()),
  }
  private tori: THREE.Object3D = new THREE.Object3D()
  private mixers: THREE.AnimationMixer[] = []

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.camera = this.createCamera()
    this.renderer = this.createRenderer()
    this.controls = this.createControls()
  }

  public async invoke(): Promise<void> {
    this.ambientLight = createAmbientLight()
    this.light = createLight()
    this.table = createTable()
    this.cake = createCake()
    this.candles = createCandles()
    this.balloon = createBalloon31()
    this.dino = await createDino()
    this.bird = await createBird()
    this.dragon = await createDragon()
    this.tori = await createTori()

    this.scene.add(this.ambientLight)
    this.scene.add(this.light)
    this.scene.add(this.table)
    this.scene.add(this.cake)
    this.cake.add(this.candles)
    this.scene.add(this.balloon)
    this.scene.add(this.dino)
    this.scene.add(this.bird)
    this.scene.add(this.dragon.avatar)
    this.mixers.push(this.dragon.mixer)
    this.scene.add(this.tori)

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
    camera.position.set(0, 5, 8).setLength(30)

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
    controls.maxDistance = 40
    controls.autoRotate = false
    controls.autoRotateSpeed = 1
    controls.target.set(0, 2, 0)
    controls.update()

    return controls
  }

  animate(): void {
    const clock = new THREE.Clock()
    const render = (): void => {
      requestAnimationFrame(render)

      const delta = clock.getDelta()

      this.mixers.forEach((m) => m.update(delta))

      for (const explosion of this.confetti) {
        explosion.update()
      }
      this.confetti = this.confetti.filter((e: Confetti) => e.isAlive())

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
    this.confetti.push(new Confetti(this.scene))

    this.candles.children.forEach((candle): void => {
      const speed: number = 1 + Math.random() * 3
      this.extinguishCandle(candle, speed)
    })

    setAmbientLightTo(this.ambientLight, 0.1)
  }

  extinguishCandle(candle: THREE.Object3D, speed: number): void {
    const flames = candle.children.filter(isShaderMesh)

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
    const flames = candle.children.filter(isShaderMesh)

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
}
