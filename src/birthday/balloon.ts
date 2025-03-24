import * as THREE from 'three'

const balloonImageUrl: string = './balloon-31.png'
export function createBalloon31() {
  const texture = new THREE.TextureLoader().load(balloonImageUrl)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
  })
  const geometry = new THREE.PlaneGeometry(6, 6)

  const balloonMesh = new THREE.Mesh(geometry, material)
  balloonMesh.position.set(0, 4, -25)
  return balloonMesh
}
