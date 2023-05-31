function addElement(element) {
  var dB = 0;
  var mono = false;
  var audioCtx = new AudioContext();
  var gainNode = audioCtx.createGain();
  gainNode.channelInterpretation = "speakers";

  function connectOutput(element) {
    audioCtx.createMediaElementSource(element).connect(gainNode);
    gainNode.connect(audioCtx.destination);
  }

  connectOutput(element);

  function setVolume(dB) {
    gainNode.gain.value = Math.pow(10, dB / 20);
  }

  function enableMono() {
    mono = true;
    gainNode.channelCountMode = "explicit";
    gainNode.channelCount = 1;
  }

  function disableMono() {
    mono = false;
    gainNode.channelCountMode = "max";
    gainNode.channelCount = 2;
  }
  browser.runtime.onMessage.addListener((message) => {
    switch (message.command) {
      case "setVolume":
        dB = message.dB;
        setVolume(dB);
        break;
      case "getVolume":
        return Promise.resolve({ response: dB });
        break;
      case "setMono":
        if (message.mono) {
          enableMono();
        } else {
          disableMono();
        }
        break;
      case "getMono":
        return Promise.resolve({ response: mono });
        break;
    }
  });
}

document.arrive("audio, video", function (newElem) {
  addElement(newElem);
});
