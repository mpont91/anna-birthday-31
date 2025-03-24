import * as THREE from 'three'

const baseRadius = 2.5 // Base radius of the cake
const baseHeight = 2 // Height of the cake base
const middleRadius = 2 // Middle radius of the cake
const middleHeight = 1.25 // Height of the cake middle
const topRadius = 1.5 // Top radius of the cake
const topHeight = 1 // Height of the cake top

export function createCake() {
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
