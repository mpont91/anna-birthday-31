import {
  CylinderGeometry,
  MeshStandardMaterial,
  Texture,
  TextureLoader,
  CanvasTexture,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
} from 'three'
import * as THREE from 'three'

const tableImageUrl: string = './table.png'
const tableHeightOffset: number = 1
const tableWidth: number = 0.3

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

  tableMesh.add(createTextLabel())

  return tableMesh
}

function createTextLabel(): THREE.Mesh {
  const text: string = '❤️ Per molts anys!️ ❤️'
  const name: string = '🥰 Anna 🥰'

  const canvas = document.createElement('canvas')
  canvas.width = 900
  canvas.height = 400
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000000'
  ctx.font = 'bold 64px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  ctx.fillText(name, canvas.width / 2, canvas.height / 2 + 100)

  const texture = new CanvasTexture(canvas)
  const material = new MeshBasicMaterial({ map: texture, transparent: true })
  const geometry = new PlaneGeometry(15, 10)

  const mesh = new Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = -tableHeightOffset + tableWidth
  mesh.position.z = 4
  return mesh
}
