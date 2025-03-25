import * as THREE from 'three'

export function isShaderMesh(
  obj: unknown,
): obj is THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial> {
  return (
    obj instanceof THREE.Mesh && obj.material instanceof THREE.ShaderMaterial
  )
}

export function isMeshWithMaterial(
  obj: unknown,
): obj is THREE.Mesh<THREE.BufferGeometry, THREE.Material> {
  return obj instanceof THREE.Mesh && obj.material instanceof THREE.Material
}
