import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, InfoWindow, Marker } from "react-google-maps";

import { TagInfo } from './TagInfo';

import { compose, lifecycle } from "recompose"

import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import _ from "lodash";
import { Route, Router, NavLink, HashRouter, BrowserRouter } from "react-router-dom";

const colorButton = {
  Water: "blue",
  Electricity: "green",
  CO2: "darkgrey",
  NH3: "black",
  "Compressed Air": "orange",
  Heat: "red",
  Glycol: "white",
  "Waste Water": "brown",
  pH: "purple",
  Acid: "yellow"

}


const MetadatasMap = compose(
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        bounds: null,
        center: {
          lat: parseFloat(this.props.lat), lng: parseFloat(this.props.lng)
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        // onBoundsChanged: () => {
        //   this.setState({
        //     bounds: refs.map.getBounds(),
        //     center: refs.map.getCenter(),
        //   })
        // },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          refs.map.fitBounds(bounds);
        },
        // handleMapReady: (mapProps, map) => {
        //   map.setOptions({
        //     draggableCursor: "default",
        //     draggingCursor: "pointer"
        //   });
        // }
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={15}
    initialCenter={{ lat: parseFloat(props.lat), lng: parseFloat(props.lng) }}
    center={props.center}
    // onBoundsChanged={props.onBoundsChanged}
    ref={props.onMapMounted}
    // onReady={() => handleMapReady()}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Customized your placeholder"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {props.metaDatas.map((metaData) => <Marker
      icon={{
        url: `/src/assets/${colorButton[metaData.technical_category]}.png`,
      }}
      key={metaData.id}
      position={{ lat: parseFloat(metaData.latitude), lng: parseFloat(metaData.longitude) }}
      onClick={() => { props.goMetaEdit(metaData.equipment_name) }}
      onMouseOver={() => { props.onToggleOpen(metaData.id) }}
      onMouseOut={() => { props.onToggleOpen(metaData.id) }}
    > 
      {props.isShows[metaData.id] && <InfoWindow onCloseClick={() => { props.onToggleOpen(metaData.id) }}>
        <TagInfo tagID={metaData.id} imgURL={metaData.meta_data_picture} technical_category={metaData.technical_category} equipment_name={metaData.equipment_name } service_interval={metaData.service_interval } legit={metaData.legit } latest_service={metaData.latest_service } expected_service={metaData.expected_service }/>
      </InfoWindow>}
    </Marker>)}
  </GoogleMap>
);

export default MetadatasMap;
