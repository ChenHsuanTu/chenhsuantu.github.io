proj4.defs('EPSG:3826', "+title=二度分帶：TWD97 TM2 台灣 +proj=tmerc  +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +units=公尺 +no_defs");
proj4.defs('urn:ogc:def:crs:OGC:1.3:CRS:84',  proj4.defs('EPSG:4326'));
proj4.defs('urn:ogc:def:crs:EPSG::3826',      proj4.defs('EPSG:3826'));
ol.proj.proj4.register(proj4);

var init_lat=25.085;   //23.750815, 121.027538
var init_lng=121.56;
var zoom=11.5;
var user_location=null;
var now_lat=init_lat;
var now_lng=init_lng;
var view = new ol.View({
  center: ol.proj.transform([init_lng, init_lat], 'EPSG:4326', 'EPSG:3857'),
  zoom: zoom,
  minZoom: 10,
  maxZoom: 20,
  extent: ol.proj.transformExtent([121.3,24.8,121.9, 25.3], 'EPSG:4326', 'EPSG:3857')
});
var map = new ol.Map({
  layers: [],
  target: 'map',
  view: view,
  interactions: ol.interaction.defaults({ doubleClickZoom: false }),
});

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
        'title': 'OpenStreetMap 開放街圖', 
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
        'title': '通用電子地圖',
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
    'DarkMaps': { 
        'title': '地形暗色底圖', 
        'type': 'base', 
        'layer': new ol.layer.Tile({ 
            visible:false,
            source: new ol.source.XYZ({
                crossOrigin: 'anonymous',
                url: 'https://mt{0-3}.google.com/vt/lyrs=t&x={x}&y={y}&z={z}',
            })
        })
    },/**/
    'A': {
        'title': 'A級據點：社區整合型服務中心',
        'type': 'overlay',
        'layer': new ol.layer.Vector({
            visible:false,
            source: new ol.source.Vector({
              format: new ol.format.GeoJSON(),
              url: './data/A.geojson',
            })
       
       })
    },
    'B': {
        'title': 'B級據點：複合型服務中心',
        'type': 'overlay',
        'layer': new ol.layer.Vector({
            visible:false,
            source: new ol.source.Vector({
              format: new ol.format.GeoJSON(),
              url: './data/B.geojson',
            })
       
       })
    },
    'C': {
        'title': 'C級據點：巷弄長照站',
        'type': 'overlay',
        'layer': new ol.layer.Vector({
            visible:false,
            source: new ol.source.Vector({
              format: new ol.format.GeoJSON(),
              url: './data/C.geojson',
            })
        })
    },
    'hospital': {
        'title': '醫院',
        'type': 'overlay',
        'layer': new ol.layer.Vector({
            visible:false,
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: './data/hospital.geojson',
            })
        })
    },
    'clinicE': {
        'title': '中醫診所',
        'type': 'overlay',
        'layer': new ol.layer.Vector({
          visible:false,
          source: new ol.source.Vector({
              format: new ol.format.GeoJSON(),
              url: './data/clinicE.geojson',
          })  
        })
    },
	'clinicW': {
        'title': '西醫診所',
        'type': 'overlay',
        'layer': new ol.layer.Vector({
            visible:false,
            source: new ol.source.Vector({
              format: new ol.format.GeoJSON(),
              url: './data/clinicW.geojson',
            })       
       })
    },
    'TPVill': {
        'title': '台北市村里人口統計',
        'type': 'overlay',
        'layer': new ol.layer.Vector({
            visible:true,
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: './data/TP.geojson',
            })
        })
    },	
    'TPTown': {
        'title': '台北市行政區劃分',
        'type': 'overlay',
        'layer': new ol.layer.Vector({
            visible:true,
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: './data/TPTown.geojson',
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


    'hospital': [new ol.style.Style({
        image: new ol.style.Icon({
          crossOrigin: 'anonymous',
          src:'./icon/hospital2.png'         
        })
    })],/**/
	'clinicE': [new ol.style.Style({
        image: new ol.style.Icon({
          crossOrigin: 'anonymous',
          src:'./icon/clinicE.png'         
        })
    })],/**/
	'clinicW': [new ol.style.Style({
        image: new ol.style.Icon({
          crossOrigin: 'anonymous',
          src:'./icon/clinicW.png'         
        })
    })],/**/
	'A': [new ol.style.Style({
        image: new ol.style.Icon({
          crossOrigin: 'anonymous',
          src:'./icon/A.png'         
        })
    })],/**/
	'B': [new ol.style.Style({
        image: new ol.style.Icon({
          crossOrigin: 'anonymous',
          src:'./icon/B.png'         
        })
    })],/**/
	'C': [new ol.style.Style({
        image: new ol.style.Icon({
          crossOrigin: 'anonymous',
          src:'./icon/C.png'         
        })
    })],/**/
	/*'bikeroad': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(100, 100, 255, 0.9)',
            width: 5,
            lineDash: [4,8]   //line dash pattern [line, space]
        })
    })],/**/
    'TPVill': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(53, 141, 185, 0.36)',
            width: 1
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0)'
        })
    })],
    'TPTown': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(200, 100, 100, 0.5)',
            width: 2.5
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0)'
        })
    })],    
	'taipeicity': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(252, 173, 2, 0.5)',
            width: 4
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0)'
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
      if(i!=11){
		  $('<div class="checkbox"><label><input type="checkbox" class="overlaycontrol" name="overlayer" value="' + Object.keys(layers)[i] + '"'+ ((i>9)?' checked':'')   +' >' + tlayer.title + '</label></div>').appendTo("#overlayerlist");
      }
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

var popup=undefined;
map.on('click', function(evt) {  //triger singleclick, get evt,
  var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {  //get feature and layer by evt.pixel
	return feature;
  });
  if(typeof(popup)!=undefined){
	map.removeOverlay(popup);
  }
  if (feature) {
	if(feature.get('TOWN_ID')!=undefined) return;
	if(feature.get('VILLAGE')!=undefined){
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
				$("<td />").html("村里")
			  ).append(
				$("<td />").html(feature.get('VILLAGE'))
			  )
			)
		  ).append(
			$("<tbody />").append(
			  $("<tr />").append(
				$("<td />").html("總人口")
			  ).append(
				$("<td />").html(feature.get('POP'))
			  )
			)
		  ).append(
			$("<tbody />").append(
			  $("<tr />").append(
				$("<td />").html("幼年人口")
			  ).append(
				$("<td />").html(feature.get('YOUNG'))
			  )
			)
		  ).append(
			$("<tbody />").append(
			  $("<tr />").append(
				$("<td />").html("壯年人口")
			  ).append(
				$("<td />").html(feature.get('MIDDLE'))
			  )
			)
		  ).append(
			$("<tbody />").append(
			  $("<tr />").append(
				$("<td />").html("老年人口")
			  ).append(
				$("<td />").html(feature.get('OLD'))
			  )
			)
		  )
		)[0]
		});
		popup.setPosition(evt.coordinate);
		map.addOverlay(popup);
	}else if(feature.get('縣市')!=undefined){
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
				$("<td />").html("單位名稱")
			  ).append(
				$("<td />").html(feature.get('單位'))
			  )
			)
		  ).append(
			$("<tbody />").append(
			  $("<tr />").append(
				$("<td />").html("服務區域")
			  ).append(
				$("<td />").html(feature.get('服務區域'))
			  )
			)
		  ).append(
			$("<tbody />").append(
			  $("<tr />").append(
				$("<td />").html("聯絡地址")
			  ).append(
				$("<td />").html(feature.get('校正'))
			  )
			)
		  ).append(
			$("<tbody />").append(
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
	}else if(feature.get('org_name')!=undefined){
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
				$("<td />").html("類別")
			  ).append(
				$("<td />").html(feature.get('type'))
			  )
			)
		  ).append(
			$("<tbody />").append(
			  $("<tr />").append(
				$("<td />").html("名稱")
			  ).append(
				$("<td />").html(feature.get('org_name'))
			  )
			)
		  ).append(
			$("<tbody />").append(
			  $("<tr />").append(
				$("<td />").html("地址")
			  ).append(
				$("<td />").html(feature.get('addr'))
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

