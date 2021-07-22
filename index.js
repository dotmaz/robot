const express = require('express');
const socketio = require('socket.io');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyparser = require('body-parser');
const fs = require('fs');
const saltRounds = 10;
var app = express();
app.use(cors())
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
var server = app.listen(3000);
var io = socketio(server);
io.on('connection', on_connection);


const secret_msg = "buttered toast";

function read_db(url){
    let res;
    try{
        res = JSON.parse(fs.readFileSync(url));
    }catch(e){
        return false;
    }
    return res;
}
function write_db(url, new_db){
    try{
        fs.writeFileSync(url, JSON.stringify(new_db));
    }catch(e){
        return false;
    }
    return true;
}

const DATA = {
    USER_AUTH: 'data/user_authentication.json'
}

console.log(read_db(DATA['USER_AUTH']))

function on_connection(socket){
    console.log("User connected: " + socket.id);

    socket.on('submit-register', async payload=>{
        console.log("* submit-register *");
        console.log(payload);
        let modified_user_data = read_db(DATA['USER_AUTH']);
        if(!modified_user_data[payload.username]){
            let hash = await bcrypt.hash(payload.password, 10);
            modified_user_data[payload.username] = 
            {
                username: payload.username,
                hash: hash,
                session_token: "",
                session_token_time: 0
            }
            write_db(DATA['USER_AUTH'], modified_user_data);
            socket.emit("register-redirect");
        }else{
            socket.emit("register-failed", "An account with this username already exists.");
        }
    });

    socket.on('submit-login', async payload=>{
        console.log("* submit-login *");
        console.log(payload);
        let user_data = read_db(DATA['USER_AUTH']);
        if(user_data[payload.username]){
            let is_authenticated = await bcrypt.compare(payload.password, user_data[payload.username].hash);
            if(is_authenticated){
                console.log("user authenticated")
                let session_token = await bcrypt.hash(payload.password, 10);
                user_data[payload.username].session_token = session_token;
                user_data[payload.username].session_token_time = Date.now();
                socket.emit("login-authenticated", payload.username + " " + session_token);
            }else{
                socket.emit("login-failed", "Invalid credentials.");
            }
            return;
        }
        socket.emit("login-failed", "An account with this username does not exist.");
    });

    socket.on('request-payload', token=>{
        let user_data = read_db(DATA['USER_AUTH']);
        if(user_data[token.split(' ')[0]]){
            console.log(user_data[token.split(' ')[0]].session_token)
            console.log(token.split(' ')[1])
            if(user_data[token.split(' ')[0]].session_token == token.split(' ')[1]){
                socket.emit("receive-payload", {
                    username: user_data[token.split(' ')[0]].username
                });
                return;
            }
        }
        socket.emit("unauthorized");
    });

}

app.get('/', function(req, res) {
    res.redirect('/login')
});

app.get('/register', function(req, res) {
    res.render('pages/register');
});

app.get('/login', function(req, res) {
    res.render('pages/login');
});

app.get('/app', function(req, res) {
    res.render('pages/app');
});
  

app.post('/message', (req, res)=>{
    let file = req.body.message;
});