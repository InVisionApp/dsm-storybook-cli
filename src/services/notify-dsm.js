export default function(message) {
  // window here is the manager windows
  window.parent.postMessage(message, '*');
}
