<!-- 
  </template>
  <script setup lang="ts">

  import VMap from "v-mapbox";
  import mapboxgl from "mapbox-gl";
  const state = reactive({
    map: {
      accessToken:
        "pk.eyJ1Ijoic29jaWFsZXhwbG9yZXIiLCJhIjoiREFQbXBISSJ9.dwFTwfSaWsHvktHrRtpydQ",
  
      style: "mapbox://styles/mapbox/satellite-streets-v11",
  
      center: [444.04931277036667, 26.266912177018096] as number[],
      zoom: 11,
      maxZoom: 22,
    },
  });
 
  var geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { title: "Mapbox", description: "Washington, D.C." },
        geometry: {
          type: "Point",
          coordinates: [444.04931277036667, 26.266912177018096],
        },
      },
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [444.0481862425804, 26.266565820518633],
        },
      },
    ],
  };
  function onMapLoaded(map) {
    console.log("mappp");
   
    for (const feature of geojson.features) {
      // create a HTML element for each feature
      const el = document.createElement("div");
      el.className = "marker";

      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(feature.geometry.coordinates)
        .addTo(map);

        map.on("click", (e) => {
      new mapboxgl.Marker({
        color:"#" + (Math.random().toString(16) + "00FF00").substring(2,8),
        draggable: true,
      })
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map);
      console.log(`A click event has occurred at ${e.lngLat}`);
    });

  
      //flyto method take to the provided LngLat
  map.flyTo({
    center: [30.5, 50.5],
    zoom: 9,
    speed: 0.9,
    curve: 1,
    easing(t) {
    return t;
    }
    });
    }

  }

  </script>
  <style>
  .w-screen {
    width: 100vw;
  }
  .h-screen {
    height: 100vh;
  }
  .h-full {
    height: 100%;
  }
  .w-full {
    width: 100%;
  }
  .marker {
    background-image: url("http://localhost:3000/assets/images/download.jpg");
    background-size: cover;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
  }
  .mapboxgl-popup {
    max-width: 200px;
  }
  .mapboxgl-popup-content {
    text-align: center;
    font-family: "Open Sans", sans-serif;
  }
  </style>  -->

  
  <template>
    <div>
      <main class="w-screen h-screen">
        <v-map class="w-full h-full" :options="state.map" @loaded="onMapLoaded" />
        <div id="menu" class="">
          <input
            id="satellite-v9"
            type="radio"
            name="rtoggle"
            value="satellite"
            checked="checked"
          />
         
          <label for="satellite-v9">satellite</label>
          <input id="light-v10" type="radio" name="rtoggle" value="light" />
          <label for="light-v10">light</label>
          <input id="dark-v10" type="radio" name="rtoggle" value="dark" />
          <label for="dark-v10">dark</label>
          <input id="streets-v11" type="radio" name="rtoggle" value="streets" />
          <label for="streets-v11">streets</label>
          <input id="outdoors-v11" type="radio" name="rtoggle" value="outdoors" />
          <label for="outdoors-v11">outdoors</label>
        </div>
      </main>
  
    </div>
  </template>
  <script setup lang="ts">
  import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
  import VMap from "v-mapbox";
  import mapboxgl from "mapbox-gl";
  mapboxgl.accessToken =
    "pk.eyJ1Ijoic29jaWFsZXhwbG9yZXIiLCJhIjoiREFQbXBISSJ9.dwFTwfSaWsHvktHrRtpydQ";
  //const data: string;
  const state = reactive({
    map: {
      container: "map",
      
      style: "mapbox://styles/mapbox/satellite-streets-v11",
 
      center: [444.04931277036667, 26.266912177018096] as number[],
      zoom: 11,
      maxZoom: 22,
    },
    data: [],
  });
 
  var value = state.data;
  var geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { title: "my home ", description: "back to home " },
        geometry: {
          type: "Point",
          coordinates: [444.04931277036667, 26.266912177018096],
        },
      },
      {
        type: "Feature",
        properties: { title: "villege", description: "uttar pradesh" },
        geometry: {
          type: "Point",
          coordinates: [444.0481862425804, 26.266565820518633],
        },
      },
      {
        type: "Feature",
        properties: { title: "market", description: "uttar pradesh." },
        geometry: {
          type: "Point",
          coordinates: [444.0496963262558, 26.266450368122516],
        },
      },
      {
        type: "Feature",
        properties: { title: "home", description: "asdfghjhjkl." },
        geometry: {
          type: "Point",
          coordinates: [444.04630064964294, 26.23214630354235],
        },
      },
    ],
  };
  for (let data in state.data) {
    console.log(data);
  }
  function onMapLoaded(map: mapboxgl.Map) {
    console.log("map loaded");
    // getGisData();
    console.log(state.data);
    //new mapboxgl.Marker().setLngLat([444.0463, 26.2321]).addTo(map);
    getGisData();
    async function getGisData() {
      state.data = await $fetch("http://localhost:3001/gisdata/allData");
      console.log("data: ", state.data);
      for (const feature of state.data) {
        // create a HTML element for each feature
        const el = document.createElement("div");
        el.className = "marker";
        console.log("data from databse" + feature.geom);
        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
          .setLngLat(feature.geom.coordinates)
          .addTo(map);
      }
    }
  }
  </script>
  <style>
  .w-screen {
    width: 100vw;
  }
  .h-screen {
    height: 100vh;
  }
  .h-full {
    height: 100%;
  }
  .w-full {
    width: 100%;
  }
  .marker {
    background-image: url("http://localhost:3000/assets/images/download.jpg");
    background-size: cover;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
  }
  .mapboxgl-popup {
    max-width: 200px;
  }
  .mapboxgl-popup-content {
    text-align: center;
    font-family: "Open Sans", sans-serif;
  }
  #menu {
    position: absolute;
    background: #EFEFEF;
    padding: 10px;
    font-family: "Open Sans", sans-serif;
  }
  </style>