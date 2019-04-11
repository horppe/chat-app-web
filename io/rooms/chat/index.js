import Account from "../../../models/account";


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
                } else {
                    socket.emit('unauthorized', {user: user});
                }
            })
            
        })
        
         
       
    })
}


function disconnectSocket(socket){
    return function(){
        console.log("Disconnecting socket...");
        socket.disconnect();
    }
    
}

function getUserDetails(token, fn){
    Account.findOne({token: token}).then(function(user){
        if(user !== null) 
            fn(user)
        else
            fn(null)
       
    })
}