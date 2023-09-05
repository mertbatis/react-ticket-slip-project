// DistanceForm.js
import React from "react";
import { Row, Col } from 'antd';
const DistanceForm = ({
  origin,
  originSuggestions,
  destination,
  destinationSuggestions,
  onOriginChange,
  onDestinationChange,
  onOriginSuggestionClick,
  onDestinationSuggestionClick,
  calculateDistance,
  clearRoutes,
}) => {
  return (
    <div>
      <Row className="mt-4">
        <Col span={7}>
          <div className="form-group">
            <label className="text-white">Varış Noktası</label>
            <br />
            <input
              id="destinationId"
              className="form-control"
              type="text"
              value={destination}
              onChange={(e) => onDestinationChange(e.target.value)}
              required
            />
            <div className="suggestion-list">
              {destinationSuggestions.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  className="suggestion-item"
                  onClick={() => onDestinationSuggestionClick(suggestion)}
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
      <button className="btn btn-primary custom-btn-size" type="button" onClick={calculateDistance}>
        Rota Oluştur
      </button>
      <button className="btn btn-danger ml-2 custom-btn-size" type="button" onClick={clearRoutes}>
        Rotaları Temizle
      </button>
    </div>
  );
};

export default DistanceForm;