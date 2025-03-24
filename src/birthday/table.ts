import {
  CylinderGeometry,
  MeshStandardMaterial,
  Texture,
  TextureLoader,
} from 'three'
import * as THREE from 'three'

const tableImageUrl: string = './table.png'
const tableHeightOffset: number = 1

export function createTable() {
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
