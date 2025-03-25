import * as THREE from 'three'
import { loadModel } from './model.ts'

const dinoUrl: string = './bird.glb'

export async function createBird(): Promise<THREE.Object3D> {
  const avatar = await loadModel(dinoUrl)

  avatar.position.set(10, -1, 0)
  avatar.rotation.y = -Math.PI / 2
  avatar.scale.set(0.3, 0.3, 0.3)

  return avatar
}
