import { Application, Graphics } from 'pixi.js'
import { useEffect, useRef } from 'react'
import { Viewport } from 'pixi-viewport'

const NODE_R = 14

type Node = { x: number; y: number; id: string }

const SAMPLE_NODES: Node[] = [
  { id: 'a', x: 120, y: 180 },
  { id: 'b', x: 320, y: 120 },
  { id: 'c', x: 520, y: 220 },
  { id: 'd', x: 380, y: 380 },
  { id: 'e', x: 180, y: 420 },
]

const SAMPLE_EDGES: [string, string][] = [
  ['a', 'b'],
  ['b', 'c'],
  ['c', 'd'],
  ['d', 'e'],
  ['e', 'a'],
  ['a', 'd'],
]

function drawEdges(g: Graphics, nodes: Node[], edges: [string, string][]) {
  g.clear()
  const byId = new Map(nodes.map((n) => [n.id, n]))
  for (const [from, to] of edges) {
    const a = byId.get(from)
    const b = byId.get(to)
    if (!a || !b) continue
    g.moveTo(a.x, a.y)
      .lineTo(b.x, b.y)
      .stroke({ width: 2, color: 0x64748b, alpha: 0.55 })
  }
}

function drawNodeDisc(g: Graphics) {
  g.clear()
  g.circle(0, 0, NODE_R).fill({ color: 0x38bdf8 }).stroke({ width: 2, color: 0x0ea5e9 })
}

export function GraphCanvas() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let disposed = false
    let initialized = false
    let syncViewportToScreen: (() => void) | undefined
    const app = new Application()

    void (async () => {
      try {
        await app.init({
          resizeTo: host,
          backgroundColor: 0x0f172a,
          antialias: true,
          autoDensity: true,
          resolution: window.devicePixelRatio,
          preference: 'webgl',
        })
      } catch (e) {
        if (!disposed) console.error('Pixi init failed', e)
        try {
          app.destroy(true)
        } catch {
          /* ignore */
        }
        return
      }

      if (disposed) {
        app.destroy(true)
        return
      }

      initialized = true
      host.appendChild(app.canvas as HTMLCanvasElement)

      const viewport = new Viewport({
        events: app.renderer.events,
        screenWidth: app.screen.width,
        screenHeight: app.screen.height,
        worldWidth: 1600,
        worldHeight: 1200,
      })
      viewport.drag().wheel({ smooth: 3 }).decelerate()

      const edgesG = new Graphics()
      drawEdges(edgesG, SAMPLE_NODES, SAMPLE_EDGES)
      viewport.addChild(edgesG)

      for (const n of SAMPLE_NODES) {
        const g = new Graphics()
        g.position.set(n.x, n.y)
        drawNodeDisc(g)
        viewport.addChild(g)
      }

      app.stage.addChild(viewport)

      let lastW = 0
      let lastH = 0
      syncViewportToScreen = () => {
        const w = app.screen.width
        const h = app.screen.height
        if (w !== lastW || h !== lastH) {
          lastW = w
          lastH = h
          viewport.resize(w, h)
        }
      }
      app.ticker.add(syncViewportToScreen)
    })()

    return () => {
      disposed = true
      if (initialized) {
        if (syncViewportToScreen) app.ticker.remove(syncViewportToScreen)
        const canvas = app.canvas as HTMLCanvasElement
        if (canvas && host.contains(canvas)) host.removeChild(canvas)
        app.destroy(true)
      }
    }
  }, [])

  return (
    <div
      ref={hostRef}
      style={{
        width: '100%',
        height: 'min(72vh, 720px)',
        minHeight: 360,
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid var(--border, #2e303a)',
      }}
    />
  )
}
