const socket = io();
console.log('Socket.io client connected');

const map = L.map("map").setView([0,0], 2); // Start with wider zoom
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap",
}).addTo(map);

const markers = {};
let centerOnce = false; // Only center on your location once

if(navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit("sendLocation", {latitude, longitude});
        
        // Center map only on first location update
        if(!centerOnce) {
            map.setView([latitude, longitude], 16);
            centerOnce = true;
        }
    }, (error) => {
        console.error('Error getting location:', error);
    }, 
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}

socket.on("Location-recived", (data) => {
    const {id, latitude, longitude} = data;
    
    console.log('Received location:', id, latitude, longitude); // Debug log
    
    if(latitude === null || longitude === null) {
        if(markers[id]) {
            map.removeLayer(markers[id]);
            delete markers[id];
        }
        return;
    }
    
    if(markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Add marker with a label to distinguish users
        markers[id] = L.marker([latitude, longitude])
            .bindPopup(`User: ${id.substring(0, 5)}`)
            .addTo(map);
    }
    
    console.log('Total markers:', Object.keys(markers).length); // Debug log
});

socket.on("user-disconnected", (id) => {
    console.log('User disconnected:', id); // Debug log
    if(markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

socket.on("disconnect", () => {
    console.log('Socket disconnected');
});