<?php 
session_start();

if (isset($_GET['csvFile'])) {
	include('./ReadCsv.php');
	$params = array(
		'csvFile' => $_GET['csvFile']
	);
	$result = new ReadCsv($params);
	$return_json = $result->returnJson();
}
if ( isset($_GET['csvInput']) && $_SESSION['return_json'] != '') {
	$return_json = $_SESSION['return_json'];	
}
?>
  
<!DOCTYPE HTML>
<html>
  <head>
  	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  	<script src="http://www.google.com/jsapi"></script>
  	<script src="./js/iuse.js"></script>
	<script src="./js/countries.js"></script>
	<script src="./js/kml.js"></script>
	<script src="./js/colorcalc.js" type="text/javascript"></script>
  	<link rel="stylesheet" href="./css/visualisation.css" />
  	<script>
  	    var displayHeight = <?php echo $_GET['h']?> - 50;
  	    var displayWidth = <?php echo $_GET['w']?>;
  	    console.log(displayWidth, displayHeight);
  	    var mapCenter = '<?php echo $_GET['mapcenter']?>';
  	    var mapArray = [];
  	    
		IUse.prepareCsvInput(<?php echo $return_json; ?>, "<?php echo $_GET['type']?>", "<?php echo $_GET['d']?>");
 		
 		
 		if (IUse.displayType == 'map') {
 			google.load("visualization", "1", {packages: ["geochart"]});
 			IUse.chartType = "GeoChart";
 			var index = 0;
			IUse.singleColumnDataArray.forEach(function (row){
				if ( Countries.names[row[0]] != undefined  || index == 0)
					mapArray.push(row);
				index++;
			});
 		} else if (IUse.displayType == 'graph') {
 			google.load("visualization", "1", {packages: ["treemap", "corechart"]});
 			mapArray = IUse.singleColumnDataArray;
 		} else if (IUse.displayType == 'earth') {
 			google.load("earth", "1", {"other_params":"sensor=false"});
 		}	
		
		function drawVisualization() 
		{
			if (IUse.displayType == 'earth') {
				google.earth.createInstance('visualization', drawThreeD, failureThreeD);
			} else {
				drawGraph();
			}
		}
		
		function drawGraph(coef) 
		{
		  mapArray = IUse.singleColumnDataArray;
		  var data = google.visualization.arrayToDataTable(mapArray);	
	  	  var geochart = new google.visualization[IUse.chartType](document.getElementById('visualization')); 
		  var options = {width: displayWidth, height: displayHeight, colorAxis:{colors:IUse.colors}};
		  //options['title'] = IUse.tableTitle;
		  jQuery('#subTitle').html(IUse.tableTitle);
		  jQuery('#subSource').html(IUse.sourceLines.replace(/\,/gi, ""));
		  //console.log();
		  if (IUse.chartType == "TreeMap") {
		      options['title'] += " Size: " + mapArray[0][2] + " Color: " + mapArray[0][3];
		  }
		  if (IUse.chartType == "AreaChart") {
		  	options['isStacked'] = true;
		  }
		  
		  if (IUse.chartType != "GeoChart") {
		    if (mapArray.length > 20)
		  	  options['fontSize'] = 8;
		    else if (mapArray.length > 10)
		  	  options['fontSize'] = 10;
		    else  
		      options['fontSize'] = 12;
		  } else {
		  	 options['fontSize'] = 14;
		  	 if (mapCenter == 'europe') {
		  	 	options['region'] = 150;	
		  	 }
		  }
		  //console.log(mapArray);
		  geochart.draw(data, options);
		}

        function drawThreeD(instance) 
        {
          KML.ge = instance;
          KML.ge.getWindow().setVisibility(true);
          //console.log(IUse.minValue, IUse.maxValue);
		  var kmlString = KML.earthKMLGenerator(IUse.singleColumnDataArray, IUse.minValue, IUse.maxValue);
          //console.log(kmlString); 		
          var kmlObject = KML.ge.parseKml(kmlString);
          KML.ge.getFeatures().appendChild(kmlObject);

		  var lookAt = KML.ge.getView().copyAsLookAt(KML.ge.ALTITUDE_RELATIVE_TO_GROUND);
		  lookAt.setLatitude(44);
		  lookAt.setLongitude(20);
		  lookAt.setRange(6000000);
		  KML.ge.getView().setAbstractView(lookAt);	
        }

		function RemoveAllFeatures()
		{
		  var features = KML.ge.getFeatures();
		  while (features.getLastChild() != null)
		  {
		    features.removeChild(features.getLastChild());
		  }
		}
			
		function failureThreeD() {
			
		}
		google.setOnLoadCallback(drawVisualization);
  	</script>
  </head>
  <body>
  	<form>
  	<div id="subNav" >
  		<div id="postfield">
  		</div>
  		<div id="submitfield">
  		</div>
  	</div>
	</form>
    <div id="visualization"></div>
    <div id="logoSmall"></div>
    <script> 	
    IUse.visualization = jQuery('#visualization');
	IUse.visualization.width(displayWidth);
	IUse.visualization.height(displayHeight);
	IUse.buildHtml(IUse.displayType);
	if (IUse.displayType == 'earth') {
		jQuery('#logoSmall').hide();
	}
    </script>
    <div id="subTitle"></div>
    <div id="subSource"></div>
  </body>
</html>