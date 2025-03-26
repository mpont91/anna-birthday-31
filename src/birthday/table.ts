import * as THREE from 'three'
import { loadModel } from './model.ts'
import {
  Box3,
  CanvasTexture,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector3,
} from 'three'

const url: string = './table.glb'

export async function createTable(): Promise<THREE.Object3D> {
  const avatar = await loadModel(url)

  avatar.position.set(-70, -16, 45)
  avatar.scale.set(0.75, 0.5, 0.75)

  const box = new Box3().setFromObject(avatar)
  const size = new Vector3()
  box.getSize(size)
  const topY = box.max.y

  const textLabel = createTextLabel()
  textLabel.position.y = topY + 31
  textLabel.position.x = box.getCenter(new Vector3()).x + 93
  textLabel.position.z = box.getCenter(new Vector3()).z - 50

  avatar.add(textLabel)

  return avatar
}

function createTextLabel(): THREE.Mesh {
  const text = '❤️ Per molts anys!️ ❤️'
  const name = '🥰 Anna 🥰'

  const canvas = document.createElement('canvas')
  canvas.width = 9000
  canvas.height = 4000
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000000'
  ctx.font = 'bold 300px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 300)
  ctx.fillText(name, canvas.width / 2, canvas.height / 2 + 300)

  const texture = new CanvasTexture(canvas)
  const material = new MeshBasicMaterial({ map: texture, transparent: true })
  const geometry = new PlaneGeometry(60, 30)

  const mesh = new Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2

  return mesh
}
