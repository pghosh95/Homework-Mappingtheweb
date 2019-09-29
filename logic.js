// We create the tile layer that will be the background of our map.
console.log("working");

var apiKey = "pk.eyJ1IjoicGdob3NoMyIsImEiOiJjazE1a2U4cTQwdjFhM2Jwa3U0YXhkOG1rIn0.u6yQ9vlyI1_DTGq2Wtp5Rg";

var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 20,
  id: "mapbox.streets",
  accessToken: apiKey
});

// We create the map object with options.
var map = L.map("mapid", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});

graymap.addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(data) {

  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.75
    };
  }

  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "Black";
    case magnitude > 4:
      return "Red";
    case magnitude > 3:
      return "Yellow";
    case magnitude > 2:
      return "Green";
    case magnitude > 1:
      return "Blue";
    default:
      return "#98ee00";
    }
  }

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 2;
  }

  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);

  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "Coral",
      "Blue",
      "Green",
      "Yellow",
      "Red",
      "Black"
    ];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(map);
});
