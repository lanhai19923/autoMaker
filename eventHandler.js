var eventHandler = function (host) {
	this.eventList = {};
	this.eventRely = {};
	this.host = host;
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
	return this;//to support chain method
};
eventHandler.prototype.rely = function (eventName, relyEventList) {
	if (this.eventRely[eventName] == undefined) {
		this.eventRely[eventName] = [];
	} 
	for (var i = 0; i < relyEventList.length; i++) {
		if (this.eventRely[eventName].indexOf(relyEventList[i]) == -1) {
			this.eventRely[eventName].push(relyEventList[i]);
		}
	}
};
eventHandler.prototype.off = function (eventName, handler) {
	if (typeof eventName != 'string') {
		console.log("eventName must be a string!");
		return false;
	}
	if (handler == undefined) {
		//remove all handlers
		this.eventList[eventName] = [];
		return this;//to support chain method
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
	if (!this.eventList[eventName]) {
		console.log(eventName + " is not defined");
		return;
	}
	for (var i = 0; i < this.eventList[eventName].length; i++) {
		var handler = this.eventList[eventName][i];
		if (!!this.host) {
			handler.call(this.host);
		} else {
			handler();
		}
	}
	this.checkRely(eventName);
};
eventHandler.prototype.checkRely = function (eventName) {
	for (var relyEvent in this.eventRely) {
		for (var i = 0; i < this.eventRely[relyEvent].length; i++) {
			if (this.eventRely[relyEvent][i] == eventName) {
				this.eventRely[relyEvent].splice(i,1);
				break;
			}
		}
	}
	for (var relyEvent in this.eventRely) {
		if (this.eventRely[relyEvent].length == 0) {
			var relyEventName = relyEvent;
			delete this.eventRely[relyEvent];
			this.emit(relyEventName);
		}
	}
};
exports.eventHandler = eventHandler;