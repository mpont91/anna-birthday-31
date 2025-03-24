import * as THREE from 'three'
import { AmbientLight, DirectionalLight } from 'three'

export function createAmbientLight(): AmbientLight {
  return new THREE.AmbientLight(0xffffff, 0.5)
}

export function setAmbientLightTo(
  ambientLight: AmbientLight,
  target: number,
  intervalMs: number = 10,
): void {
  if (!ambientLight) return

  const step = target > ambientLight.intensity ? 0.01 : -0.01
  const interval = setInterval(() => {
    ambientLight.intensity += step
    if (
      (step > 0 && ambientLight.intensity >= target) ||
      (step < 0 && ambientLight.intensity <= target)
    ) {
      ambientLight.intensity = target
      clearInterval(interval)
    }
  }, intervalMs)
}

export function createLight(): DirectionalLight {
  const light: DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.025)
  light.position.setScalar(10)
  return light
}
