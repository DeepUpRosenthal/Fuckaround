import { useState, createRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Connections, Bundle } from './Nodes'
import * as THREE from 'three'

THREE.Object3D.DefaultUp = new THREE.Vector3(0, 1, 0)

export default function App() {
  const [[a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t]] = useState(() => [...Array(24)].map(createRef))
  return (
    <Canvas orthographic camera={{ zoom: 80 }}>
      <Connections
        mappings={[
          [b, h],
          [c, j],
          [d, l],
          [e, m],
          [f, o],
        ]}>
        <Bundle name="SNRVe 24x7" color="#204090" position={[-2, 2, 0]} microTubes={[a, b, c, d, e, f, g]} />
        <Bundle name="SNRVe 7x7" color="#904020" position={[2, -3, 0]} microTubes={[h, i, j, k, l, m, o]} />
      </Connections>
    </Canvas>
  )
}
