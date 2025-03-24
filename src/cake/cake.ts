import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {
  CylinderGeometry,
  DirectionalLight,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Texture,
  TextureLoader,
  WebGLRenderer,
} from 'three'
import { fragmentShader, vertexShader } from './vertex-shader.ts'

const candleRadius = 0.35 // Base radius of the candle
const candleHeight = 3.5 // Total height of the candle
const candleCount = 5 // Number of candles

const baseRadius = 2.5 // Base radius of the cake
const baseHeight = 2 // Height of the cake base
const middleRadius = 2 // Middle radius of the cake
const middleHeight = 1.25 // Height of the cake middle
const topRadius = 1.5 // Top radius of the cake
const topHeight = 1 // Height of the cake top

const tableImageUrl: string = './table.png'
const tableHeightOffset: number = 1

export class Cake {
  private scene: Scene = new THREE.Scene()
  private camera: PerspectiveCamera = this.createCamera()
  private flameMaterials: THREE.ShaderMaterial[] = []

  constructor(private readonly canvas: HTMLCanvasElement) {}

  public invoke(): void {
    const renderer: WebGLRenderer = this.createRenderer(this.canvas)
    const controls: OrbitControls = this.createControls(renderer)

    this.createAmbientLight()

    const light: DirectionalLight = this.createLight()
    const table = this.createTable()
    const cake = this.createCake()
    const candles = this.createCandles()

    this.scene.add(light)
    this.scene.add(table)
    this.scene.add(cake)

    cake.add(candles)

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
    camera.position.set(3, 5, 8).setLength(15)

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

  createAmbientLight(): void {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5))
  }

  createLight(): DirectionalLight {
    const light: DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.025)
    light.position.setScalar(10)
    return light
  }

  createTable() {
    const tableGeometry: CylinderGeometry = new THREE.CylinderGeometry(
      14,
      14,
      0.5,
      64,
    )
    tableGeometry.translate(0, -tableHeightOffset, 0)
    const textureLoader: TextureLoader = new THREE.TextureLoader()
    const tableTexture: Texture = textureLoader.load(tableImageUrl)
    const tableMaterial: MeshStandardMaterial = new THREE.MeshStandardMaterial({
      map: tableTexture,
      metalness: 0,
      roughness: 0.75,
    })
    const tableMesh = new THREE.Mesh(tableGeometry, tableMaterial)
    tableMesh.receiveShadow = true

    return tableMesh
  }

  createCake() {
    const cakeGroup = new THREE.Group()

    const baseGeometry = new THREE.CylinderGeometry(
      baseRadius,
      baseRadius,
      baseHeight,
      32,
    )
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0xfff5ee })
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial)

    const middleGeometry = new THREE.CylinderGeometry(
      middleRadius,
      middleRadius,
      middleHeight,
      32,
    )
    const middleMaterial = new THREE.MeshPhongMaterial({ color: 0xfffafa })
    const middleMesh = new THREE.Mesh(middleGeometry, middleMaterial)
    middleMesh.position.y = baseHeight / 2 + middleHeight / 2

    const topGeometry = new THREE.CylinderGeometry(
      topRadius,
      topRadius,
      topHeight,
      32,
    )
    const topMaterial = new THREE.MeshPhongMaterial({ color: 0xf0ffff })
    const topMesh = new THREE.Mesh(topGeometry, topMaterial)
    topMesh.position.y = baseHeight / 2 + middleHeight + topHeight / 2

    cakeGroup.add(baseMesh)
    cakeGroup.add(middleMesh)
    cakeGroup.add(topMesh)

    return cakeGroup
  }

  getFlameMaterial(isFrontSide: boolean) {
    const side: 0 | 1 = isFrontSide ? THREE.FrontSide : THREE.BackSide
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      side: side,
    })
  }

  flame() {
    const flameGeometry = new THREE.SphereGeometry(0.5, 12, 12)
    flameGeometry.translate(0, 0.5, 0)
    const flameMaterial = this.getFlameMaterial(true)

    this.flameMaterials.push(flameMaterial)

    const flame = new THREE.Mesh(flameGeometry, flameMaterial)
    flame.position.set(0.06, candleHeight, 0.06)
    flame.rotation.y = THREE.MathUtils.degToRad(-45)
    return flame
  }

  createCandle() {
    const casePath = new THREE.Path()
    casePath.moveTo(0, 0)
    casePath.lineTo(0, 0)
    casePath.absarc(0, 0, candleRadius, Math.PI * 1.5, Math.PI * 2)
    casePath.lineTo(candleRadius, candleHeight) // Use baseRadius and candleHeight
    const caseGeometry = new THREE.LatheGeometry(casePath.getPoints(), 64)
    const caseMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 }) // Orange-red color
    const caseMesh = new THREE.Mesh(caseGeometry, caseMaterial)
    caseMesh.castShadow = true

    // top part of the candle
    const topGeometry = new THREE.CylinderGeometry(0.2, candleRadius, 0.1, 32) // Use baseRadius for the top base
    const topMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 })
    const topMesh = new THREE.Mesh(topGeometry, topMaterial)
    topMesh.position.y = candleHeight // Use candleHeight for positioning
    caseMesh.add(topMesh)

    // candlewick
    const candlewickProfile = new THREE.Shape()
    candlewickProfile.absarc(0, 0, 0.0625, 0, Math.PI * 2)

    const candlewickCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, candleHeight - 1, 0),
      new THREE.Vector3(0, candleHeight - 0.5, -0.0625),
      new THREE.Vector3(0.25, candleHeight - 0.5, 0.125),
    ])

    const candlewickGeometry = new THREE.ExtrudeGeometry(candlewickProfile, {
      steps: 8,
      bevelEnabled: false,
      extrudePath: candlewickCurve,
    })
    const colors: number[] = []
    const color1 = new THREE.Color('black')
    const color2 = new THREE.Color(0x994411)
    const color3 = new THREE.Color(0xffff44)
    for (let i = 0; i < candlewickGeometry.attributes.position.count; i++) {
      if (candlewickGeometry.attributes.position.getY(i) < 0.4) {
        color1.toArray(colors, i * 3)
      } else {
        color2.toArray(colors, i * 3)
      }
      if (candlewickGeometry.attributes.position.getY(i) < 0.15)
        color3.toArray(colors, i * 3)
    }
    candlewickGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(colors), 3),
    )
    candlewickGeometry.translate(0, 0.95, 0)
    const candlewickMaterial = new THREE.MeshBasicMaterial({
      vertexColors: true,
    })

    const candlewickMesh = new THREE.Mesh(
      candlewickGeometry,
      candlewickMaterial,
    )
    caseMesh.add(candlewickMesh)

    return caseMesh
  }

  createCandleLight(candleMesh: THREE.Mesh) {
    const candleLight = new THREE.PointLight(0xffaa33, 1, 5, 2)
    candleLight.position.set(0, candleHeight, 0)
    candleLight.castShadow = true
    candleMesh.add(candleLight)
    const candleLight2 = new THREE.PointLight(0xffaa33, 1, 10, 2)
    candleLight2.position.set(0, candleHeight + 1, 0)
    candleLight2.castShadow = true
    candleMesh.add(candleLight2)
    candleMesh.add(this.flame())
  }

  createCandles() {
    const candleGroup = new THREE.Group()
    const radius = 1
    for (let i = 0; i < candleCount; i++) {
      const angle = (i / candleCount) * Math.PI * 2
      const candle = this.createCandle()
      candle.position.x = Math.cos(angle) * radius
      candle.position.z = Math.sin(angle) * radius
      candle.scale.set(0.3, 0.3, 0.3)
      candle.castShadow = false
      candle.position.y = baseHeight / 2 + middleHeight + topHeight
      candleGroup.add(candle)
      this.createCandleLight(candle)
    }
    return candleGroup
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
