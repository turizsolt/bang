document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    var app = new Vue({
        el: '#app',
        data: {
            devices: ['mobile','desktop'],
            chosenDevice: localStorage.getItem("device"),

        },
        methods: {
            setDevice: function(device) {
                this.chosenDevice = device;
                localStorage.setItem("device", this.chosenDevice);
            }
        }
    });
});