<template>
    <main class="w-screen h-screen">
        <head>
            <link rel="stylesheet"
                href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css"
                type="text/css" />
            <link href="https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.css" rel="stylesheet" />
            <link rel='stylesheet'
                href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.2.0/mapbox-gl-draw.css'
                type='text/css' />
        </head>
        <v-map class="w-full h-full" :options="state.map" @loaded="onMapLoaded">
            <div class="mydiv">
                <select>
                    <option class="satellite-v9" id="satellite-v9" name="rtoggle" value="satellite-v9">
                        Satellite
                    </option>
                    <option id="light-v10" name="rtoggle" value="light-v10">Light</option>
                    <option id="dark-v10" name="rtoggle" value="dark-v10">Dark</option>
                    <option id="streets-v11" name="rtoggle" value="streets-v11" selected>
                        Streets
                    </option>
                    <option id="outdoors-v11" name="rtoggle" value="outdoors-v10">
                        Outdoors
                    </option>
                </select>
                Upload CSV file <input type="file" @change="onChangeOfFile">
                <pre id="info"></pre>
                <pre id="features"></pre>
            </div>
        </v-map>
    </main>
</template>
<script setup lang="ts">
import VMap from "v-mapbox";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
const state: any = reactive({
    map: {
        accessToken:
            "pk.eyJ1Ijoic29jaWFsZXhwbG9yZXIiLCJhIjoiREFQbXBISSJ9.dwFTwfSaWsHvktHrRtpydQ",
        style: "mapbox://styles/mapbox/streets-v11?optimize=true",
        // style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
        center: [444.04931277036667, 26.266912177018096] as number[], //uses longitude, latitude
        zoom: 6,
        maxZoom: 22,
    }
});
const data = reactive({
    mapData: [],
});
async function onChangeOfFile(event) {
    console.log(event.target.files[0]);
    const payload = {
        file: event.target.files[0]
    }
    data.mapData = await $fetch('http://localhost:3001/postgis/file', {
        method: 'POST',
        body: payload,
    });
    console.log(data.mapData);
}
async function onMapLoaded(map: mapboxgl.Map) {
    map.addControl(
        new MapboxGeocoder({
            accessToken: "pk.eyJ1Ijoic29jaWFsZXhwbG9yZXIiLCJhIjoiREFQbXBISSJ9.dwFTwfSaWsHvktHrRtpydQ",
            mapboxgl: mapboxgl
        })
    );
    map.addControl(new mapboxgl.FullscreenControl());
    // map.addControl(
    //     new MapboxDirections({
    //         accessToken: "pk.eyJ1Ijoic29jaWFsZXhwbG9yZXIiLCJhIjoiREFQbXBISSJ9.dwFTwfSaWsHvktHrRtpydQ"
    //     }),
    //     'top-left'
    // );
    //---------------------------------zoom in and out controls
    map.addControl(new mapboxgl.NavigationControl());
    /**
     * Draw tool code
     */
    var Draw = new MapboxDraw();
    map.addControl(Draw, 'top-right');
    /**
     * Fetched Api data
     */
    map.on("click", (e) => {
        document.getElementById("info").innerHTML =
            JSON.stringify(e.point) +
            "<br />" +
            JSON.stringify(e.lngLat.wrap());
    });

    
    map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point);
        // Limit the number of properties we're displaying for
        // legibility and performance
        const displayProperties = [
            "type",
            "properties",
            "id",
            // "layer",
            "source",
            "sourceLayer",
            "state",
        ];
        const displayFeatures = features.map((feat) => {
            const displayFeat = {};
            displayProperties.forEach((prop) => {
                displayFeat[prop] = feat[prop];
            });
            return displayFeat;
        });
        // Write object as string with an indent of two spaces.
        document.getElementById("features").innerHTML = JSON.stringify(
            displayFeatures,
            null,
            3
        );
    });
    // const styleToggle: any = document.getElementById('mydiv');
    // console.log(styleToggle);
    // styleToggle.addEventListener("change", (event) => {
    //     console.log(event.target.value);
    //     map.setStyle("mapbox://styles/mapbox/" + event.target.value);
    // });
    data.mapData = await $fetch('http://localhost:3001/postgis/file')
    var forPolygonPointArray = [];
    console.log(data.mapData);
    data.mapData.map((ele) => {
        let lat = ele.Lat;
        let long = ele.Long;
        var newArray = [];
        newArray.push(lat);
        newArray.push(long);
        forPolygonPointArray.push(newArray);
    })
    map.addSource('india', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            forPolygonPointArray
                        ]
                    }
                }
            ]
        }
    });
    map.addLayer({
        'id': 'india',
        'type': 'fill',
        'source': 'india', // reference the data source
        'layout': {},
        'paint': {
            'fill-color': '#0080FF', // blue color fill
            'fill-opacity': 0.5
        }
    });
    data.mapData.forEach(element => {
        console.log("foreach long" + element.Long)
        if (element.Lat <= 18.559658) {
            console.log("in first if");
            new mapboxgl.Marker({
                draggable: true,
                color: "#" + (Math.random().toString(16) + "000000").substring(2, 8),
            })
                // .setLngLat([lon, lat])
                .setLngLat(element.geom.coordinates)
                .addTo(map);
        }
        else if (element.Lat == 20.117840) {
            console.log("in second else if");
            map.addSource('maine', {
                type: 'geojson',
                data: {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            [
                                72.685546875,
                                19.145168196205297
                            ],
                            [
                                74.091796875,
                                15.961329081596647
                            ]
                        ]
                    }
                }
            });
            map.addLayer({
                'id': 'outline',
                'type': 'line',
                'source': 'maine',
                'layout': {},
                'paint': {
                    'line-color': '#000',
                    'line-width': 3
                }
            });
        }
        else if (element.Lat > 20.117840) {
            console.log("in third else if");
            map.addSource('pointsSource', {
                type: 'geojson',
                data: {
                    "type": "FeatureCollection",
                    "features": [
                        {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                                "type": "Point",
                                "coordinates": [
                                    77.216721,
                                    28.644800
                                ]
                            }
                        }
                    ]
                }
            });
            map.addLayer({
                id: 'points',
                source: 'pointsSource',
                type: 'circle',
                paint: { 'circle-radius': 30, "circle-color": '#3BB2D0' },
            });
        }
        else {
            console.log("dont match data in DB")
        }
    });
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
.mapboxgl-popup {
    max-width: 400px;
    font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
}
.mydiv {
    z-index: 1;
    background: #EFEFEF;
    padding: 10px;
    font-family: "Open Sans", sans-serif;
    position: absolute;
}
</style>