// RouteList.js
import React, { useState } from "react";
import DirectionsMap from "./DirectionsMap";
import { GoogleMap, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import { Row, Col } from 'antd';
const RouteList = ({ routes }) => {
  const [selectedRoute, setSelectedRoute] = useState("");
  const mapOptionsClassName = selectedRoute && selectedRoute.distance > 25 ? "red-map" : "";
  return (
    <Row >
    <Col span={16} className="container distanceList p-3">
      <Row gutter={[16, 16]}>  
          <Col span={8}>
            <span className="text-white">Başlangıç Konumu</span>
          </Col>
          <Col span={8}>
            <span className="text-white">Varış Konumu</span>
          </Col>
          <Col span={8}>
            <span className="text-white">Mesafe</span>
            </Col>
            </Row>
      {routes.map((route, index) => (
        <Row gutter={[16, 16]} className="mt-3" key={index}>
          <Col className="m-auto" span={8}>
            <span className="map-item">{route.origin}</span>
          </Col>
          <Col className="m-auto" span={8}>
            <span className="map-item">{route.destination}</span>
          </Col>
          <Col className="m-auto" span={4}>
            <span className={`map-item ${mapOptionsClassName}`}>{   route.distance
            }
            </span>
            </Col>
            <Col span={4}>
            <button
              className="btn btn-success"
              onClick={() => setSelectedRoute(route)}
            >
              Tarifi Gör
            </button>
          </Col>
        </Row>
      ))}
    <span className="custom-information"> <h6> Rota Çizgisi:</h6>
     <span className="text-success">Yeşil</span> &lt; 10 Km &gt; <span className="text-danger">Kırmızı</span>
     </span>
    </Col>
    <Col span={8}>
            <DirectionsMap
              origin={selectedRoute.origin}
              destination={selectedRoute.destination}
            />
        </Col>
    </Row>
  );
};

export default RouteList;