import * as THREE from 'three'

const baseRadius = 2.5 // Base radius of the cake
const baseHeight = 2 // Height of the cake base
const middleRadius = 2 // Middle radius of the cake
const middleHeight = 1.25 // Height of the cake middle
const topRadius = 1.5 // Top radius of the cake
const topHeight = 1 // Height of the cake top
const chocolateDarkImageUrl: string = './chocolate-dark.png'
const chocolateBrownImageUrl: string = './chocolate-brown.png'
const chocolateWhiteImageUrl: string = './chocolate-white.png'

export function createCake() {
  const cakeGroup = new THREE.Group()

  const textureLoader = new THREE.TextureLoader()
  const baseTexture = textureLoader.load(chocolateWhiteImageUrl)

  const baseGeometry = new THREE.CylinderGeometry(
    baseRadius,
    baseRadius,
    baseHeight,
    32,
  )
  const baseMaterial = new THREE.MeshPhongMaterial({
    map: baseTexture,
    shininess: 10,
  })
  const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial)

  const middleGeometry = new THREE.CylinderGeometry(
    middleRadius,
    middleRadius,
    middleHeight,
    32,
  )
  const middleTexture = textureLoader.load(chocolateBrownImageUrl)
  const middleMaterial = new THREE.MeshPhongMaterial({
    map: middleTexture,
    shininess: 10,
  })
  const middleMesh = new THREE.Mesh(middleGeometry, middleMaterial)
  middleMesh.position.y = baseHeight / 2 + middleHeight / 2

  const topGeometry = new THREE.CylinderGeometry(
    topRadius,
    topRadius,
    topHeight,
    32,
  )
  const topTexture = textureLoader.load(chocolateDarkImageUrl)
  const topMaterial = new THREE.MeshPhongMaterial({
    map: topTexture,
    shininess: 10,
  })
  const topMesh = new THREE.Mesh(topGeometry, topMaterial)
  topMesh.position.y = baseHeight / 2 + middleHeight + topHeight / 2

  cakeGroup.add(baseMesh)
  cakeGroup.add(middleMesh)
  cakeGroup.add(topMesh)

  return cakeGroup
}
