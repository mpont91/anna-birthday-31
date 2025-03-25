import * as THREE from 'three'
import { loadModel } from './model.ts'

const url: string = './tori.glb'

export async function createTori(): Promise<THREE.Object3D> {
  const avatar = await loadModel(url)

  avatar.position.set(0, 3.5, -12)
  avatar.rotation.y = THREE.MathUtils.degToRad(225)
  avatar.scale.set(20, 20, 20)

  return avatar
}
