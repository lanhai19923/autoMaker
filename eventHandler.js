var eventHandler = function () {
    this.eventList = {};
};
eventHandler.prototype.on = function (eventName, handler) {
    if (typeof eventName != 'string') {
        console.log("eventName must be a string!");
        return false;
    }
    if (typeof handler != 'function') {
        console.log("event handler must be a function!");
        return false;
    }
    if (!(eventName in this.eventList)) {
        this.eventList[eventName] = [];
    }
    this.eventList[eventName].push(handler);
};
eventHandler.prototype.off = function (eventName, handler) {
    if (typeof eventName != 'string') {
        console.log("eventName must be a string!");
        return false;
    }
    if (handler == undefined) {
        //remove all handlers
        this.eventList[eventName] = [];
    } else {
        if (typeof handler != 'function') {
            console.log("event handler must be a function!");
            return false;
        }
        if (this.eventList[eventName] == undefined) {
            console.log("this event has not been registered!");
        } else {
            for (var i = 0; i < this.eventList[eventName].length; i++) {
                if (this.eventList[eventName][i] === handler) {
                    this.eventList[eventName].splice(i,1);
                    i--;
                }
            }
        }
    }
};
eventHandler.prototype.emit = function (eventName) {
    if (typeof eventName != 'string') {
        console.log("eventName must be a string!");
        return false;
    }
    for (var i = 0; i < this.eventList[eventName].length; i++) {
        var handler = this.eventList[eventName][i];
        handler();
    }
};
exports.eventHandler = eventHandler;