document.addEventListener("DOMContentLoaded", () => {

const socket = io();
var app = new Vue({
    el: '#app',
    data: {
        players: [
            { name: 'Andi' }
        ],
        gameState: "lobby"
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
            
            socket.emit('newPlayer', {

            });
        },
        removePlayer: function () {
            socket.emit('removePlayer', {

            });
        },
    }
})

socket.on('game', data => {
    console.log(data);
    app.gameState = data;
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
