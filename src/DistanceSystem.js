import React, { useState } from "react";
import { GoogleMap, DistanceMatrixService } from "@react-google-maps/api";
import DistanceForm from "./DistanceForm";
import RouteList from "./RouteList";

const DistanceSystem = () => {
  const [response, setResponse] = useState(null);//göster komutu
  const [travelMode, setTravelMode] = useState("DRIVING");//kullanılacak araç
  const [origin, setOrigin] = useState("");//başlangıç noktası
  const [destination, setDestination] = useState("");//varış noktası
  const [distance, setDistance] = useState(null);//mesafe
  const [originSuggestions, setOriginSuggestions] = useState([]); //başlangıç noktası önerileri
  const [destinationSuggestions, setDestinationSuggestions] = useState([]); //varış noktası önerileri
  const [routes, setRoutes] = useState([]); // mesafemiz

  const getSuggestions = (input, callback) => {
    const options = {
      componentRestrictions: { country: "tr" },
      fields: ["geometry", "name","address_components","formatted_address"],
      types: ["geocode"]
     };
    const service = new window.google.maps.places.AutocompleteService(options);
   
    service.getPlacePredictions({ input }, callback);
  };

  const handleOriginChange = (value) => {
    setOrigin(value);
    getSuggestions(value, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setOriginSuggestions(predictions);
      }
    });
  };

  const handleDestinationChange = (value) => {
    setDestination(value);
    getSuggestions(value, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setDestinationSuggestions(predictions);
      }
    });
  };

  const handleOriginSuggestionClick = (suggestion) => {
    setOrigin(suggestion.description);
    setOriginSuggestions([]);
  };

  const handleDestinationSuggestionClick = (suggestion) => {
    setDestination(suggestion.description);
    setDestinationSuggestions([]);
  };

  const calculateDistance = () => {
    if (!origin || !destination) {
      alert("Başlangıç ve varış noktalarını doldurun.");
      return;
    }
    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: travelMode,
      },
      (response, status) => {
        if (status === "OK") {
          const newDistance = response.rows[0].elements[0].distance.text;
          const newRoute = {
            origin: origin,
            destination: destination,
            distance: newDistance,
          };
          setRoutes((prevRoutes) => [...prevRoutes, newRoute]);
          setDistance(newDistance);
        } else {
          console.log("Distance calculation failed with status:", status);
        }
      }
    );
  };
  const handleMapClick = () => {
    setOriginSuggestions([]);
    setDestinationSuggestions([]);
  };
  const clearRoutes = () => {
    setRoutes([]);
  };

  return (
    <div className="map p-0" onClick={handleMapClick}>
      <DistanceForm
        origin={origin}
        originSuggestions={originSuggestions}
        destination={destination}
        destinationSuggestions={destinationSuggestions}
        onOriginChange={handleOriginChange}
        onDestinationChange={handleDestinationChange}
        onOriginSuggestionClick={handleOriginSuggestionClick}
        onDestinationSuggestionClick={handleDestinationSuggestionClick}
        calculateDistance={calculateDistance}
        clearRoutes={clearRoutes}
      />
      <RouteList routes={routes} />
    </div>
  );
};

export default DistanceSystem;