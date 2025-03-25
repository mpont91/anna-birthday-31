import * as THREE from 'three'
import { loadModel } from './model.ts'

const url: string = './dino.glb'

export async function createDino(): Promise<THREE.Object3D> {
  const avatar = await loadModel(url)

  avatar.position.set(-5, -1, -5)
  avatar.rotation.y = THREE.MathUtils.degToRad(145)
  avatar.scale.set(5, 5, 5)

  return avatar
}
