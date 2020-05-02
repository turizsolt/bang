
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
            scores: [],
            claimedPlayers: [],
            dice: [],
            remainingRolls: 3,
            isFixed: [],
            isUsed: [],
            //next: startingPlayerName

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
            },
            roll: function() {
                socket.emit('roll', {
                    
                });
            },
            resetDice: function() {
                socket.emit('reset', {                    
                });
            },
            fixDie: function(dieId) {
                console.log("im clicked");
                socket.emit('fix', {
                    dieId,
                });
            },
            finish: function() {
                socket.emit('finish', {                 
                });
            },
            nextPlayer: function() {

            }
        },
        computed: {
            startingPlayerName: function() {
                let arr = this.scores.players.filter(x => x.role === "seriff");                
                return arr[0].player.name;                
            },

        },
    

    });
    socket.on('game', data => {
        console.log(data);
        app.gameState = data.gameState;
        app.players = data.users;
        app.claimedPlayers = [];
        for (const player of data.users) {
            if(player[app.chosenDevice] === app.deviceId) {
                app.claimedPlayers.push(player.name);
            } 
        };
        app.dice = data.dice.dice;
        app.remainingRolls = data.dice.remainingRolls;
        app.isFixed = data.dice.isFixed;
        app.isUsed = data.dice.isUsed;
        app.scores = data.scoreStore;
    })
});

