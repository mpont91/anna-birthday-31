import * as THREE from 'three'
import { loadGLTF } from './model.ts'
import type { Animated } from './animated.ts'
import { tableLevel } from './constants.ts'

const url: string = './ducks.glb'

export async function createDucks(): Promise<Animated> {
  const gltf = await loadGLTF(url)
  const avatar = gltf.scene

  avatar.position.set(-5, tableLevel, 2)
  avatar.rotation.y = THREE.MathUtils.degToRad(30)
  avatar.scale.set(0.5, 0.5, 0.5)

  const mixer = new THREE.AnimationMixer(avatar)
  gltf.animations.forEach((clip) => mixer.clipAction(clip).play())

  return { avatar, mixer }
}
