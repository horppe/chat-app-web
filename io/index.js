import socketio from 'socket.io';
import { registerRooms } from './rooms';

// TODO create and import socket room routes then give all the rooms the io object

export const registerSocketIO = (server) => {
    
/**
 *  Create the Scoket.io Server
 */

    const io = socketio(server);

    // io.on('connection', function(socket){
    // console.log('a user connected');
    // io.emit("message", {message: "Hello World"});
    // });
    
    registerRooms(io);
}