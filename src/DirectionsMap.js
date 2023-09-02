import React, { useState, useEffect } from "react";
import { GoogleMap, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

const DirectionsMap = ({ origin, destination }) => {
  const [directions, setDirections] = useState(null);
  const [routeColor, setRouteColor] = useState("green"); // Default color

  useEffect(() => {
    if (origin && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: "DRIVING",
        },
        (response, status) => {
          if (status === "OK") {
            const distanceInKm = response.routes[0].legs[0].distance.value / 1000;

            if (distanceInKm > 10) {
              setRouteColor("red");
            } else {
              setRouteColor("green");
            }

            setDirections(response);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  }, [origin, destination]);

  return (
    <div className="mapOptions">
      <GoogleMap
        center={origin}
        zoom={500}
        mapContainerStyle={{ width: "100%", height: "100%" }}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: routeColor,
              },
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default DirectionsMap;