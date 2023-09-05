import React, { useState,useEffect } from "react";
import { GoogleMap, DistanceMatrixService } from "@react-google-maps/api";
import DistanceForm from "./DistanceForm";
import RouteList from "./RouteList";
import audio from "./sound/alert.mp3"


function countdown(routeId) {
  var startTime = new Date().getTime();
  var endTime = startTime + 20 * 60 * 1000;
  var interval;
  var sound = new Audio(audio);
  function updateTimer() {
    var currentTime = new Date().getTime();
    var remainingTime = endTime - currentTime;

    if (remainingTime <= 0) {
      clearInterval(interval);
      if (  document.getElementById(`countdown-${routeId}`) == null ){
        return;
      }
      else{
      sound.play();
      alert("Varış Zamanı Doldu!");
    }
    } else {
      if (  document.getElementById(`countdown-${routeId}`) == null ){
        return;
      }
      var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      var formattedTime = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
      document.getElementById(`countdown-${routeId}`).textContent = formattedTime;

      // Başlangıç saatini ve bitiş saatini yazdır
      var startTimeString = new Date(startTime).toLocaleTimeString();
      var endTimeString = new Date(endTime).toLocaleTimeString();
      document.getElementById(`time-info-${routeId}`).textContent = `${startTimeString} / ${endTimeString}`;
    }
  }

  interval = setInterval(updateTimer, 1000);
}
const DistanceSystem = () => {
  const [response, setResponse] = useState(null);//göster komutu
  const [travelMode, setTravelMode] = useState("DRIVING");//kullanılacak araç
  const [origin, setOrigin] = useState("");//başlangıç noktası
  const [destination, setDestination] = useState("");//varış noktası
  const [distance, setDistance] = useState(null);//mesafe
  const [destinationSuggestions, setDestinationSuggestions] = useState([]); //varış noktası önerileri
  const [routes, setRoutes] = useState([]); // mesafemiz
  const [directions, setDirections] = useState(null);
  const [originAddress, setOriginAddress] = useState(""); // Başlangıç adresini burada saklayacağız
  const getSuggestions = (input, callback) => {
    const options = {
      componentRestrictions: { country: "tr" },
      fields: ["geometry", "name","address_components","formatted_address"],
      types: ["geocode"]
     };
    const service = new window.google.maps.places.AutocompleteService(options);
   
    service.getPlacePredictions({ input }, callback);
  };

  useEffect(() => {
    // Sayfa yüklendiğinde kullanıcının mevcut konumunu al
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setOrigin(`${position.coords.latitude}, ${position.coords.longitude}`);
         
        // Kullanıcının konumunu koordinatlardan adres olarak al
        const geocoder = new window.google.maps.Geocoder();
        const latLng = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === "OK" && results[0]) {
            setOriginAddress(results[0].formatted_address);
          }
        });
      });
    }
  }, []);

  const handleDestinationChange = (value) => {
    setDestination(value);
    getSuggestions(value, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setDestinationSuggestions(predictions);
      }
    });
  };

  const handleDestinationSuggestionClick = (suggestion) => {
    setDestination(suggestion.description);
    setDestinationSuggestions([]);
  };
  

  const calculateDistance = () => {
    if (!destination) {
      alert("Varış Noktasını Doldurun!");
      return;
    }
    
    const isDestinationExists = routes.some((route) => route.destination === destination);
    
  if (isDestinationExists) {
    alert("Bu varış noktası zaten eklenmiş!");
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
        if(response.rows[0].elements[0].distance === undefined){
          alert("Konuma izin vermelisiniz!");
          return;
          
        }
        if (status === "OK") {
          const newDistance = response.rows[0].elements[0].distance.text;
         
          const newRoute = {
            origin: origin,
            destination: destination,
            distance: newDistance,
            id: Date.now(), 
          };
          setRoutes((prevRoutes) => [...prevRoutes, newRoute]);
          setDistance(newDistance);
          countdown(newRoute.id);
            const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: origin,
            destination: destination,
            travelMode: travelMode,
          },
          (response, status) => {
            if (status === "OK") {
              setDirections(response);
            } else {
              console.error("Error fetching directions:", status);
            }
          }
        );
        } else {
          console.log("Distance calculation failed with status:", status);
        }
      }
    );
  };
  const handleMapClick = () => {
    setDestinationSuggestions([]);
  };
  const clearRoutes = () => {
    setRoutes([]);
    setDirections(null);  
    setDestination("");
  };

  return (
    <div className="map p-0" onClick={handleMapClick}>
      <DistanceForm
        origin={origin}
        destination={destination}
        destinationSuggestions={destinationSuggestions}
        onDestinationChange={handleDestinationChange}
        onDestinationSuggestionClick={handleDestinationSuggestionClick}
        calculateDistance={calculateDistance}
        clearRoutes={clearRoutes}
      />
      <RouteList 
      routes={routes} 
      directions={directions} 
      setDirections={setDirections} 
        originAddress={originAddress}
         distance={distance} />
    </div>
  );
};

export default DistanceSystem;