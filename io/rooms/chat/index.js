import Account from "../../../models/account";
import jwt from 'jsonwebtoken';
import Config from '../../../config/config';
import Conversation from "../../../models/conversation";
import Message from "../../../models/message";


export default (io) => {
    io.on('connection', function(socket){
        console.log('Welcome to the Chat Room, Socket ID: ' + socket.id)
        
        var timeout =  setTimeout(disconnectSocket(socket), 5000);
        console.log("Hey")

        socket.on('auth', function(data){
            clearTimeout(timeout);
            getUserDetails(data.token,function(user){
                if(user){
                    socket.emit('authenticated', {user: user});
                    // Update user's Sockets array to enable real time message delivery
                   addSocketToUserInDb(user, socket)

                   setUpChat(socket, user)

                } else {
                    socket.emit('unauthorized');
                }
            })
            
        })
        
         
       
    })
}


function disconnectSocket(socket, user){
    return function(){
        console.log("Disconnecting socket...");
        if(user){
            console.log("User", user);
            // Remove the current socketId from user Array and if array.length is equal to 0, set user.online = false;
            user.sockets = user.sockets.filter(id => id !== socket.id);
            if(user.sockets.length == 0){
                user.online = false;
            }

            user.save().then(function(err, usr, noOfRows){
                console.log("SocketId successfully removed from user socket array,", user);
                socket.disconnect();
                console.log("Socket Disconnected");
            })
        
        }
        else{
            console.log("No user in disconnect :(");
            socket.disconnect();
        }
        
    }
    
}

function getUserDetails(token, fn){
    let decoded = jwt.verify(token, Config.JWT_SECRET);
    console.log(decoded, "Decoded jwt");
    Account.findOne({_id: decoded.id}).then(function(user){
        if(user !== null) 
            fn(user)
        else
            fn(null)
       
    })
}

function setUpChat(socket, user){
    socket.on('message', function(message){
        let to = message.to;
            // If conversation already exist, just add message_id to conversation messsages array
            if(message.conversationId){
               createNewMessage(message, user, function(newMessage){
                    Conversation.findById(message.conversationId)
                    .then((conversation) => {
                        conversation.messages.push(message._id);
                        conversation.save().then(() => {
                            console.log("A message is saved");
                            // TODO implement updating/emitting the parties of the new message event

                        })
                    })
               })
               
            } else { // Create a new Conversaton
                // Find reciever account
                Account.findById(to).then(recipient => {
                    //Create a new message model object
                   createNewMessage(message, user, function(newMessage){
                       // Create a new Conversation model object
                        var newConversation = new Conversation({
                            parties: [user._id, recipient._id ],
                            messages: [newMessage._id],
                        })

                        // Save new conversation
                        newConversation.save().then(function(savedConversation){

                            // Update 'User' and 'Recipient' conversations property
                            user.conversations.push(savedConversation._id);
                            recipient.conversations.push(savedConversation._id);
                            Promise.all([user.save(), recipient.save()]).then(function(usr, rcp){
                                console.log("User and Recipient conversation objects updated", usr, rcp);
                            })
                        })
                   })
                })
            }
        })
}

function addSocketToUserInDb(user, socket){
    user.sockets.push(socket.id);
    user.online = true;
    user.save().then(function(err, usr, noOfRows){
        console.log("Socket added to user sockets array", user);
       socket.on('disconnect', disconnectSocket(socket, user))
    });
}

function createNewMessage(message, user, fn){
    let newMessage = new Message({
        sender: user._id,
        to: message.to,
        conversationId: message.conversationId,
        body: message.body
    });
    newMessage.save.then(function(mess){
        fn(mess);
    })
}