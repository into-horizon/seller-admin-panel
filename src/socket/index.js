import { io } from "socket.io-client";

export const socket = io(process.env.REACT_APP_API);

export const storeSocket = io(`${process.env.REACT_APP_API}/store`);
socket.on("connect", () => {
  storeSocket.on("connect", () => {
    console.log("connected to the server");
  });
});
