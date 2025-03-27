import * as THREE from 'three'
import { fragmentShader, vertexShader } from './vertex-shader.ts'

const candleRadius = 0.35 // Base radius of the candle
const candleHeight = 3.5 // Total height of the candle
const candleCount = 5 // Number of candles

const baseHeight = 2 // Height of the cake base
const middleHeight = 1.25 // Height of the cake middle
const topHeight = 1 // Height of the cake top

export function createCandles() {
  const candleGroup = new THREE.Group()
  const radius = 1
  for (let i = 0; i < candleCount; i++) {
    const angle = (i / candleCount) * Math.PI * 2
    const candle = createCandle()
    candle.position.x = Math.sin(angle) * radius
    candle.position.z = Math.cos(angle) * radius
    candle.scale.set(0.3, 0.3, 0.3)
    candle.position.y = baseHeight / 2 + middleHeight + topHeight
    candleGroup.add(candle)
    createCandleLight(candle)
  }
  return candleGroup
}

function getFlameMaterial(isFrontSide: boolean) {
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

function flame() {
  const flameGeometry = new THREE.SphereGeometry(0.5, 12, 12)
  flameGeometry.translate(0, 0.5, 0)
  const flameMaterial = getFlameMaterial(true)

  const flame = new THREE.Mesh(flameGeometry, flameMaterial)
  flame.position.set(0.06, candleHeight, 0.06)
  flame.rotation.y = THREE.MathUtils.degToRad(-45)
  return flame
}

function createCandle() {
  const casePath = new THREE.Path()
  casePath.moveTo(0, 0)
  casePath.lineTo(0, 0)
  casePath.absarc(0, 0, candleRadius, Math.PI * 1.5, Math.PI * 2)
  casePath.lineTo(candleRadius, candleHeight) // Use baseRadius and candleHeight
  const caseGeometry = new THREE.LatheGeometry(casePath.getPoints(), 64)
  const caseMaterial = new THREE.MeshStandardMaterial({ color: 0xff4500 }) // Orange-red color
  const caseMesh = new THREE.Mesh(caseGeometry, caseMaterial)

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

  const candlewickMesh = new THREE.Mesh(candlewickGeometry, candlewickMaterial)
  caseMesh.add(candlewickMesh)

  return caseMesh
}

function createCandleLight(candleMesh: THREE.Mesh) {
  const candleLight = new THREE.PointLight(0xffaa33, 1, 5, 2)
  candleLight.position.set(0, candleHeight, 0)
  candleMesh.add(candleLight)
  const candleLight2 = new THREE.PointLight(0xffaa33, 1, 10, 2)
  candleLight2.position.set(0, candleHeight + 1, 0)
  candleMesh.add(candleLight2)
  candleMesh.add(flame())
}
