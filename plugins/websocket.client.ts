export default defineNuxtPlugin(() => {
  if (process.server) return;

  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  // let socket = new WebSocket(`${wsProtocol}//${window.location.host}`);
  let socket = new WebSocket(`${wsProtocol}//localhost:1547`);

  return { provide: { socket } };
});