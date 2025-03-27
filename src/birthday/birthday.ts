import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { AmbientLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { createAmbientLight, createLight, setAmbientLightTo } from './light.ts'
import { createCake } from './cake.ts'
import { createCandles } from './candle.ts'
import { createBalloons } from './balloon.ts'
import { Confetti } from './confetti.ts'
import { isShaderMesh } from './mesh.ts'
import { createAlien } from './alien.ts'
import { createRobot } from './robot.ts'
import { createTori } from './tori.ts'
import type { Animated } from './animated.ts'
import { createDragon } from './dragon.ts'
import { createBird } from './bird.ts'
import { createDucks } from './ducks.ts'
import { createRoom } from './room.ts'
import { createTable } from './table.ts'

export class Birthday {
  private readonly scene: Scene = new THREE.Scene()
  private readonly camera: PerspectiveCamera
  private readonly renderer: WebGLRenderer
  private readonly controls: OrbitControls
  private ambientLight: AmbientLight = new THREE.AmbientLight()
  private candles: THREE.Group = new THREE.Group()
  private confetti: Confetti[] = []
  private mixers: THREE.AnimationMixer[] = []

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.camera = this.createCamera()
    this.renderer = this.createRenderer()
    this.controls = this.createControls()
  }

  public async invoke(): Promise<void> {
    this.ambientLight = createAmbientLight()

    this.candles = createCandles()

    const room: THREE.Object3D = createRoom()
    const light: THREE.DirectionalLight = createLight()
    const table: THREE.Object3D = await createTable()
    const cake: THREE.Group = createCake()
    const balloons: THREE.Group = createBalloons()
    const alien: Animated = await createAlien()
    const robot: Animated = await createRobot()
    const dragon: Animated = await createDragon()
    const bird: Animated = await createBird()
    const ducks: Animated = await createDucks()
    const tori: THREE.Object3D = await createTori()

    this.scene.add(room)
    this.scene.add(this.ambientLight)
    this.scene.add(light)
    this.scene.add(table)
    this.scene.add(cake)
    cake.add(this.candles)
    this.scene.add(balloons)
    this.scene.add(robot.avatar)
    this.scene.add(alien.avatar)
    this.scene.add(dragon.avatar)
    this.scene.add(bird.avatar)
    this.scene.add(ducks.avatar)
    this.scene.add(tori)

    this.mixers.push(
      dragon.mixer,
      robot.mixer,
      alien.mixer,
      bird.mixer,
      ducks.mixer,
    )

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
      antialias: false,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x101005)
    renderer.shadowMap.enabled = false

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
    let startTime: number | null = null

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = (timestamp - startTime) / 1000
      progress = elapsed * speed
      const factor = 1 - progress

      if (progress >= 1) {
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
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
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

    let startTime: number | null = null

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = (timestamp - startTime) / 1000
      const progress = elapsed * speed
      const factor = Math.min(progress, 1)

      if (progress >= 1) {
        flames.forEach((flame) => {
          flame.visible = true
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
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }
}
