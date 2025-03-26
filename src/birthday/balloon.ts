import * as THREE from 'three'

const balloonImageUrl: string = './balloon-31.png'
export function createBalloons() {
  const group: THREE.Group = new THREE.Group()

  const texture = new THREE.TextureLoader().load(balloonImageUrl)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
  })
  const geometry = new THREE.PlaneGeometry(25, 25)

  const balloon1 = new THREE.Mesh(geometry, material)
  balloon1.position.set(0, 4, -39)

  const balloon2 = new THREE.Mesh(geometry, material)
  balloon2.rotation.y = THREE.MathUtils.degToRad(90)
  balloon2.position.set(-39, 4, 0)

  const balloon3 = new THREE.Mesh(geometry, material)
  balloon3.rotation.y = THREE.MathUtils.degToRad(-90)
  balloon3.position.set(39, 4, 0)

  const balloon4 = new THREE.Mesh(geometry, material)
  balloon4.rotation.y = THREE.MathUtils.degToRad(180)
  balloon4.position.set(0, 4, 39)

  group.add(balloon1)
  group.add(balloon2)
  group.add(balloon3)
  group.add(balloon4)

  return group
}
