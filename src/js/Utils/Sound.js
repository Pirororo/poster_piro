import * as Tone from "tone";


const SYNTH = {

  btnSound() {
    const synth = new Tone.AMSynth().toMaster();
    synth.triggerAttackRelease("A8", "56n");
  },

  categoryIn() {
    const polysynth = new Tone.PolySynth().toMaster();
    let level = 'E8'
    // polysynth.triggerAttackRelease(level, "56n", 0.2);
    // polysynth.triggerAttackRelease(level, "56n", 0.4);
    // polysynth.triggerAttackRelease(level, "56n", 0.6);
    // polysynth.triggerAttackRelease(level, "56n", 0.8);
    // polysynth.triggerAttackRelease(level, "56n", 1);
    // console.log('polysynth');

  }
}

export {
  SYNTH
}
