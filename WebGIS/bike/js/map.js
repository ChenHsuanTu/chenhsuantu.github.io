proj4.defs('EPSG:3826', "+title=二度分帶：TWD97 TM2 台灣 +proj=tmerc  +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +units=公尺 +no_defs");
proj4.defs('urn:ogc:def:crs:OGC:1.3:CRS:84',  proj4.defs('EPSG:4326'));
proj4.defs('urn:ogc:def:crs:EPSG::3826',      proj4.defs('EPSG:3826'));
ol.proj.proj4.register(proj4);

var init_lat=25.085;   //23.750815, 121.027538
var init_lng=121.56;
var zoom=12;
var user_location=null;
var now_lat=init_lat;
var now_lng=init_lng;
var view = new ol.View({
  center: ol.proj.transform([init_lng, init_lat], 'EPSG:4326', 'EPSG:3857'),
  zoom: zoom,
  minZoom: 10,
  maxZoom: 20,
  extent: ol.proj.transformExtent([121,24.5,122.07, 25.6], 'EPSG:4326', 'EPSG:3857')
});
var map = new ol.Map({
  layers: [],
  target: 'map',
  view: view,
  interactions: ol.interaction.defaults({ doubleClickZoom: false }),
});

var geolocation = new ol.Geolocation({
  tracking: true,
  projection: map.getView().getProjection()
});
geolocation.on('change:position', function() {
  if(user_location==null){
    user_location= geolocation.getPosition();  
    map.getView().setCenter(user_location);
    map.getView().setZoom(17);    
    var q=ol.proj.transform([parseFloat(user_location[0]), parseFloat(user_location[1])],'EPSG:3857','EPSG:4326');
    console.log(user_location,q);
  }  
});/**/

//setting for tile services
var projection = ol.proj.get('EPSG:3857');              //projection
var projectionExtent = projection.getExtent();          //projectionExtent
var size = ol.extent.getWidth(projectionExtent) / 256;  //size
var resolutions = new Array(20);                        //resolutions
var matrixIds = new Array(20);                          //matrixIds
for (var z = 0; z < 20; ++z) {   
    resolutions[z] = size / Math.pow(2, z);
    matrixIds[z] = z;
}

var layers = {
    'OSM': { 
        'title': 'OpenStreetMap(開放街圖)', 
        'type': 'base', 
        'layer': new ol.layer.Tile({ 
            visible:false,
            source: new ol.source.OSM()  
            }) 
        },
    'Google Maps': { 
        'title': 'Google Maps', 
        'type': 'base', 
        'layer': new ol.layer.Tile({ 
            visible:false,
            source: new ol.source.XYZ({
                crossOrigin: 'anonymous',
                url: 'https://mt{0-3}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
            })
        })
    },
    'EMAP': {
        'title': '通用電子地圖(門牌)',
        'type': 'base',
        'layer': new ol.layer.Tile({
            visible:false,
            extent: projectionExtent,
            source: new ol.source.WMTS({
                url: 'http://maps.nlsc.gov.tw/S_Maps/wmts?',
                layer: 'EMAP',
                matrixSet: 'GoogleMapsCompatible',
                format: 'image/jpeg',
                projection: projection,
                tileGrid: new ol.tilegrid.WMTS({
                    origin: ol.extent.getTopLeft(projectionExtent),
                    resolutions: resolutions,
                    matrixIds: matrixIds
                }),
                extent: projectionExtent,
                style: 'default'
            })
        })
    },
    'exit': {
        'title': '台北市河濱出入口',
        'type': 'overlay',
        'layer': new ol.layer.Vector({
            visible:true,
            source: new ol.source.Vector({
              format: new ol.format.GeoJSON(),
              url: './data/exit.geojson',
            })
       
       })
    },
    'rest': {
        'title': '河濱休憩站',
        'type': 'overlay',
        'layer': new ol.layer.Vector({
            visible:false,
            source: new ol.source.Vector({
              format: new ol.format.GeoJSON(),
              url: './data/rest.geojson',
            })
        })
    },
    'bike': {
        'title': '河濱腳踏車租借與維修',
        'type': 'overlay',
        'layer': new ol.layer.Vector({
            visible:false,
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: './data/bike.geojson',
            })
        })
    },
    'toilet': {
        'title': '河濱廁所',
        'type': 'overlay',
        'layer': new ol.layer.Vector({
          visible:false,
          source: new ol.source.Vector({
              format: new ol.format.GeoJSON(),
              url: './data/toilet.geojson',
          })  
        })
    },
	'bikeroad': {
        'title': '台北市河濱自行車道',
        'type': 'overlay',
        'layer': new ol.layer.Vector({
            visible:true,
            source: new ol.source.Vector({
              format: new ol.format.GeoJSON(),
              url: './data/bikeroad.geojson',
            })       
       })
    },

    'taipeicity': {
        'title': '台北市範圍',
        'type': 'overlay',
        'layer': new ol.layer.Vector({
            visible:true,
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: './data/tpe.geojson',
            })
        })
    },	


}

var setLayer=function(key){     //function setLayer(idx)
  for (i = 0; i < Object.keys(layers).length; i++) {
    var tlayer = layers[Object.keys(layers)[i]];
    if (tlayer.type == 'base') 
      layers[Object.keys(layers)[i]].layer.setVisible(Object.keys(layers)[i]==key);    
  }
}

var styles = {
    'taipeicity': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(200, 100, 100, 0.5)',
            width: 5
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0)'
        })
    })],


    'toilet': [new ol.style.Style({
        image: new ol.style.Icon({
          crossOrigin: 'anonymous',
          src:'./icon/toilet.png'         
        })
    })],/**/
	'bike': [new ol.style.Style({
        image: new ol.style.Icon({
          crossOrigin: 'anonymous',
          src:'./icon/bike.png'         
        })
    })],/**/
	'rest': [new ol.style.Style({
        image: new ol.style.Icon({
          crossOrigin: 'anonymous',
          src:'./icon/rest.png'         
        })
    })],/**/
	'exit': [new ol.style.Style({
        image: new ol.style.Icon({
          crossOrigin: 'anonymous',
          src:'./icon/exit.png'         
        })
    })],/**/
	'bikeroad': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(100, 100, 255, 0.9)',
            width: 5,
            lineDash: [4,8]   //line dash pattern [line, space]
        })
    })],

};




function initLayers() {
  //console.log("layers:",layers[Object.keys(layers)[0]].layer);
  //console.log("layers:",Object.keys(layers)[0].layer);
  for (i = 0; i < Object.keys(layers).length; i++) {
    var tlayer = layers[Object.keys(layers)[i]];
    if (tlayer.type == 'base') {
      $('<div class="radio"><label><input type="radio" class="basecontrol" name="baselayer" id=' + Object.keys(layers)[i] + ' value="' + Object.keys(layers)[i] +'"'+ (i==1?' checked':'')   +' >' + tlayer.title + '</label></div>').appendTo("#baselayerlist");
      //console.log(layers[Object.keys(layers)[i]].title);
      map.addLayer(tlayer.layer);           
    }else if(tlayer.type == 'overlay') {
			if(tlayer.title =='所在地點'){
				map.addLayer(tlayer.layer);
				tlayer.layer.setZIndex(10000-i);
				tlayer.layer.setStyle(styleFunction(Object.keys(layers)[i]));continue;}
      $('<div class="checkbox"><label><input type="checkbox" class="overlaycontrol" name="overlayer" value="' + Object.keys(layers)[i] + '"'+ ((i>6||i==3)?' checked':'')   +' >' + tlayer.title + '</label></div>').appendTo("#overlayerlist");
      map.addLayer(tlayer.layer);
      tlayer.layer.setZIndex(10000-i);
      tlayer.layer.setStyle(styleFunction(Object.keys(layers)[i]));
    }
  }
 
}

function styleFunction(stylename) {
  return styles[stylename];
};

initLayers();

var accuracyFeature = new ol.Feature();
geolocation.on('change:accuracyGeometry', function() {
accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
});

var positionFeature = new ol.Feature();
var nowFeature = new ol.Feature();
positionFeature.setStyle(new ol.style.Style({
image: new ol.style.Circle({
  radius: 6,
  fill: new ol.style.Fill({
	color: '#3399CC'
  }),
  stroke: new ol.style.Stroke({
	color: '#fff',
	width: 2
  })
})
}));
var nowFeature = new ol.Feature();
nowFeature.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
          crossOrigin: 'anonymous',
          src:'./icon/locat.png'         
        })
    }));


geolocation.on('change:position', function() {
var coordinates = geolocation.getPosition();
positionFeature.setGeometry(coordinates ?
  new ol.geom.Point(coordinates) : null);
nowFeature.setGeometry(new ol.geom.Point(user_location));
});

new ol.layer.Vector({
map: map,
source: new ol.source.Vector({
  features: [accuracyFeature, positionFeature,nowFeature]
})
});

var popup=undefined;
map.on('click', function(evt) {  //triger singleclick, get evt,
  var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {  //get feature and layer by evt.pixel
	return feature;
  });
  if(typeof(popup)!=undefined){
	map.removeOverlay(popup);
  }
  if (feature) {
	if(feature.get('COUNTY')=='臺北市') return;
	if(feature.get('河濱公園')!=undefined){
			popup = new ol.Overlay({
		element: $("<div />").addClass('info').append(   //put a table to element parameter
		  $("<table />").addClass('table').append(
			$("<thead />").append(
			  $("<tr />").append(
				$("<th />").html("項目")
			  ).append(
				$("<th />").html("說明")
			  )
			)
		  ).append(
			$("<tbody />").append(
			  $("<tr />").append(
				$("<td />").html("河濱公園")
			  ).append(
				$("<td />").html(feature.get('河濱公園'))
			  )
			).append(
			  $("<tr />").append(
				$("<td />").html("營業時間")
			  ).append(
				$("<td />").html(feature.get('營業時間'))
			  )
			).append(
			  $("<tr />").append(
				$("<td />").html("聯絡電話")
			  ).append(
				$("<td />").html(feature.get('電話'))
			  )
			)
		  )
		)[0]
	  });
	  popup.setPosition(evt.coordinate);
	  map.addOverlay(popup);

	}else if(feature.get('Id')!=undefined){
	popup = new ol.Overlay({
		element: $("<div />").addClass('info').append(   //put a table to element parameter
		  $("<table />").addClass('table').append(
			$("<thead />").append(
			  $("<tr />").append(
				$("<th />").html("項目")
			  ).append(
				$("<th />").html("說明")
			  )
			)
		  ).append(
			$("<tbody />").append(
			  $("<tr />").append(
				$("<td />").html("代碼")
			  ).append(
				$("<td />").html(feature.get('Id'))
			  )
			).append(
			  $("<tr />").append(
				$("<td />").html("名稱")
			  ).append(
				$("<td />").html(feature.get('Name'))
			  )
			).append(
			  $("<tr />").append(
				$("<td />").html("位置")
			  ).append(
				$("<td />").html(feature.get('Location'))
			  )
			).append(
			  $("<tr />").append(
				$("<td />").html("類別")
			  ).append(
				$("<td />").html(feature.get('type'))
			  )
			).append(
			  $("<tr />").append(
				$("<td />").html("隸屬")
			  ).append(
				$("<td />").html(feature.get('Park'))
			  )
			)
		  )
		)[0]
	  });
	  popup.setPosition(evt.coordinate);
	  map.addOverlay(popup);
	}else if(feature.get('River')!=undefined){
	popup = new ol.Overlay({
		element: $("<div />").addClass('info').append(   //put a table to element parameter
		  $("<table />").addClass('table').append(
			$("<thead />").append(
			  $("<tr />").append(
				$("<th />").html("項目")
			  ).append(
				$("<th />").html("說明")
			  )
			)
		  ).append(
			$("<tbody />").append(
			  $("<tr />").append(
				$("<td />").html("河岸")
			  ).append(
				$("<td />").html(feature.get('River'))
			  )
			).append(
			  $("<tr />").append(
				$("<td />").html("類別")
			  ).append(
				$("<td />").html(feature.get('Type'))
			  )
			).append(
			  $("<tr />").append(
				$("<td />").html("位置")
			  ).append(
				$("<td />").html(feature.get('Location'))
			  )
			)
		  )
		)[0]
		});
		popup.setPosition(evt.coordinate);
		map.addOverlay(popup);
	}else if(feature.get('Location')!=undefined){
	popup = new ol.Overlay({
		element: $("<div />").addClass('info').append(   //put a table to element parameter
		  $("<table />").addClass('table').append(
			$("<thead />").append(
			  $("<tr />").append(
				$("<th />").html("項目")
			  ).append(
				$("<th />").html("說明")
			  )
			)
		  ).append(
			$("<tbody />").append(
			  $("<tr />").append(
				$("<td />").html("隸屬")
			  ).append(
				$("<td />").html(feature.get('Park'))
			  )
			).append(
			  $("<tr />").append(
				$("<td />").html("位置")
			  ).append(
				$("<td />").html(feature.get('Location'))
			  )
			).append(
			  $("<tr />").append(
				$("<td />").html("類別")
			  ).append(
				$("<td />").html(feature.get('Type'))
			  )
			)
		  )
		)[0]
	  });
	  popup.setPosition(evt.coordinate);
	  map.addOverlay(popup);
	}else if(feature.get('NAME')!=undefined){
	popup = new ol.Overlay({
		element: $("<div />").addClass('info').append(   //put a table to element parameter
		  $("<table />").addClass('table').append(
			$("<thead />").append(
			  $("<tr />").append(
				$("<th />").html("項目")
			  ).append(
				$("<th />").html("說明")
			  )
			)
		  ).append(
			$("<tbody />").append(
			  $("<tr />").append(
				$("<td />").html("名稱")
			  ).append(
				$("<td />").html(feature.get('NAME'))
			  )
			)
		  )
		)[0]
	  });
	  popup.setPosition(evt.coordinate);
	  map.addOverlay(popup);
	}
  }
});


$(function() {
  //baseLayer control
  console.log(map.getView().calculateExtent(map.getSize()));
  setLayer('Google Maps');
  $("input.basecontrol").change(function() {
    if($(this).is(':checked'))
      setLayer($(this).attr('value'));    
  });
  
  //overlayLayer control
  $("input.overlaycontrol").change(function() {
    if($(this).is(':checked')){
      layers[$(this).val()].layer.setVisible(true); 
      console.log($(this).val());
    }
    else
      layers[$(this).val()].layer.setVisible(false);
  });  
});

