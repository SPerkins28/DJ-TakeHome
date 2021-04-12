import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Coords from "../coords";

const MapContainer = (props) => {
  const { searchResults } = props;
  const [mapMarkers, setMapMarkers] = useState([]);
  const googleApiKey = "AIzaSyA_duDRX1qfPwN2skLwSvQePovGahUyupg";
  const mapStyles = {
    width: "90%",
    height: 520,
  };

  const getCoords = async (events) => {
    //using the google maps api to geocode addresses into lat and lng for map marking (gets coords just fine but shows undefined when trying to map through mapMarkers)
    const markers = [];
    Promise.all(
      events.map((event) =>
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${event.eventAddress}&key=${googleApiKey}`
        )
      )
    )
      .then((responses) => {
        return Promise.all(responses.map((r) => r.json()));
      })
      .then((data) => {
        data.forEach((d, index) => {
          const lat = Number(d.results[0]?.geometry.location.lat.toFixed(4)); //lat lng was being weird with numbers had to slap a Number() around it to make it work
          const lng = Number(d.results[0]?.geometry.location.lng.toFixed(4));
          markers.push({
            name: events[index].eventTitle,
            location: { lat, lng },
          });
        });
      });
    setMapMarkers(markers);
  };

  useEffect(() => {
    getCoords(searchResults);
  }, [searchResults]);

  const defaultCenter = {
    lat: 39.7684,
    lng: -86.1581,
  };

  const [selected, setSelected] = useState({});

  const onSelect = (item) => {
    setSelected(item);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyA_duDRX1qfPwN2skLwSvQePovGahUyupg">
      <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={defaultCenter}>
        {Coords.map((item) => {
          return (
            <Marker
              key={item.name}
              position={item.location}
              onClick={() => onSelect(item)}
            />
          );
        })}
        {selected.location && (
          <InfoWindow
            position={selected.location}
            clickable={true}
            onCloseClick={() => setSelected({})}
          >
            <p><strong>{selected.name}</strong></p>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
