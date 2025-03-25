import * as THREE from 'three'
import { loadGLTF } from './model.ts'
import type { Animated } from './animated.ts'

const url: string = './robot.glb'

export async function createRobot(): Promise<Animated> {
  const gltf = await loadGLTF(url)
  const avatar = gltf.scene

  avatar.position.set(-7, -0.65, -3)
  avatar.rotation.y = THREE.MathUtils.degToRad(-45)
  avatar.scale.set(2, 2, 2)

  const mixer = new THREE.AnimationMixer(avatar)
  gltf.animations.forEach((clip) => mixer.clipAction(clip).play())

  return { avatar, mixer }
}
