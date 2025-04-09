import { GoogleMap, Circle, useJsApiLoader } from "@react-google-maps/api";

type Props = {
  lat: number;
  lng: number;
};

export const CircleMap: React.FC<Props> = ({ lat, lng }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBsLBrx0skjBGUbHq9ezyHn5zuCHp-4KY4",
  });
  if (!isLoaded) return null; // prevent render if values are missing
  const center = { lat, lng };
  console.log("Lat:", lat, "Lng:", lng);
  return (
    <GoogleMap
      key={`${lat}-${lng}`} // force rerender if location changes
      mapContainerStyle={{ width: "100%", height: "400px" }}
      zoom={12}
      center={center}
    >
      <Circle
        center={center}
        radius={3000} // 3km
        options={{
          strokeColor: "#002fa2",
          strokeOpacity: 1,
          strokeWeight: 4,
          fillColor: "#002fa2",
          fillOpacity: 0.2,
        }}
      />
    </GoogleMap>
  );
};
