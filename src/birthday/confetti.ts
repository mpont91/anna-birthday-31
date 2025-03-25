import * as THREE from 'three'

export class Confetti {
  private readonly geometry: THREE.BufferGeometry
  private readonly material: THREE.PointsMaterial
  private readonly points: THREE.Points
  private readonly velocities: THREE.Vector3[] = []
  private readonly gravity = new THREE.Vector3(0, -0.015, 0)
  private lifetime = 150

  constructor(
    private scene: THREE.Scene,
    private count = 500,
  ) {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      positions[i3] = (Math.random() - 0.5) * 4
      positions[i3 + 1] = 4 + Math.random() * 2
      positions[i3 + 2] = (Math.random() - 0.5) * 4

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.8,
        Math.random() * 0.8 + 0.4,
        (Math.random() - 0.5) * 0.8,
      )
      this.velocities.push(velocity)

      colors[i3] = Math.random()
      colors[i3 + 1] = Math.random()
      colors[i3 + 2] = Math.random()
      sizes[i] = 0.15 + Math.random() * 0.15
    }

    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    )
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    this.material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      sizeAttenuation: true,
      map: this.createCircleTexture(),
      alphaTest: 0.01,
    })

    this.points = new THREE.Points(this.geometry, this.material)
    this.scene.add(this.points)
  }

  private createCircleTexture(): THREE.Texture {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!

    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    )
    gradient.addColorStop(0, 'white')
    gradient.addColorStop(1, 'transparent')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.needsUpdate = true

    return texture
  }

  update(): void {
    const positions = this.geometry.attributes.position as THREE.BufferAttribute

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3

      this.velocities[i].add(this.gravity)

      positions.array[i3] += this.velocities[i].x
      positions.array[i3 + 1] += this.velocities[i].y
      positions.array[i3 + 2] += this.velocities[i].z
    }

    positions.needsUpdate = true
    this.lifetime--

    if (this.lifetime <= 0) {
      this.scene.remove(this.points)
    }
  }

  isAlive(): boolean {
    return this.lifetime > 0
  }
}
