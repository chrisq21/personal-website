import Tone from "tone"

export default class Audio {
  constructor() {
    this.gridNotes = [
      "A6",
      "A5",
      "A4",
      "A3",
      "C6",
      "C5",
      "C4",
      "C3",
      "D6",
      "D5",
      "D4",
      "D3",
      "F6",
      "F5",
      "F4",
      "F3",
    ]

    this.synth = null
    this.reverb = null

    this.setupAudio()
  }

  async setupAudio() {
    // Resume audio context
    if (Tone.context.state !== "running") {
      Tone.context.resume()
    }

    // Reverb setup
    const reverb = new Tone.Reverb({
      decay: 4,
      wet: 0.5,
      preDelay: 0.2,
    }).toMaster()

    // Load reverb
    await reverb.generate()

    // Synth setup
    const synth = new Tone.Synth({
      envelope: {
        attack: 0.001,
        decay: 0.5,
        sustain: 0.001,
        release: 5,
      },
      oscillator: {
        type: "sine",
      },
      volume: -10,
    }).connect(reverb)

    this.reverb = reverb
    this.synth = synth
  }

  playNote(note) {
    if (this.synth) {
      if (Tone.context.state !== "running") {
        Tone.context.resume()
      }
      this.synth.triggerAttackRelease(
        note,
        "16n",
        this.synth.context.currentTime,
        1
      )
    }
  }
}
