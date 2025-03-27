import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

export async function loadModel(url: string): Promise<THREE.Object3D> {
  return new Promise((resolve, reject): void => {
    const loader: GLTFLoader = new GLTFLoader()
    loader.load(
      url,
      (gltf: GLTF): void => resolve(gltf.scene),
      undefined,
      (error: unknown): void => {
        console.error('Error loading model:', error)
        reject(error)
      },
    )
  })
}

export async function loadGLTF(url: string): Promise<GLTF> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    loader.load(
      url,
      (gltf) => resolve(gltf),
      undefined,
      (err) => reject(err),
    )
  })
}
