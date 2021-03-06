//This project will program with manually ways - Circle marker and polyline instead of using "black-box" GEOJSON, which we will inherit functions but do not know how it work 
// on data was formatted for GEOJSON.

//US coordinate
var USCoords = [38, -97];
  
  // Create 2 layers Earthquake & Faults, will fetch datas,add to overlay map 
  var earthquake = new L.layerGroup();
  var faults = new L.layerGroup();


// create 3 tite layers to view map from 3 diff aspects
  var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });
  var satellite= L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var grayscales = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  //Create map and set tile layer default (Outdoors) to map
  var myMap = L.map("map-id", {
    center: USCoords,
    zoom: 3,
    layers: [outdoors]
  });

//Add tile layers to base map
  var baseMaps = {
    "Satellite": satellite,
    "Grayscales": grayscales,
    "Outdoors": outdoors
  };
 
// Read Earthquake datas and fetching data according Coordinates of earthquake using manually way,CircleMarker not using Geojson

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(response) {
   
   let data = response.features;
    console.log(data)
   
    let locationmarkers = [];

    //addtional part, find the strongest earthquare currently
    let largestearthquake=0;
    let largestinfo = "";
    let largestinfolocated = "";
    let laglon =[];
    let latestinfo1="";
    let latest1mag=0;
    let latestinfo2="";
    let latest2mag=0;
    let latestinfo3="";
    let latest3mag=0;
    let latestinfo4="";
    let latestinfo5="";
    let countearthquake = 0;
    let today = new Date(data[0].properties.time);
    let infotoday="";
    let infotodaymax=0;
    let infolocationmax=[];
    let infomax="";
    let ca="";
  
    for(let index = 0; index < data.length; index++){
        
    //console.log(data[index].geometry.coordinates);
    // console.log(data[index].properties.title);
      let location = data[index].geometry.coordinates;
      let info = data[index].properties;
      let mag =  data[index].properties.mag;
      let ca= data[index].properties.place;
      //Calculate by converting time to date occured earthquake
      var date = new Date(info.time);
      //let today = new Date(data[0].properties.time);
      if (today.toString().slice(0,16)==date.toString().slice(0,16) & ca.split(" ").includes("CA")==true){
        countearthquake = countearthquake+1;
        if (mag>=infotodaymax)
        {
          infotodaymax=mag;
          infolocationmax = [location[1], location[0]];
          infomax="<h3>" + "Today strongest earthquake: &nbsp" + date.toString().slice(0,34) + " <br>" + info.title + "<br>" + "Tsunamis:" + info.tsunami + "</h3>";
        }
      }

      //Find strongest earthquake and its info and lagitute,longitude as well
      if (largestearthquake <=mag) {
          largestearthquake =mag;
          largestinfo="<h3>" + "The strongest earthquake: &nbsp" + date.toString().slice(0,34) + " <br>" + info.title + "<br>" + "Tsunamis:" + info.tsunami + "    "+"Click to locate"+"</h3>" +"<p style=color:black>" ;
          largestinfolocated="<h3>" + "The strongest earthquake: &nbsp" + date.toString().slice(0,34) + " <br>" + info.title + "<br>" + "Tsunamis:" + info.tsunami + "</h3>";
          laglon=[location[1], location[0]];     
      }
     if (index ==0){
       latest1mag=data[0].properties.mag;
       latestinfo1="<h3>" + "The latest earthquake: &nbsp" + date.toString().slice(0,34) + " <br>" + info.title + "<br>" + "Tsunamis:" + info.tsunami + "</h3>" +"<p style=color:black>" + "Click to locate";
       laglon1=[location[1], location[0]];      
      }
     if (index ==1){
      latest2mag=data[1].properties.mag;
      latestinfo2="<h3>" + "The second latest earthquake: &nbsp" + date.toString().slice(0,34) + " <br>" + info.title + "<br>" + "Tsunamis:" + info.tsunami + "</h3>" +"<p style=color:black>" + "Click to locate";
      laglon2=[location[1], location[0]]; 
    }
    if (index ==2){
      latest3mag=data[2].properties.mag;
      latestinfo3="<h3>" + "The third latest earthquake: &nbsp" + date.toString().slice(0,34) + " <br>" + info.title + "<br>" + "Tsunamis:" + info.tsunami + "</h3>" +"<p style=color:black>" + "Click to locate";
      laglon3=[location[1], location[0]];    
    }     
      //calculate Magnitude to display marker( in this case using circle marker to display on Map)
    L.circleMarker(new L.LatLng(location[1], location[0]), {
        radius: mag*5,
        color: "black",
        fillColor: getcolor(mag)[0],
        weight:0.8,
        stroke: true,
        opacity:0.9,
        fillOpacity: 1
    })
    //add to overlay - earthquake Layer
       .bindPopup("<h3>" + "Information: &nbsp" + date.toString().slice(0,34) + " &nbsp - &nbsp" + info.title + "<br>" + "Tsunamis:" + info.tsunami + "</h3>")
    //locationmarkers.push(locationmarker);
     .addTo(earthquake);
    }
//insert latest earthquakes into map

//third
var lastestomap = L.control({position: 'bottomleft'});
var div = L.DomUtil.create('div', 'alert');
lastestomap.onAdd = function () { div.innerHTML = div.innerHTML + `<i style="background:${latest3mag}">
        </i>${latestinfo3} <br>`;
        return div;
}
lastestomap.addTo(myMap); 
 // Click on alert abt latest earthquake on bottomleft to locate that earthquake on map, together with its popup
 d3.select(".alert").on("click", function() { 
  L.circleMarker(laglon3, {
    radius: latest3mag*5,
    color: "black",
    fillColor: getcolor(latest3mag)[0],
    weight:0.8,
    stroke: true,
    opacity:0.9,
    fillOpacity: 1
}).bindPopup(latestinfo3,{closeOnClick:false})
.addTo(earthquake)
.openPopup(); 
});    

//second
var lastestomap = L.control({position: 'bottomleft'});
var div = L.DomUtil.create('div', 'alert');
lastestomap.onAdd = function () { div.innerHTML = div.innerHTML + `<i style="background:${latest2mag}">
        </i>${latestinfo2} <br>`;
        return div;
}
lastestomap.addTo(myMap);
 // Click on alert abt latest earthquake on bottomleft to locate that earthquake on map, together with its popup
 d3.select(".alert").on("click", function() { 
  L.circleMarker(laglon2, {
    radius: latest2mag*5,
    color: "black",
    fillColor: getcolor(latest2mag)[0],
    weight:0.8,
    stroke: true,
    opacity:0.9,
    fillOpacity: 1
}).bindPopup(latestinfo2,{closeOnClick:false})
.addTo(earthquake)
.openPopup(); 
});    

//first
var lastestomap = L.control({position: 'bottomleft'});
var div = L.DomUtil.create('div', 'alert');
lastestomap.onAdd = function () { div.innerHTML = div.innerHTML + `<i style="background:${latest1mag}">
        </i>${latestinfo1} <br>`;
        return div;
}
lastestomap.addTo(myMap);
 // Click on alert abt latest earthquake on bottomleft to locate that earthquake on map, together with its popup
 d3.select(".alert").on("click", function() { 
  L.circleMarker(laglon1, {
    radius: latest1mag*5,
    color: "black",
    fillColor: getcolor(latest1mag)[0],
    weight:0.8,
    stroke: true,
    opacity:0.9,
    fillOpacity: 1
}).bindPopup(latestinfo1,{closeOnClick:false})
.addTo(earthquake)
.openPopup(); 
});    


// Insert largest into map
    var largestonmap = L.control({position: 'bottomleft'});
    var div = L.DomUtil.create('div', 'alert');
    largestonmap.onAdd = function () { div.innerHTML = div.innerHTML + `<i style="background:${largestearthquake}">
            </i>${largestinfo} <br>`;
            return div;
  }
    largestonmap.addTo(myMap);
  // Click on alert abt strongest earthquake on bottomleft to locate that earthquake on map, together with its popup
    d3.select(".alert").on("click", function() { 
      L.circleMarker(laglon, {
        radius: largestearthquake*5,
        color: "black",
        fillColor: getcolor(largestearthquake)[0],
        weight:0.8,
        stroke: true,
        opacity:0.9,
        fillOpacity: 1
    }).bindPopup(largestinfolocated,{closeOnClick:false})
    .addTo(earthquake)
    .openPopup(); 
    });
    // myMap.addLayer(earthquake);
   
    //add to map
  earthquake.addTo(myMap);
//total equal today
     infotoday = "<h3>" + "The total earthquakes of Calif - " +today.toString().slice(0,16)  + ": "+countearthquake  + "<br>" +"with largest magnitude : M " + infotodaymax + "</h3>" +"<p style=color:black>";
var largestonmap = L.control({position: 'bottomleft'});
    var div = L.DomUtil.create('div', 'command');
    largestonmap.onAdd = function () { div.innerHTML = div.innerHTML + `<i style="background:${largestearthquake}">
            </i>${infotoday} <br>`;
            return div;
  }
    largestonmap.addTo(myMap);
    // Click on alert abt today strongest earthquake on bottomleft to locate that earthquake on map, together with its popup
    d3.select(".command").on("click", function() { 
      L.circleMarker(infolocationmax, {
        radius: infotodaymax*5,
        color: "black",
        fillColor: getcolor(infotodaymax)[0],
        weight:0.8,
        stroke: true,
        opacity:0.9,
        fillOpacity: 1
    }).bindPopup(infomax,{closeOnClick:false})
    .addTo(earthquake)
    .openPopup(); 
    });

});

    //Doing a funtion call getcolor which will use for earthquake and legend to generate the same color scales for each degree of magnitude
function getcolor(mag){

    if (mag <=1) {
     return ["rgb(169, 235, 104)","0-1"];
    }
    else if (mag<=2) {
     return ["rgb(241, 243, 104)","1-2"];
    }
    else if  (mag <=3){
     return ["rgb(243, 213, 77)","2-3"];
    }
    else if  (mag <=4){
        return ["rgb(230, 164, 90)","3-4"];
    }
    else if  (mag <=5){
        return ["rgb(243, 114, 9)","4-5"];
    }
    else {
        return ["rgb(236, 48, 24)","5+"];
    }
}


   // create the legend's innerHTML with degree of magnitude
function Legend(map) {
    var info = L.control({position: 'bottomright'});
    info.onAdd = function () {
        var div = L.DomUtil.create('div', 'legend');
        scales = [0, 1, 2, 3, 4, 5];
        div.innerHTML = "<div>" + "Magnitude" + "</div>";
        for (var i = 0; i < scales.length; i++) {
            div.innerHTML = div.innerHTML + `<i style="background:${getcolor(scales[i] + 1)[0]}">
            </i>${getcolor(scales[i] + 1)[1]} <br>`;
        }
        return div;
    };
    info.addTo(map);
}

   //Data on tectonic plates
   // Read Tectonic Plate and its fault datas and fetching data according Coordinates of faults using manually way,Polyline not using Geojson


d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", function(response) {
   
   // console.log(response)
    let datafault = response.features;
   
    let lines = [];
    console.log(datafault);
    for(let index = 0; index < datafault.length; index++){
        
      let line = datafault[index].geometry.coordinates;

          for(let i = 0; i < line.length; i++)
          {
            lines.push(new L.LatLng(line[i][1], line[i][0]));
          }
          //Coz Faults are found by many scientist and from other years so we have to add to map after getting from a scientist to elimate redundant line will draw between each other
          L.polyline(lines, {
            color: 'red',
            weight: 1,
            opacity: 1,
            smoothFactor: 1
            }).addTo(faults);
            lines=[];
    }
   
 //myMap.addLayer(faults);

faults.addTo(myMap);
});
 //add Legend to map
Legend(myMap);

 //Creat Overlay map and add 2 layers 
var overlay = {
  "Earthquakes": earthquake,
  "Faults": faults
};

 //add basemap and overlay map to L.control.layers
L.control.layers(baseMaps, overlay).addTo(myMap); 
