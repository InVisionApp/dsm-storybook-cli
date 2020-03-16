export default function notifyDsm(message) {
  // window here is the manager windows
  window.parent.postMessage(message, '*');
}
