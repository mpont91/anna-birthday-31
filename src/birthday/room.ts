import * as THREE from 'three'
import { MeshStandardMaterial, Texture, TextureLoader } from 'three'

const floorImageUrl: string = './floor.webp'
const wallImageUrl: string = './wall.webp'

export function createRoom(): THREE.Group {
  const group = new THREE.Group()

  const textureLoader: TextureLoader = new THREE.TextureLoader()
  const floorTexture: Texture = textureLoader.load(floorImageUrl)
  const floorMaterial: MeshStandardMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    metalness: 0,
    roughness: 0.75,
  })

  const wallTexture: Texture = textureLoader.load(wallImageUrl)
  const wallMaterial: MeshStandardMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    metalness: 0,
    roughness: 0.75,
  })

  const ceilMaterial: MeshStandardMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    metalness: 0.15,
    roughness: 0.75,
  })

  const wallThickness = 0.1
  const roomWidth = 80
  const roomHeight = 37
  const roomDepth = 80
  const floorLevel = -15

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(roomWidth, wallThickness, roomDepth),
    floorMaterial,
  )
  floor.position.y = floorLevel
  group.add(floor)

  const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(roomWidth, wallThickness, roomDepth),
    ceilMaterial,
  )
  ceiling.position.y = floorLevel + roomHeight
  group.add(ceiling)

  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(roomWidth, roomHeight, wallThickness),
    wallMaterial,
  )
  backWall.position.z = -roomDepth / 2
  backWall.position.y = floorLevel + roomHeight / 2
  group.add(backWall)

  const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(roomWidth, roomHeight, wallThickness),
    wallMaterial,
  )
  frontWall.position.z = roomDepth / 2
  frontWall.position.y = floorLevel + roomHeight / 2
  group.add(frontWall)

  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth),
    wallMaterial,
  )
  leftWall.position.x = -roomWidth / 2
  leftWall.position.y = floorLevel + roomHeight / 2
  group.add(leftWall)

  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth),
    wallMaterial,
  )
  rightWall.position.x = roomWidth / 2
  rightWall.position.y = floorLevel + roomHeight / 2
  group.add(rightWall)

  return group
}
