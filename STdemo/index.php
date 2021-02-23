<!DOCTYPE html>
<html lang="en">
  <head>
    <title>WebGIS個人專題</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="./css/bar_style.css">
    <link rel="stylesheet" href="./css/style.css" type="text/css">
    <link rel="stylesheet" href="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/css/ol.css" type="text/css">
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/build/ol.js"></script>
    <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
    <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js'></script>
	</head>
  <body>
    <nav class="nav navbar-inverse">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand">🏥 臺北市長期照護資源地圖</a>
        </div>
        <div class="collapse navbar-collapse" id="myNavbar">
          <ul class="nav navbar-nav">
            <li><a data-toggle="tab" href="#layerlist" id="nav_layerlist">圖層列表</a></li>
            <!--<li class="dropdown">
                <a class="dropdown-toggle" data-toggle="dropdown" href="#">功能選單<span class="caret"></span></a>
                <ul class="dropdown-menu">
                    <li><a href="#" id="fun1">功能1</a></li>
                    <li><a href="#" id="fun2">功能2</a></li>
                </ul>
            </li>-->
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li><a>WebGIS　杜承軒</a></li>
          </ul>
        </div>
      </div>
    </nav>
    <div id="container">
      <div id="sidebar">
        <div id="accordion">
          <h3>圖層列表<button type="button" id="btn-hide" class="btn btn-xs btn-default pull-right" id="sidebar-hide-btn"><i class="fa fa-chevron-left"></i></button></h3>
          <div id="acc_layerlist">
            <h4 id="baselayerlist">基本底圖</h4>
            <h4 id="overlayerlist">套疊圖資</h4>
          </div>
          <!--<h3>資料查詢</h3>
          <div id="query_data">
            <div role="form">
              <div class="form-group">
                <label for="tid" class="text-inline">
                    請輸入文字
                </label>
                <input type="text" id="tid" class="form-control" name="tid"/>
                <span></span>
              </div>
            </div>
          </div>
          <h3>繪圖</h3>
          <div id="draw_data">
            <button class='btn btn-info btn-draw' id='btn-line' drawType='Point'>Point</button>
            <button class='btn btn-info btn-draw' id='btn-line' drawType='LineString'>LineString</button>
            <button class='btn btn-info btn-draw' id='btn-line' drawType='Polygon'>Polygon</button>
            <br />
            <button class='btn btn-warning' id='btn-edit'>Edit</button><br />
            <a href='javascript:void(0);' class='btn btn-info' id='btn-json'>Download GeoJSON</a>
          </div>-->
        </div>
      </div>
      <div id="map"></div>
    </div>
    <script src="./js/map.js"></script>         <!-- include map.js here because it must appear after <div id="map"> -->
    <script src="./js/main.js"></script>
    <script src="./js/draw.js"></script>
  </body>
</html>
