// RouteList.js
import React, { useState } from "react";
import DirectionsMap from "./DirectionsMap";
import { GoogleMap, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import { Row, Col } from 'antd';
const RouteList = ({ routes ,directions,setDirections, originAddress ,distance}) => {
  const [selectedRoute, setSelectedRoute] = useState("");
 
  return (
    <Row >
    <Col span={14} className="container distanceList">
      <Row gutter={[16, 16]}>  
          <Col span={8}  className="text-center">
            <span className="text-white">Başlangıç Konumu</span>
          </Col>
          <Col span={8}  className="text-center">
            <span className="text-white">Varış Konumu</span>
          </Col>
          <Col span={2}  className="text-center">
            <span className="text-white">Mesafe</span>
            </Col>
          <Col span={2} className="text-center" >
            <span className="text-white ">Süre</span>
          </Col>
          <Col span={4} className="text-center" >
            <span className="text-white ">Başlangıç/Bitiş</span>
          </Col>
            </Row>
      { routes.map((route, index) => (

        <Row gutter={[16, 16]} className="mt-3" key={index}>
          <Col className="m-auto text-center" span={8}>
            <span className="map-item">{originAddress}</span>
          </Col>
          <Col className="m-auto text-center" span={8}>
            <span className="map-item">{route.destination}</span>
          </Col>
          <Col className="m-auto text-center " span={2}>
            <span  id={`distanceColor-${route.id}`}  className={"map-item"}>{   route.distance
            }
            </span>
            </Col>
            <Col className="m-auto text-center" span={2}> {/* zaman*/}
         
            <span className="text-white" id={`countdown-${route.id}`} ></span>
            </Col>
            <Col  span={4}  className="m-auto text-center">
            <p className="text-white " id={`time-info-${route.id}`}></p>
            </Col>
        </Row>
      ))}
    <span className="custom-information badge bg-dark"> <span className="h6"> Rota Çizgisi: </span><br/>
     <span className="text-success">Yeşil</span> &lt; 10 Km &gt; <span className="text-danger">Kırmızı</span>
     </span>
    </Col>
    <Col span={10}>
            <DirectionsMap
              key={selectedRoute.id}
              origin={selectedRoute.origin}
              destination={selectedRoute.destination}
              distance = {distance}
              routes ={routes}
            />
        </Col>
    </Row>
  );
};

export default RouteList;