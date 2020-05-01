document.addEventListener("DOMContentLoaded", () => {

const socket = io();
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
    }
})

socket.on('game', data => {
    console.log(data);
    app.gameState = data.gameState;
    app.players = data.players.map(x => ({ name: x}));
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
