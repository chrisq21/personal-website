import React, { useState, useEffect } from "react"
import styled from "styled-components"
import SEO from "../components/seo"
import orchardImg from "../assets/orchard.jpg"

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: blue;
  overflow: hidden;
  position: relative;
  background: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)),
    url(${orchardImg});
  background-size: cover;
  background-position: bottom;
`

const MonthWrapper = styled.div`
  position: absolute;
  left: 0;
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

const PeachesPage = () => {
  const [activeIndex, setActiveIndex] = useState(2)
  useEffect(() => {
    document.onkeydown = e => {
      /* left = 37 | right = 39 */
      if (e.keyCode === 37) {
        setActiveIndex(_activeIndex => {
          if (_activeIndex === 0) {
            return monthMap.length - 1
          } else {
            return _activeIndex - 1
          }
        })
      }
      if (e.keyCode === 39) {
        setActiveIndex(_activeIndex => {
          if (_activeIndex === monthMap.length - 1) {
            return 0
          } else {
            return _activeIndex + 1
          }
        })
      }
    }
  }, [setActiveIndex])
  return (
    <div>
      <SEO title="Peaches" />
      <PageWrapper>
        <MonthWrapper activeIndex={activeIndex}>
          <MonthText></MonthText>
          {monthMap.map(({ month }, index) => (
            <MonthText key={index}>{month}</MonthText>
          ))}
        </MonthWrapper>
      </PageWrapper>
    </div>
  )
}

export default PeachesPage
