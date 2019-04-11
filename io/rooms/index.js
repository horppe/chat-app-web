import ChatRoom from './chat';

export const registerRooms = (io) => {
    ChatRoom(io.of('/chat'))
} 