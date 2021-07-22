console.log("Welcome to Robot! :]")
let socket;

(function(){
    socket = io();
    socket.on("register-redirect", ()=>{
        window.location.href = "/";
    });
    socket.on("login-authenticated", token=>{
        window.localStorage.setItem('token', token);
        window.location.href = "/app";
    });
    socket.on("login-failed", reason=>{
        alert(reason);
    });
    socket.on("register-failed", reason=>{
        alert(reason);
    });
})();

function submitRegister(){
    let payload = 
    {
        username: document.querySelector('.form-register input[type=text]').value,
        password: document.querySelector('.form-register input[type=password]').value
    }
    socket.emit('submit-register', payload);
}

function submitLogin(){
    let payload = 
    {
        username: document.querySelector('.form-login input[type=text]').value,
        password: document.querySelector('.form-login input[type=password]').value
    }
    socket.emit('submit-login', payload);
}