import * as Tone from "tone";


const SYNTH = {

  btnSound() {
    const synth = new Tone.Synth({
      oscillator: {
        modulationType: 'sine',
        modulationIndex: 3,
        harmonicity: 3.4
      },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.1,
        release: 0.9
      },

    }).toMaster();
    synth.triggerAttackRelease('A8', "56n");

  },

  categoryIn() {
    const polysynth = new Tone.Synth({
      oscillator: {
        type: "sine",
        modulationIndex: 3,
        harmonicity: 3.4
      },
      envelope: {
        attack: 0.3,
        decay: 0.005,
        sustain: 0.01,
        release: 0.1
      }
    }).toMaster();
    polysynth.triggerAttackRelease('D8', "32n");
    var vol = new Tone.Volume(-12);
    polysynth.chain(vol, Tone.Master);



  }
}

export {
  SYNTH
}
