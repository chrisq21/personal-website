import React, { useLayoutEffect, useRef } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import styled from "styled-components"

const AudioButton = styled.button`
  color: black;
  border-radius: 5px;
`

const canvasDimensions = { width: 1000, height: 1000 }
const AudioPage = () => {
  const oscillator = useRef(null)
  const audioContext = useRef(null)
  const analyser = useRef(null)
  const myCanvas = useRef(null)
  const dataArray = useRef(null)
  const bufferLength = useRef(null)

  const setupAudio = () => {
    // create context
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)()
    // create analyser
    analyser.current = audioContext.current.createAnalyser()
    bufferLength.current = analyser.current.frequencyBinCount
    dataArray.current = new Uint8Array(bufferLength.current)
    // create oscillator
    oscillator.current = audioContext.current.createOscillator()
  }

  const setupAnalyser = () => {
    oscillator.current.start(audioContext.current.currentTime)

    oscillator.current.connect(analyser.current)
    analyser.current.connect(audioContext.current.destination)

    const canvasContext = myCanvas.current.getContext("2d")
    canvasContext.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height)
    draw()
  }

  const draw = () => {
    requestAnimationFrame(draw)
    const canvasContext = myCanvas.current.getContext("2d")

    // update dataArray
    analyser.current.getByteFrequencyData(dataArray.current)

    // clear canvas
    canvasContext.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height)

    const scalar = 40
    const barWidth = (canvasDimensions.width / bufferLength.current) * scalar
    let barHeight
    let x = 0

    for (let i = 0; i < bufferLength.current; i++) {
      barHeight = (canvasDimensions.height - canvasDimensions.height / 4) * (dataArray.current[i] / 255)

      canvasContext.fillStyle = `rgb(${barHeight},${400 - barHeight}, 0)`
      canvasContext.fillRect(x, canvasDimensions.height - barHeight, barWidth, barHeight)
      x += barWidth
    }
  }

  useLayoutEffect(() => {
    setupAudio()
  }, [])

  const stopSound = () => oscillator.current.stop()
  const changeSound = e => oscillator.current.frequency.setValueAtTime(e.target.value, audioContext.current.currentTime)

  return (
    <Layout>
      <SEO title="Audio" />
      <h1>Audio</h1>
      <AudioButton onClick={setupAnalyser}>Start</AudioButton>
      <AudioButton onClick={stopSound}>Stop</AudioButton>
      <input type="range" min={100} max={500} defaultValue={300} onChange={changeSound} />
      <canvas
        style={{ border: "1px solid red" }}
        ref={myCanvas}
        height={canvasDimensions.height}
        width={canvasDimensions.width}
      ></canvas>
    </Layout>
  )
}

export default AudioPage
