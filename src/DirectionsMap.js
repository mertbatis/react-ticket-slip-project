import React, { useState, useEffect } from "react";
import { GoogleMap, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

const DirectionsMap = ({ routes ,distance, routeColor }) => {
  const [directionsData, setDirectionsData] = useState([]);

  useEffect(() => {
    // Her bir rota için DirectionsService kullanarak rota bilgilerini alın
    const fetchDirections = async () => {
      const directions = [];

      for (const route of routes) {
        const response = await getDirections(route.origin, route.destination);
        if (response.status === "OK") {
          directions.push({ ...response, color: getColorForRoute(route.distance) });
        }
      }

      setDirectionsData(directions);
    };

    fetchDirections();
  }, [routes]);

  const getDirections = (origin, destination) => {
    return new Promise((resolve) => {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: "DRIVING",
        },
        (response, status) => {
          resolve({ response, status });
        }
      );
    });
  };

  const getColorForRoute = (distance) => {
    const numericDistance = parseFloat(distance);
    return numericDistance > 15 ? "red" : "green";
  };

  return (
  <div className="mapOptions">
    <GoogleMap
      center={origin} // Haritayı bir başlangıç noktasına merkezleyebilirsiniz.
      zoom={10}
      mapContainerStyle={{ width: "100%", height: "100%" }}
    >
      {directionsData.map((directions, index) => (
        <DirectionsRenderer
          key={index}
          directions={directions.response}
          options={{
            polylineOptions: {
              strokeColor: directions.color, // Rota çizgisinin rengi
            },
          }}
        />
      ))}
    </GoogleMap>
    </div>
  );
};

export default DirectionsMap;
