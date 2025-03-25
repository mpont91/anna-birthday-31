import * as THREE from 'three'
import { loadModel } from './model.ts'

const dinoUrl: string = './dino.glb'

export async function createDino(): Promise<THREE.Object3D> {
  const avatar = await loadModel(dinoUrl)

  avatar.position.set(-10, -1, 0)
  avatar.rotation.y = Math.PI
  avatar.scale.set(5, 5, 5)

  return avatar
}
