import './App.css';
import DistanceSystem from './DistanceSystem';
import { GoogleMap,useLoadScript,Marker} from '@react-google-maps/api';

function App() {
 // .env dosyasındaki değişkeni al
const googleMapsApiKey = process.env.REACT_APP_API;
document.getElementById('google-maps-script').src =`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;

  return (
    <div className='container'>
      <DistanceSystem />
    </div>
  );
}

export default App;