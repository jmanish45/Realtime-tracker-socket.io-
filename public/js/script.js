const socket = io();
console.log('Socket.io client connected');

const map = L.map("map").setView([0,0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap",
}).addTo(map);

let myMarker;

if(navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit("sendLocation", {latitude, longitude});
        // Show your location instantly
        map.setView([latitude, longitude], 16);
        if (!myMarker) {
            myMarker = L.marker([latitude, longitude]).addTo(map);
        } else {
            myMarker.setLatLng([latitude, longitude]);
        }
    }, (error) => {
        console.error('Error getting location:', error);
    }, 
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge : 0,
    });
}

// For other users' locations (if needed)
const markers = {};
socket.on("Location-recived", (data) => {
    const {id, latitude, longitude} = data;
    // Always update/add marker for every user (including yourself)
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});
socket.on("disconnect", () => {
    console.log('Socket disconnected');
    // Optionally remove the marker for this user
    if (myMarker) {
        map.removeLayer(myMarker);
        myMarker = null;
    }
});
  