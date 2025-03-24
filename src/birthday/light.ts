import * as THREE from 'three'
import { DirectionalLight, Scene } from 'three'

export function createAmbientLight(scene: Scene): void {
  scene.add(new THREE.AmbientLight(0xffffff, 0.5))
}

export function createLight(): DirectionalLight {
  const light: DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.025)
  light.position.setScalar(10)
  return light
}
