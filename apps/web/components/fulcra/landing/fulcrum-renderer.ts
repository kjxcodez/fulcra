/**
 * Canvas renderer for Fulcra 3D balance beam and fulcrum base.
 */
export function drawFulcrumScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rotX: number,
  rotY: number
) {
  const centerX = w / 2 + rotY * 30
  const centerY = h / 2 + 18 + rotX * 20

  // 1. Triangular Fulcrum Base
  const triWidth = 140
  const triHeight = 85
  const apexX = centerX
  const apexY = centerY - 15
  const baseLeftX = centerX - triWidth / 2
  const baseRightX = centerX + triWidth / 2
  const baseY = apexY + triHeight

  // Fulcrum contact shadow
  const gradShadow = ctx.createRadialGradient(
    centerX,
    baseY + 5,
    10,
    centerX,
    baseY + 5,
    110
  )
  gradShadow.addColorStop(0, "rgba(20, 22, 31, 0.22)")
  gradShadow.addColorStop(1, "rgba(20, 22, 31, 0)")
  ctx.fillStyle = gradShadow
  ctx.beginPath()
  ctx.ellipse(centerX, baseY + 6, 110, 14, 0, 0, Math.PI * 2)
  ctx.fill()

  // Fulcrum triangular body (Dark Ink with bevel gradient)
  const gradTri = ctx.createLinearGradient(baseLeftX, apexY, baseRightX, baseY)
  gradTri.addColorStop(0, "#1c1f2b")
  gradTri.addColorStop(0.5, "#14161f")
  gradTri.addColorStop(1, "#0d0e14")

  ctx.fillStyle = gradTri
  ctx.beginPath()
  ctx.moveTo(apexX, apexY)
  ctx.lineTo(baseRightX, baseY)
  ctx.lineTo(baseLeftX, baseY)
  ctx.closePath()
  ctx.fill()

  // Fulcrum bevel edge highlight
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)"
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(baseLeftX, baseY)
  ctx.lineTo(apexX, apexY)
  ctx.lineTo(baseRightX, baseY)
  ctx.stroke()

  // 2. Balanced Beam
  const beamLength = 220
  const beamAngle = -0.06 + rotY * 0.05
  ctx.save()
  ctx.translate(apexX, apexY)
  ctx.rotate(beamAngle)

  // Beam cylinder
  const beamGrad = ctx.createLinearGradient(0, -4, 0, 4)
  beamGrad.addColorStop(0, "#3a3d4a")
  beamGrad.addColorStop(0.5, "#252733")
  beamGrad.addColorStop(1, "#14161f")

  ctx.fillStyle = beamGrad
  ctx.beginPath()
  ctx.roundRect(-beamLength / 2, -3.5, beamLength, 7, 3)
  ctx.fill()

  // Pivot cap at center
  ctx.fillStyle = "#4a4d5c"
  ctx.beginPath()
  ctx.arc(0, 0, 5, 0, Math.PI * 2)
  ctx.fill()

  // 3. Left Sphere — Candidate Evidence (Brass)
  const leftSphereX = -beamLength / 2 + 10
  const leftSphereY = 0
  const radius = 17

  const brassGrad = ctx.createRadialGradient(
    leftSphereX - 5,
    leftSphereY - 5,
    2,
    leftSphereX,
    leftSphereY,
    radius
  )
  brassGrad.addColorStop(0, "#f5e4b8")
  brassGrad.addColorStop(0.3, "#c9a44c")
  brassGrad.addColorStop(0.8, "#8c6e2e")
  brassGrad.addColorStop(1, "#523f16")

  ctx.fillStyle = brassGrad
  ctx.beginPath()
  ctx.arc(leftSphereX, leftSphereY, radius, 0, Math.PI * 2)
  ctx.fill()

  // 4. Right Sphere — Role Requirements (Indigo)
  const rightSphereX = beamLength / 2 - 10
  const rightSphereY = 0

  const indigoGrad = ctx.createRadialGradient(
    rightSphereX - 5,
    rightSphereY - 5,
    2,
    rightSphereX,
    rightSphereY,
    radius
  )
  indigoGrad.addColorStop(0, "#8a9ef7")
  indigoGrad.addColorStop(0.3, "#3552e0")
  indigoGrad.addColorStop(0.8, "#2540b8")
  indigoGrad.addColorStop(1, "#162261")

  ctx.fillStyle = indigoGrad
  ctx.beginPath()
  ctx.arc(rightSphereX, rightSphereY, radius, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}
