console.log("Welcome to Robot! :]")
let socket;

(function(){
    socket = io();
    let session_token = window.localStorage.getItem('token');
    if(session_token){
        socket.emit("request-payload", session_token);
    }else{
        window.location.href = "/";
    }
    
    socket.on("receive-payload", payload=>{
        document.body.innerHTML = document.body.innerHTML.replace("%username%", payload.username);
    });
    socket.on("unauthorized", ()=>{
        console.log('WRONGNGNGNGNGNNG')
        window.location.href = "/";
    });
    
})();