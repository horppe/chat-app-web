var client = io('/chat');
           console.log("Hey")
client.on('connect', function(){
    console.log("Connected")
    sendAuthToken()
})
client.on('disconnect', function(socket){
    console.log("I am disconnected to the socket")
    
})

function sendAuthToken(){
    var token = localStorage.getItem('chatapp:token');
    if(token !== null){
        
      client.emit('auth', {token: token} )
    }
 
     client.on('authenticated', function(data){
         console.log("Request Authenticated")
         console.log(data, "Data")
        
     })
     client.on('unauthorized', function(){
         //alert('Socket Unauthozied')
         console.log('Socket Unauthozied')
         window.location = '/login';
     })
   
}