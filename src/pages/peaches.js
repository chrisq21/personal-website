import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import styled from "styled-components"
import SEO from "../components/seo"
import orchardImg from "../assets/orchard.jpg"
import peachImg from "../assets/peach.png"
import { Engine, Render, Bodies, World } from "matter-js"
import debounce from "lodash/debounce"

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: blue;
  overflow: hidden;
  position: relative;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url(${orchardImg});
  background-size: cover;
  background-position: bottom;
`

const MonthWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 50px;
  transition: left 1s ease;
  display: flex;
  overflow: hidden;
  padding: 4rem 0;

  left: ${({ activeIndex }) => `-${(activeIndex + 1) * 100}%`};
`

const MonthText = styled.div`
  display: block;
  width: 100vw;
  color: white;
  text-align: center;
  font-size: 4rem;
  font-weight: bold;
  font-family: cursive;
`

const CanvasWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  pointer-events: none;
`

const Description = styled.p`
  color: white;
  text-align: center;
  font-size: 1rem;
  margin: 0;
  font-family: monospace;

  img {
    height: 1rem;
    width: 1rem;
    margin-bottom: 0;
  }

  a {
    color: white;
    text-align: center;
    font-size: inherit;
    margin: 0;
    font-family: monospace;
  }
`

const monthMap = [
  { month: "March", caseCount: 4 },
  { month: "April", caseCount: 21 },
  { month: "May", caseCount: 19 },
  { month: "June", caseCount: 32 },
  { month: "July", caseCount: 92 },
  { month: "August", caseCount: 80 },
  { month: "September", caseCount: 45 },
  { month: "October", caseCount: 69 },
  { month: "November", caseCount: 80 },
  { month: "December", caseCount: 122 },
]

const addPeaches = debounce(
  (numPeaches, canvasWrapper, Bodies, World, physicsEngine) => {
    const width = canvasWrapper.current.offsetWidth
    const radius = 30
    let peaches = []
    let offset = radius * 2
    const count = numPeaches
    for (let i = 0; i < count; i++) {
      offset *= Math.random() > 0.5 ? 1 : -1

      const x = width / 2 + offset - 50
      const y = (i - count) * radius
      peaches.push(
        Bodies.circle(x, y, radius, {
          render: {
            sprite: {
              texture: peachImg,
              xScale: radius / 300,
              yScale: radius / 300,
            },
          },
        })
      )
    }
    World.clear(physicsEngine.current.world, true)
    World.add(physicsEngine.current.world, [...peaches])
  },
  1000,
  { trailing: true }
)

const PeachesPage = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const canvasWrapper = useRef(null)
  const physicsEngine = useRef(null)

  /* keypad listener */
  useEffect(() => {
    const increment = () => {
      setActiveIndex(_activeIndex => {
        if (_activeIndex === monthMap.length - 1) {
          return 0
        } else {
          return _activeIndex + 1
        }
      })
    }
    const decrement = () => {
      setActiveIndex(_activeIndex => {
        if (_activeIndex === 0) {
          return monthMap.length - 1
        } else {
          return _activeIndex - 1
        }
      })
    }
    document.onclick = () => {
      increment()
    }
    document.ontouchend = () => {
      increment()
    }
    document.onkeydown = e => {
      /* left = 37 | right = 39 */
      if (e.keyCode === 37) {
        decrement()
      }
      if (e.keyCode === 39) {
        increment()
      }
    }
    return () => {
      document.onclick = null
      document.ontouchend = null
      document.onkeydown = null
    }
  }, [setActiveIndex])

  /* Setup matter */
  useLayoutEffect(() => {
    const width = canvasWrapper.current.offsetWidth
    const height = canvasWrapper.current.offsetHeight
    physicsEngine.current = Engine.create()

    // create a renderer
    var renderer = Render.create({
      element: canvasWrapper.current,
      engine: physicsEngine.current,
      options: {
        wireframes: false,
        background: false,
        height,
        width,
      },
    })

    const bottom = Bodies.rectangle(width / 2, height, width - 10, 10, {
      isStatic: true,
      render: {
        opacity: 0,
        fillStyle: "red",
      },
    })

    const left = Bodies.rectangle(0, height / 2, 10, height, {
      isStatic: true,
      render: {
        opacity: 0,
        fillStyle: "red",
      },
    })

    const right = Bodies.rectangle(width, height / 2, 10, height, {
      isStatic: true,
      render: {
        opacity: 0,
        fillStyle: "red",
      },
    })

    const borders = [bottom, left, right]

    World.add(physicsEngine.current.world, [...borders])

    Engine.run(physicsEngine.current)

    // run the renderer
    Render.run(renderer)
  }, [])

  /* Update peaches */
  useEffect(() => {
    const numPeaches = monthMap[activeIndex]?.caseCount
    if (physicsEngine.current) {
      addPeaches(numPeaches, canvasWrapper, Bodies, World, physicsEngine)
    }
  }, [activeIndex])

  return (
    <div>
      <SEO title="Peaches" />
      <PageWrapper>
        <CanvasWrapper id="canvas-wrapper" ref={canvasWrapper} />

        <MonthWrapper activeIndex={activeIndex}>
          <MonthText></MonthText>
          {monthMap.map(({ month }, index) => (
            <MonthText key={index}>{month}</MonthText>
          ))}
        </MonthWrapper>
        <Description>
          <img src={peachImg} alt="peach" /> = 1k COVID-19 cases in Georgia. (
          <a href="https://www.nytimes.com/interactive/2020/us/georgia-coronavirus-cases.html">
            source
          </a>
          )
        </Description>
        <Description>tap the screen, or use arrow keys</Description>
      </PageWrapper>
    </div>
  )
}

export default PeachesPage
