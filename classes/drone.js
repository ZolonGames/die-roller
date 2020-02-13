module.exports = class Drone {    
    // Constructor
    // Takes in an ID, and latitude and longitude coordinates.
    // Assigns the ID, then assigns the lat/long to both the current position and previous position.
    constructor(id, lat, long){
        this.id = id;
        
        this.currentPosition = {
            lat: lat,
            long: long,
            timeStamp: Date.now()
        };
        this.previousPosition = {
            lat: lat,
            long: long,
            timeStamp: Date.now()
        };
        this.lastMovedSeconds = Math.round(Date.now() / 1000);
        this.currentSpeed = 0;
        this.moving = true;
    }

    // Will calculate the speed based on the current and previous position.
    calculateSpeed() {
        var distance = this.getDistance();
        var timeDifference = new Date(this.currentPosition.timeStamp).getTime() - new Date(this.previousPosition.timeStamp).getTime();
        this.currentSpeed = (distance * 1000) / (timeDifference / 1000);
        if (distance * 1000 > 1)
        {
            this.lastMovedSeconds = Math.round(Date.now() / 1000);
            this.moving = true;
        }
        else
        {
            const currentSeconds = Math.round(Date.now() / 1000);
            const secondsSinceLastMove = currentSeconds - this.lastMovedSeconds;
            if (secondsSinceLastMove > 10)
            {
                
                this.moving = false;
            }
        }
    }
    // Gets the distance between two coordinates in KMs.
    getDistance() {
        var R = 6371; //Radius of Earth in KMs
        var dLat = this.degToRad(this.previousPosition.lat - this.currentPosition.lat);
        var dLong = this.degToRad(this.previousPosition.long - this.currentPosition.long)
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(this.degToRad(this.previousPosition.lat)) * Math.cos(this.degToRad(this.currentPosition.lat)) * 
                Math.sin(dLong/2) * Math.sin(dLong/2);
                
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Will update the current position, and set the previous position.
    updatePosition(lat, long) {
        this.previousPosition = this.currentPosition;
        this.currentPosition = {
            lat: lat,
            long: long,
            timeStamp: Date.now()
        }
        this.calculateSpeed();
    }

    // Helper function for calculations. 
    degToRad(deg) {
        return deg * (Math.PI/180)
      }
};