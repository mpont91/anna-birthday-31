import * as THREE from 'three'
import { loadModel } from './model.ts'

const dinoUrl: string = './bird.glb'

export async function createBird(): Promise<THREE.Object3D> {
  const avatar = await loadModel(dinoUrl)

  avatar.position.set(7, -1, -2)
  avatar.rotation.y = THREE.MathUtils.degToRad(290)
  avatar.scale.set(0.3, 0.3, 0.3)

  return avatar
}
