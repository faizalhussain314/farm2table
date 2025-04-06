import { Marker, Popup } from 'react-leaflet';
import { useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';





// Fix icon paths
const lucideMarkerHTML = ReactDOMServer.renderToString(
    <MapPin color="#000" size={32} strokeWidth={2.5} />
  );
  
  const lucideIcon = L.divIcon({
    html: lucideMarkerHTML,
    className: '', // override default leaflet-icon styles
    iconSize: [32, 32],
    iconAnchor: [16, 32], // center bottom
  });
  
type DraggableMarkerProps = {
  position: { lat: number; lng: number };
  onPositionChange: (pos: { lat: number; lng: number }) => void;
};

export const DraggableMarker = ({ position, onPositionChange }: DraggableMarkerProps) => {
  const markerRef = useRef<L.Marker>(null);
  const [draggable] = useState(true);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          onPositionChange({ lat: newPos.lat, lng: newPos.lng });
        }
      },
    }),
    [onPositionChange]
  );

  return (
    <Marker
    icon={lucideIcon}
    draggable={draggable}
    eventHandlers={eventHandlers}
    position={position}
    ref={markerRef}
  >
    <Popup minWidth={90}>
      Drag me to select the customer’s location!
    </Popup>
  </Marker>
  
  );
};
