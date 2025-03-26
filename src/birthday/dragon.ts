import * as THREE from 'three'
import { loadGLTF } from './model.ts'
import type { Animated } from './animated.ts'

const url: string = './dragon.glb'

export async function createDragon(): Promise<Animated> {
  const gltf = await loadGLTF(url)
  const avatar = gltf.scene

  avatar.position.set(2, 1.75, -3)
  avatar.rotation.y = THREE.MathUtils.degToRad(-30)
  avatar.scale.set(5, 5, 5)

  const mixer = new THREE.AnimationMixer(avatar)
  gltf.animations.forEach((clip) => mixer.clipAction(clip).play())

  return { avatar, mixer }
}
