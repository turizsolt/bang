document.addEventListener("DOMContentLoaded", () => {

//const socket = io();
var app = new Vue({
    el: '#app',
    data: {
        players: [
            { name: 'Andi' }
        ]
    },
    methods: {
        startGame: function () {
            socket.emit('start', {

            });
        },
        endGame: function () {
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

socket.on('created', data => {
    console.log('created back', data);
    if (!getById(data.id))
      createPebble(
        data.id,
        rotX(data.x),
        rotY(data.y),
        data.w,
        data.h,
        data.backURL
      );
  });


})
