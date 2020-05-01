
document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    socket.emit('checkin', {});    

    var app = new Vue({
        el: '#app',
        data: {
            devices: ['mobile','desktop'],
            chosenDevice: localStorage.getItem("device"),
            deviceId: parseInt(localStorage.getItem("deviceId")),
            gameState: "lobby",
            players: [],
            claimedPlayers: []
        },
        methods: {
            generateDeviceId: function() {
                let deviceId = Math.floor(Math.random()*100000000);
                return deviceId;
            },
            setDevice: function(device) {
                this.chosenDevice = device;
                localStorage.setItem("device", this.chosenDevice);

                this.deviceId = this.generateDeviceId();
                localStorage.setItem("deviceId",this.deviceId);
            },


            claimPlayer: function(name) {

                
                socket.emit('claimPlayer', {
                    name,
                    device: this.chosenDevice,
                    id: this.deviceId
                });
            },
            canBeClaimed: function (player) {
                let canBeClaimed = true;
                
                if(player[this.chosenDevice]) canBeClaimed = false;
                if(this.chosenDevice === "mobile" && this.claimedPlayers.length > 0) canBeClaimed = false;
                return canBeClaimed;
            },
            unclaimPlayer: function(name) {
                
                socket.emit('unclaimPlayer', {
                    name,
                    device: this.chosenDevice,
                    id: this.deviceId
                });
            }
        },

    });
    socket.on('game', data => {
        console.log(data);
        app.gameState = data.gameState;
        app.players = data.players;
        app.claimedPlayers = [];
        for (const player of data.players) {
            if(player[app.chosenDevice] === app.deviceId) {
                app.claimedPlayers.push(player.name);
            } 
        }
    })
});

