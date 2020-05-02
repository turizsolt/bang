
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
            rolls: [0, 1, 2],
            remainingRolls: 3,
            maxRolls: 3,
            usedRolls: 0,
            isFixed: [],
            isUsed: [],
            using: -1,
            currentPlayer: -1,
            currentPlayerName: "",
            dieOrder: [],
            currentOrder: -1,
            targetablePlayers: [],
            startable: false,
            shaking: false

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
                this.shaking = true;
                setTimeout(() => {
                    socket.emit('roll', {});
                    this.shaking = false;
                }, 500);
            },
            resetDice: function() {
                socket.emit('reset', {                    
                });
            },
            fixDie: function(dieId) {
                if(this.remainingRolls > 0) {
                    // fix and unfix
                    console.log("im clicked");
                    socket.emit('fix', {
                        dieId,
                    });
                } else {
                    // use
                    console.log('use', dieId, this.using);
                    if(dieId !== this.using) {
                        console.log('use1');
                        socket.emit('selectToUseDie', { dieId });
                    } else {
                        console.log('use2');
                        socket.emit('unselectToUseDie', { dieId });
                    }
                }
            },
            chooseTarget: function(playerId) {
                socket.emit('chooseTarget', {playerId});
            },
            finish: function() {
                socket.emit('finish', {                 
                });
            },
            startTurn: function() {socket.emit('startTurn', {                 
                });
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
        app.rolls = rolly(data.dice.maxRolls);
        app.maxRolls = data.dice.maxRolls;
        app.usedRolls = app.maxRolls - data.dice.remainingRolls;
        app.isFixed = data.dice.isFixed;
        app.isUsed = data.dice.isUsed;
        app.scores = data.scoreStore;
        app.currentPlayer = data.scoreStore.current;
        app.currentPlayerName = data.scoreStore.current > -1 ? data.scoreStore.players[data.scoreStore.current].player.name : '';
        app.using = data.dice.using;
        app.dieOrder = data.dice.dieOrder;
        app.currentOrder = data.dice.currentOrder;
        app.targetablePlayers = data.dice.targetablePlayers;
        app.startable = data.dice.startable;
    })
});

function rolly(n) {
    const arr = [];
    for(let i=0;i<n;i++) {
        arr.push(i);
    }
    return arr;
}
