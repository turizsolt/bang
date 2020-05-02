document.addEventListener("DOMContentLoaded", () => {

const socket = io();
socket.emit('checkin', {});
var app = new Vue({
    el: '#app',
    data: {
        players: [
        
        ],
        gameState: "lobby",
        inputName: ""
    },
    methods: {
        startGame: function () {
            console.log('startgmae');
            socket.emit('startGame', {

            });
        },
        endGame: function () {
            console.log('endgmae');
            socket.emit('endGame', {

            });
        },
        addPlayer: function () {
            if (this.inputName.trim() !== "") {
                socket.emit('addPlayer', {
                    name: this.inputName
                });
                this.inputName = "";
            }
            
        },
        removePlayer: function (name) {
            socket.emit('removePlayer', {
                name
            });
        },
        kickPlayer: function (name) {
            socket.emit('kickPlayer', {
                name
            });
        },
        seven: function() {
            socket.emit('addPlayer', {name: "Alpha" });
            socket.emit('addPlayer', {name: "Bravo" });
            socket.emit('addPlayer', {name: "Charlie" });
            socket.emit('addPlayer', {name: "Delta" });
            socket.emit('addPlayer', {name: "Echo" });
            socket.emit('addPlayer', {name: "Foxtrot" });
            socket.emit('addPlayer', {name: "Golf" });
        }
    }
})

socket.on('game', data => {
    console.log(data);
    app.gameState = data.gameState;
    app.players = data.users; //.map(x => ({ name: x.name}));
})

// socket.on('created', data => {
//     console.log('created back', data);
//     if (!getById(data.id))
//       createPebble(
//         data.id,
//         rotX(data.x),
//         rotY(data.y),
//         data.w,
//         data.h,
//         data.backURL
//       );
//   });


});
