import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (userId) => {
    const backendWsUrl = import.meta.env.VITE_BACKEND_WS_URL;
    socket = io(backendWsUrl, {
        query: { userId },
        withCredentials: true
    });
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
