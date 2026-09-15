"use client"

import * as React from "react"
import * as THREE from "three"

export function HeroFulcrumScene() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const w = container.clientWidth
    const h = container.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100)
    camera.position.set(0, 1.3, 7.2)
    camera.lookAt(0, 0.15, 0)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(w, h)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.65)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9)
    keyLight.position.set(4, 6, 5)
    scene.add(keyLight)

    const rimLight = new THREE.PointLight(0x3552e0, 0.75, 20)
    rimLight.position.set(-4, 2, -2)
    scene.add(rimLight)

    const warmLight = new THREE.PointLight(0xb08d3e, 0.45, 20)
    warmLight.position.set(3, -1, 3)
    scene.add(warmLight)

    const group = new THREE.Group()
    scene.add(group)

    // 1. Triangular Fulcrum Base
    const triShape = new THREE.Shape()
    triShape.moveTo(-1.15, -1.0)
    triShape.lineTo(1.15, -1.0)
    triShape.lineTo(0, 1.0)
    triShape.closePath()

    const triGeo = new THREE.ExtrudeGeometry(triShape, {
      depth: 0.95,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 2,
    })
    triGeo.translate(0, 0, -0.475)
    const triMat = new THREE.MeshStandardMaterial({
      color: 0x14161f,
      metalness: 0.28,
      roughness: 0.52,
    })
    const triMesh = new THREE.Mesh(triGeo, triMat)
    triMesh.position.y = -0.35
    group.add(triMesh)

    // 2. Balanced Beam & Weights
    const beamGroup = new THREE.Group()
    beamGroup.position.set(0, 0.66, 0)
    group.add(beamGroup)

    const beamGeo = new THREE.CylinderGeometry(0.045, 0.045, 3.5, 16)
    beamGeo.rotateZ(Math.PI / 2)
    const beamMat = new THREE.MeshStandardMaterial({
      color: 0x2b2e3a,
      metalness: 0.55,
      roughness: 0.3,
    })
    const beamMesh = new THREE.Mesh(beamGeo, beamMat)
    beamGroup.add(beamMesh)

    // Brass candidate sphere
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xb08d3e,
      metalness: 0.75,
      roughness: 0.28,
    })
    const brassSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 32, 32),
      brassMat
    )
    brassSphere.position.set(-1.65, 0, 0)
    beamGroup.add(brassSphere)

    // Indigo role sphere
    const indigoMat = new THREE.MeshStandardMaterial({
      color: 0x3552e0,
      metalness: 0.42,
      roughness: 0.22,
    })
    const indigoSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 32, 32),
      indigoMat
    )
    indigoSphere.position.set(1.65, 0, 0)
    beamGroup.add(indigoSphere)

    beamGroup.rotation.z = -0.06

    let targetRotY = 0
    let targetRotX = 0
    let animId: number

    const handleMouseMove = (e: MouseEvent) => {
      if (reduced) return
      const rect = container.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      const x = (cx / rect.width) * 2 - 1
      const y = (cy / rect.height) * 2 - 1
      targetRotY = x * 0.45
      targetRotX = -y * 0.16
    }

    const handleMouseLeave = () => {
      targetRotY = 0
      targetRotX = 0
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    const handleResize = () => {
      if (!container) return
      const curW = container.clientWidth
      const curH = container.clientHeight
      camera.aspect = curW / curH
      camera.updateProjectionMatrix()
      renderer.setSize(curW, curH)
    }
    window.addEventListener("resize", handleResize)

    const animate = (t: number) => {
      if (!reduced) {
        const idle = Math.sin((t || 0) / 1900) * 0.02
        group.rotation.y += (targetRotY + idle - group.rotation.y) * 0.06
        group.rotation.x += (targetRotX - group.rotation.x) * 0.06
      }
      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }

    if (reduced) {
      renderer.render(scene, camera)
    } else {
      animId = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("resize", handleResize)

      triGeo.dispose()
      triMat.dispose()
      beamGeo.dispose()
      beamMat.dispose()
      brassMat.dispose()
      indigoMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="relative h-60 w-full overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full touch-none" />
      {/* Contact blur shadow underneath */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3.5 left-1/2 h-6 w-56 -translate-x-1/2 blur-xs"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(20,22,31,0.18) 0%, rgba(20,22,31,0) 72%)",
        }}
      />
    </div>
  )
}
