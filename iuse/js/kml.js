var KML = {
	xml:'<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"></kml>',
	xmlObject: {},
	xmlTitle: "",
	xmlSource: ["http://i-use.eu"],
	textUrl: "http://i-use.eu/handlecsv/text.php?text",
	newMin: 0,
	newMax: 1,
	correction: 0,
	colorMax: '#ff0000',
	colorMin: '#00ff00',
	ge: {},
    
    /**
     * @desc Function that generates KML
     * @name earthKMLGenerator
     * @param countryArray array of countries/values
     * @param min - minimum value
     * @param max - maximum value
     * @param title - title of the map
     * @param source - source of the map
     */
	earthKMLGenerator: function(countryArray, min, max, title, source) {
        //Basic KML syntax
		var kml = '<?xml version="1.0" encoding="UTF-8"?>\
<kml xmlns="http://www.opengis.net/kml/2.2">\
<Document>\
		<Style id="normal">\
			<PolyStyle>\
				<fill>1</fill>\
				<outline>1</outline>\
			</PolyStyle>\
			<LineStyle>\
				<color>E5222222</color>\
				<width>1</width>\
			</LineStyle>\
			<IconStyle>\
				<scale>0.0</scale>\
			</IconStyle>\
			<LabelStyle>\
				<scale>0</scale>\
			</LabelStyle>\
		</Style>\
		<Style id="highlight">\
			<PolyStyle>\
				<fill>1</fill>\
				<outline>1</outline>\
			</PolyStyle>\
			<LineStyle>\
				<color>E5000000</color>\
				<width>2</width>\
			</LineStyle>\
			<IconStyle>\
				<scale>0.0</scale>\
			</IconStyle>\
			<LabelStyle>\
				<scale>2</scale>\
			</LabelStyle>\
			<BalloonStyle>\
				<text></text>\
			</BalloonStyle>\
		</Style>\
		<StyleMap id="sharedStyle">\
			<Pair>\
				<key>normal</key>\
				<styleUrl>#normal</styleUrl>\
				</Pair><Pair>\
				<key>highlight</key>\
				<styleUrl>#highlight</styleUrl>\
			</Pair>\
			<BalloonStyle>\
				<text></text>\
			</BalloonStyle>\
		</StyleMap>\
		<ScreenOverlay>\
			<name>Legend</name>\
			<Icon>\
				<href>http://i-use.eu/handlecsv/images/logo_55.png</href>\
			</Icon>\
			<description><![CDATA[<h1>I Use logo</h1>]]></description>\
			<overlayXY x="0.01" y="0.01" xunits="fraction" yunits="fraction"/>\
			<screenXY x="0.01" y="0.01" xunits="fraction" yunits="fraction"/>\
			<size x="55" y="48" xunits="pixels" yunits="pixels"/>\
		</ScreenOverlay>\
</Document>\
</kml>';
		//Set minimum and maximum value in the data series
        var newMin = min;
        var newMax = max;
        
        //This correction is for negative values - that would go under ground
        //Therefore we set mimimum to 0
		if(min < 0){
			newMin = 0;
			this.correction = - min;
			newMax = max + this.correction;
			//this.correction = - min;
		}
		this.newMin = newMin;
		this.newMax = newMax;
		//console.log(newMin, newMax, "HMM");
		//var ratio 
        //Parse KML in XML object
		var xmlDoc = $.parseXML(kml);
		var documentElemnt = jQuery(xmlDoc).find('Document');
		var self = this;
		//var screenTitle = $.parseXML('<ScreenOverlay>');
		//Find the folder node
		var folder = $.parseXML('<Folder></Folder>');
        //For each row in the country array
		for (var index in countryArray) {
            //If the first value is a country
			if(Countries.names[countryArray[index][0]] != undefined && countryArray[index][1] != undefined) { 
                //Append a new placemark to the Folder node
				$(folder).find('Folder').append(self.addPlacemark(Countries.names[countryArray[index][0]], countryArray[index][1]));
			}
		}
		
		jQuery(documentElemnt).append($(folder).children(0));

		return (new XMLSerializer()).serializeToString(xmlDoc);
	},
    
	/**
     * @desc Function that generates properly formated KML
     * @name addPlacemark
     * @param name - country name/code 
     * @param value - value to append
     * @return placemark 
     */    
	addPlacemark: function(name, value) {
		var placemark = jQuery.parseXML('<Placemark></Placemark>');
		var percent = parseInt((value + this.correction - this.newMin)*100/(this.newMax-this.newMin));
		Color.hexColor = [this.colorMax, this.colorMin];
		Color.convertHexToRgb();
		var colors = Color.colorDifference(percent);
		var altitude = 10000 + 12000*percent;
		//console.log(name+' '+altitude+' '+value+' '+'AD'+colors['hexColor'][2]+colors['hexColor'][1]+colors['hexColor'][0]+'test');
		$(placemark).children(0).append(this.addElement('name', name, {}));
		$(placemark).children(0).attr({'id':name});
		$(placemark).children(0).append(this.addElement('description', value, {}));
		$(placemark).children(0).append(this.addStyle('AD'+colors['hexColor'][2]+colors['hexColor'][1]+colors['hexColor'][0]));
		$(placemark).children(0).append(this.addMultiGeometry(altitude, name, value));

		return $(placemark).children(0);
	},
	
    /**
     * @desc create an XML Element and append attributes and value
     * @name addElement
     * @param name
     * @param value
     * @param attributes
     * @return XML elements
    */
	addElement: function(name, value, attributes) {
		var string = '<'+name+'></'+name+'>';
		var element = jQuery.parseXML(string);
		$(element).children(0).attr(attributes);
		$(element).children(0).append(value);
		return $(element).children(0);
	},
	
    /**
     * @desc to add screen overlay 
     * @comment you cant put pure html overlaying the 3D earth
     * @todo has to be finished to show legend
     */
	addScreenOverlayText: function(name, text, attributes) {
		var screenOverlay = addElement('ScreenOverlay'); 
		screenOverlay.append(addElement('name', name));
		var icon = addElement('Icon');
		icon.append(addElement('href', '<![CDATA['+ KML.logoUrl +']]>'));
		var url = KML.textUrl + text;
		//screenOverlay.append(addElement('href', '<![CDATA['+ KML.logoUrl +']]>'));
		screenOverlay.append(icon);
		/**
	
		*/
	},
	
    /**
     * @descr create an XML formated KML style element for each placemark
     * @param colorCode 
     * @return 
     */
	addStyle: function(colorCode){
		//console.log(colorCode);
		var style = this.addElement('Style', '', {});
		var lineStyle = this.addElement('LineStyle', '', {});
		$(lineStyle).append(this.addElement('width', 1.5, {}));
		var polyStyle = this.addElement('PolyStyle', '', {});
		$(polyStyle).append(this.addElement('color', colorCode, {}));
		$(style).append(lineStyle, polyStyle);		
		return style;
	},
	
    /**
     * @desc create an XML formated KML geometry based on each country shape 
     * @param altitude - calculated altitude for the KML layer
     * @param country - country name based on which we get country shape from predefined array
     * @param value -  value for the country 
     * @return multiGeometry - XML element holdim complex geometry data
     */
	addMultiGeometry: function(altitude, country, value) {
		//console.log(altitude, country, value);
		var multiGeometry = this.addElement('MultiGeometry', '', {});
		var self = this;

		for(var index in Countries.borders[country]){

			var polygon = self.addElement('Polygon', '', {});
						
			$(polygon).append(self.addElement('extrude', 1, {}));
			$(polygon).append(self.addElement('tessellate', 1, {}));
			$(polygon).append(self.addElement('altitudeMode', 'relativeToGround', {}));
			
			if(Countries.borders[country][index][0] == 'border'){
				var boundaryIs = self.addElement('outerBoundaryIs', '', {});	
			} else {
				var boundaryIs = self.addElement('innerBoundaryIs', '', {});	
			}
			
			var coordinates = Countries.borders[country][index][1].replace(/,0 /g, ","+altitude+" ");
			//console.log(coordinates);
			var linearRing = self.addElement('LinearRing', '', {});			
			
			$(linearRing).append(self.addElement('coordinates', coordinates , {}));
			$(boundaryIs).append(linearRing);
			$(polygon).append(boundaryIs);
			$(multiGeometry).append(polygon);
		}
		return multiGeometry;
	}
}