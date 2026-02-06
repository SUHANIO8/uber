import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LiveTracking = ({ pickup, destination, ride }) => {
    const [route, setRoute] = useState([]);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [pickupCoords, setPickupCoords] = useState(null);
    const [destCoords, setDestCoords] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    setUserLocation([
                        position.coords.latitude,
                        position.coords.longitude
                    ]);
                },
                (err) => {
                    console.error('Geolocation error:', err);
                    setError('Unable to get your location');
                },
                { enableHighAccuracy: true }
            );
        }
    }, []);

    // Fetch route and distance when pickup and destination are available
    useEffect(() => {
        if (pickup && destination) {
            fetchRoute();
        }
    }, [pickup, destination]);

    const fetchRoute = async () => {
        setLoading(true);
        setError(null);

        try {
            // Get distance and route from backend
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`,
                {
                    params: {
                        origin: pickup,
                        destination: destination
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            const data = response.data;

            // Decode the route geometry (polyline format from OSRM)
            if (data.route) {
                const decodedRoute = decodePolyline(data.route);
                setRoute(decodedRoute);
                setPickupCoords([decodedRoute[0][0], decodedRoute[0][1]]);
                setDestCoords([
                    decodedRoute[decodedRoute.length - 1][0],
                    decodedRoute[decodedRoute.length - 1][1]
                ]);
            }

            setDistance(data.distance.text);
            setDuration(data.duration.text);
        } catch (err) {
            console.error('Error fetching route:', err);
            setError(err.response?.data?.message || 'Failed to fetch route');
        } finally {
            setLoading(false);
        }
    };

    // Decode polyline (GeoJSON format from OSRM)
    const decodePolyline = (geometry) => {
        if (!geometry) return [];
        if (typeof geometry === 'object' && geometry.coordinates) {
            // GeoJSON format
            return geometry.coordinates.map(coord => [coord[1], coord[0]]);
        }
        // Fallback if format is different
        return [];
    };

    // Set default center (user location or pickup)
    const mapCenter = userLocation || (pickupCoords ? [pickupCoords[0], pickupCoords[1]] : [18.52, 73.85]);

    return (
        <div className="w-full h-screen">
            {loading && (
                <div className="absolute top-4 left-4 bg-blue-500 text-white p-3 rounded z-10">
                    Loading route...
                </div>
            )}

            {error && (
                <div className="absolute top-4 left-4 bg-red-500 text-white p-3 rounded z-10">
                    {error}
                </div>
            )}

            {distance && duration && (
                <div className="absolute top-4 right-4 bg-white p-4 rounded shadow-lg z-10">
                    <p className="text-sm font-semibold">Distance: {distance}</p>
                    <p className="text-sm font-semibold">Duration: {duration}</p>
                </div>
            )}

            <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* User Current Location */}
                {userLocation && (
                    <Marker position={userLocation}>
                        <Popup>Your Location</Popup>
                    </Marker>
                )}

                {/* Pickup Location */}
                {pickupCoords && (
                    <Marker position={[pickupCoords[0], pickupCoords[1]]}>
                        <Popup>Pickup: {pickup}</Popup>
                    </Marker>
                )}

                {/* Destination Location */}
                {destCoords && (
                    <Marker position={[destCoords[0], destCoords[1]]}>
                        <Popup>Destination: {destination}</Popup>
                    </Marker>
                )}

                {/* Route Line */}
                {route.length > 0 && (
                    <Polyline
                        positions={route}
                        color="blue"
                        weight={5}
                        opacity={0.7}
                        dashArray="5, 10"
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default LiveTracking;