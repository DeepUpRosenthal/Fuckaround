import * as THREE from 'three'
import { createContext, useMemo, useRef, useState, useContext, useLayoutEffect, forwardRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, QuadraticBezierLine, Text } from '@react-three/drei'
import { useDrag } from '@use-gesture/react'

const context = createContext()
const Circle = forwardRef(({ children, opacity = 1, radius = 0.05, segments = 32, color = '#ff1050', ...props }, ref) => (
  <mesh ref={ref} {...props}>
    <circleGeometry args={[radius, segments]} />
    <meshBasicMaterial transparent={opacity < 1} opacity={opacity} color={color} />
    {children}
  </mesh>
))

const Square = forwardRef(({ children, opacity = 1, size, color = '#ff1050', ...props }, ref) => (
  <mesh ref={ref} {...props}>
    <planeGeometry args={size} />
    <meshBasicMaterial transparent={opacity < 1} opacity={opacity} color={color} />
    {children}
  </mesh>
))

export function Connections({ children, mappings }) {
  const group = useRef()
  const lines = useMemo(
    () =>
      mappings.map(([start, end]) => ({
        start: start.current?.position.clone(),
        end: end.current?.position.clone(),
      })),
    [mappings],
  )
  useFrame((_, delta) => group.current.children.forEach((group) => (group.children[0].material.uniforms.dashOffset.value -= delta * 10)))
  return (
    <context.Provider value={set}>
      <group ref={group}>
        {lines.map((line, index) => (
          <group>
            <QuadraticBezierLine key={index} {...line} color="white" dashed dashScale={50} gapSize={20} />
            <QuadraticBezierLine key={index} {...line} color="white" lineWidth={0.5} transparent opacity={0.1} />
          </group>
        ))}
      </group>
      {children}
      {lines.map(({ start, end }, index) => (
        <group key={index} position-z={1}>
          <Circle position={start} />
          <Circle position={end} />
        </group>
      ))}
    </context.Provider>
  )
}

const colors = ['red', 'green', 'blue', 'yellow', 'white', 'grey', 'brown', 'violet', 'turquoise', 'black', 'orange', 'pink']

export const MicroTube = forwardRef(({ color = 'black', position, ...props }, ref) => {
  // Drag n drop, hover
  const [hovered, setHovered] = useState(false)

  return (
    <Square
      ref={ref}
      opacity={0.2}
      size={[0.25, 0.25]}
      color={hovered ? '#ff1050' : color}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      {...props}>
      <Text position={[0, 0, 1]} fontSize={0.2}>
        {color + i}
      </Text>
    </Square>
  )
})

export const Bundle = ({ color = 'black', microTubes = [], name, position = [0, 0, 0], ...props }) => {
  const set = useContext(context)
  const { size, camera } = useThree()
  const [pos, setPos] = useState(() => new THREE.Vector3(...position))

  // Drag n drop, hover
  const [hovered, setHovered] = useState(false)
  useEffect(() => void (document.body.style.cursor = hovered ? 'grab' : 'auto'), [hovered])
  const bindDragDrop = useDrag(({ down, xy: [x, y] }) => {
    document.body.style.cursor = down ? 'grabbing' : 'grab'
    setPos(new THREE.Vector3((x / size.width) * 2 - 1, -(y / size.height) * 2 + 1, 0).unproject(camera).multiply({ x: 1, y: 1, z: 0 }).clone())
  })
  debugger
  return (
    <Square
      {...bindDragDrop()}
      opacity={0.2}
      size={[2, microTubes.length * 0.4]}
      color={'grey'}
      position={pos}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      {...props}>
      <Square size={[2, 0.4]} position={[-1, -colors.length / 2, 1]} color={color} />
      <Text position={[0, 1, 1]} fontSize={0.3}>
        {name}
      </Text>
      {microTubes.map((t, i) => (
        <MicroTube ref={t} color={colors[i]} position={[0, i * 0.4, 1]} />
      ))}
    </Square>
  )
}
