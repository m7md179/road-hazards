import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import L from 'leaflet';

// Fix for Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Hazard type colors
const HAZARD_COLORS = {
  'Pothole': '#FF5733',
  'Roadwork': '#FFC300',
  'Accident': '#C70039',
  'Flooding': '#3498DB',
  'Other': '#8E44AD'
};

function MapView() {
  const [loading, setLoading] = useState(true);
  const [hazards, setHazards] = useState([]);
  const [center, setCenter] = useState([51.505, -0.09]); // Default London
  const [zoom] = useState(12);
  const [selectedHazardType, setSelectedHazardType] = useState('all');
  const [hazardTypes, setHazardTypes] = useState([]);

  useEffect(() => {
    // Get user's location if available
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );

    const fetchHazards = async () => {
      try {
        setLoading(true);
        // In a real app you would use actual coordinates, here we use default ones
        const response = await fetch(`/api/hazards/nearby?latitude=${center[0]}&longitude=${center[1]}&radius=10000`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch hazards');
        }
        
        const data = await response.json();
        
        // If no data or empty, use mockup data
        if (!data || data.length === 0) {
          setHazards([
            { id: 1, hazard_type: 'Pothole', latitude: center[0] + 0.01, longitude: center[1] + 0.01, description: 'Large pothole in the middle of the road', severity: 'high' },
            { id: 2, hazard_type: 'Roadwork', latitude: center[0] - 0.01, longitude: center[1] - 0.01, description: 'Road maintenance in progress', severity: 'medium' },
            { id: 3, hazard_type: 'Accident', latitude: center[0] + 0.02, longitude: center[1] - 0.02, description: 'Vehicle collision', severity: 'high' },
            { id: 4, hazard_type: 'Flooding', latitude: center[0] - 0.02, longitude: center[1] + 0.015, description: 'Road flooded after heavy rain', severity: 'medium' },
            { id: 5, hazard_type: 'Other', latitude: center[0], longitude: center[1] + 0.025, description: 'Fallen tree blocking lane', severity: 'medium' }
          ]);
          
          setHazardTypes(['Pothole', 'Roadwork', 'Accident', 'Flooding', 'Other']);
        } else {
          setHazards(data);
          
          // Extract unique hazard types
          const types = [...new Set(data.map(hazard => hazard.hazard_type))];
          setHazardTypes(types);
        }
      } catch (error) {
        console.error('Error fetching hazards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHazards();
  }, [center]);

  const filteredHazards = selectedHazardType === 'all' 
    ? hazards 
    : hazards.filter(hazard => hazard.hazard_type === selectedHazardType);

  const getSeverityRadius = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return 15;
      case 'medium': return 10;
      case 'low': return 7;
      default: return 10;
    }
  };

  return (
    <>
      <PageHeader
        title="Hazard Map"
        description="Interactive map displaying all active road hazards"
        actions={
          <div className="flex gap-2">
            <select 
              className="px-4 py-2 border rounded-lg" 
              value={selectedHazardType}
              onChange={(e) => setSelectedHazardType(e.target.value)}
            >
              <option value="all">All Hazard Types</option>
              {hazardTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button 
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              onClick={() => {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setCenter([position.coords.latitude, position.coords.longitude]);
                  }
                );
              }}
            >
              Center on Me
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="p-4 lg:col-span-3">
            <div className="h-[70vh] w-full">
              <MapContainer 
                center={center} 
                zoom={zoom} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {filteredHazards.map(hazard => (
                  <CircleMarker
                    key={hazard.id}
                    center={[hazard.latitude, hazard.longitude]}
                    radius={getSeverityRadius(hazard.severity)}
                    pathOptions={{ 
                      fillColor: HAZARD_COLORS[hazard.hazard_type] || '#888888', 
                      color: 'white',
                      fillOpacity: 0.8,
                      weight: 1
                    }}
                  >
                    <Popup>
                      <div>
                        <h3 className="font-bold text-lg">{hazard.hazard_type}</h3>
                        <p>{hazard.description}</p>
                        <p className="text-sm text-gray-600">Severity: {hazard.severity}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Hazard Legend</h3>
            <div className="space-y-3">
              {hazardTypes.map(type => (
                <div key={type} className="flex items-center">
                  <div 
                    className="w-5 h-5 rounded-full mr-2" 
                    style={{ backgroundColor: HAZARD_COLORS[type] || '#888888' }}
                  ></div>
                  <span>{type}</span>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-semibold mt-6 mb-4">Severity</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-[15px] h-[15px] rounded-full border border-white mr-2 bg-gray-500"></div>
                <span>High</span>
              </div>
              <div className="flex items-center">
                <div className="w-[10px] h-[10px] rounded-full border border-white mr-2 bg-gray-500"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-[7px] h-[7px] rounded-full border border-white mr-2 bg-gray-500"></div>
                <span>Low</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Statistics</h3>
              <p>Total Hazards: {hazards.length}</p>
              <p>Showing: {filteredHazards.length}</p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

export default MapView;