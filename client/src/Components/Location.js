import React, { useState, useEffect } from "react";

const Location = () => {
  const [coords, setCoords] = useState(null);
  const [place, setPlace] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCoords({ latitude, longitude, accuracy });

        // Turn coordinates into a place name (free, no API key)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=en&lat=${latitude}&lon=${longitude}`,
          );
          const data = await res.json();
          setPlace(data);
        } catch {
          setError("Couldn't get the place name.");
        }
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }, []);

  const address = place?.address || {};

  return (
    <div className="location">
      <h4>Current Location & Place Info</h4>

      {error && <p>{error}</p>}
      {!coords && !error && <p>Getting your location...</p>}

      {coords && (
        <>
          <p>
            <strong>Latitude:</strong> {coords.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {coords.longitude}
          </p>
          <p>
            <strong>Accuracy:</strong> ±{Math.round(coords.accuracy)} meters
          </p>
        </>
      )}

      {place && (
        <>
          <p>
            <strong>City:</strong>{" "}
            {address.city || address.town || address.municipality || "N/A"}
          </p>
          <p>
            <strong>Province:</strong>{" "}
            {address.province || address.state || "N/A"}
          </p>
          <p>
            <strong>Country:</strong> {address.country || "N/A"}
          </p>
          <p>
            <strong>Full Address:</strong> {place.display_name}
          </p>
        </>
      )}
    </div>
  );
};

export default Location;
