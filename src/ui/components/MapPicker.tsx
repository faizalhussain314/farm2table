// components/MapPicker.tsx
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = { width: "100%", height: "300px" };
const defaultCenter = { lat: 13.0827, lng: 80.2707 }; // Chennai as fallback

interface Props {
  value: { lat: number; lng: number } | null;
  onChange: (val: { lat: number; lng: number }) => void;
  disabled?: boolean;
}

export default function MapPicker({ value, onChange, disabled }: Props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const [center, setCenter] = useState(defaultCenter);

  // centre on user location the first time
  useEffect(() => {
    if (!isLoaded) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCenter(loc);
        onChange(loc);
      },
      () => {} // ignore denial
    );
  }, [isLoaded]);

  if (!isLoaded) return <p className="text-sm">Loading map…</p>;

  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng || disabled) return;
    const loc = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    onChange(loc);

    
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={14}
      center={value ?? center}
      onClick={handleClick}
      options={{ disableDefaultUI: true }}
    >
      {value && <Marker position={value} />}
    </GoogleMap>
  );
}
