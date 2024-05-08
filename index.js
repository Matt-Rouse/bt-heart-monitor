const appUI = document.querySelector(".ui");
const bpmTxt = document.querySelector(".bpm");
const stopBTN = document.querySelector(".stop");
const heartUI = document.querySelector(".heart");
const startBTN = document.querySelector(".start");
const errorTxt = document.querySelector(".error");
const beatAudio = document.querySelector("audio");
const connectBTN = document.querySelector(".connect");
const connectUI = document.querySelector(".connect-ui");

var RXTX_SERVICE = 0xdfb0;
var RXTX_CHARACTERISTIC = 0xdfb1;

let device;
let heartRate;

function parseHeartRate(value) {
  let is16Bits = value.getUint8(0) & 0x1;
  if (is16Bits) return value.getUint16(1, true);
  return value.getUint8(1);
}

function handleRateChange(event) {
  bpmTxt.textContent = parseHeartRate(event.target.value);
}

async function requestDevice() {
  //only works for devices advertising heart rate service
  // const _options = { filters: [{ services: ["heart_rate"] }] };

  const options = {
    filters: [{
      name: 'Bluno'
    }],
    // optionalServices: ["heart_rate"],
  };
  device = await navigator.bluetooth.requestDevice({optionalServices: ["0000dfb0-0000-1000-8000-00805f9b34fb"], acceptAllDevices: true});
  device.addEventListener("gattserverdisconnected", connectDevice);
}

async function connectDevice() {
  if (device.gatt.connected) return;

  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(RXTX_SERVICE);

  heartRate = await service.getCharacteristic(RXTX_CHARACTERISTIC);
  heartRate.addEventListener("characteristicvaluechanged", handleRateChange);
  console.log("connected");
}

async function startMonitoring() {
  beatAudio.play();
  await heartRate.startNotifications();
  heartUI.classList.remove("pause-animation");
}

async function stopMonitoring() {
  beatAudio.pause();
  await heartRate.stopNotifications();
  heartUI.classList.add("pause-animation");
}

async function init() {
  if (!navigator.bluetooth) return errorTxt.classList.remove("hide");
  if (!device) await requestDevice();

  connectBTN.textContent = "connecting...";
  await connectDevice();

  appUI.classList.remove("hide");
  connectUI.classList.add("hide");
  await startMonitoring();
}

connectBTN.addEventListener("click", init);
stopBTN.addEventListener("click", stopMonitoring);
startBTN.addEventListener("click", startMonitoring);
