var IUse = {
    // Holds indexes to be deleted from unselected rows
    mainDir: './iuse',
	deleteArray: [],
	// What is the display type
	displayType: "map",
	loadCsv : "",
	csvInput:"",
	sortColumn : 0,
	order : 3,
	//Index of the column to be shown
	tableIndex: 1,
	//Tree chart table second index to be displayed
	tableTreeIndex:1,
	htmlElement: {},
	graphDatalines: [],
    //CSV file in JSON format and split into main 
	jsonData: {},
	tableTitle: "",
	sourceLines: "",
	minValue: 0,
	maxValue: 0,
	values: [0,0],
	colors: ['#e8d5a5','#de5410'],
	singleColumnDataArray: [],
	chartType: "BarChart",
	initialJsonData: {},
	/** 
	 * Predefined data charting types 
	 * chooseColumn - can the displayed column be changed 
	 * singleColumnDataArray - is it a multiple array 
	 * transposeArray - does the array need transposing
     * 1 yes 0 no
	 */
	graphTypes : {
		"ColumnChart": {"chooseColumn":1, "singleColumnDataArray":1, "transponse":0},
		//"ScatterChart": {"chooseColumn":1, "singleColumnDataArray":1, "transponse":0},
		"BarChart": {"chooseColumn":0, "singleColumnDataArray":0, "transponse":0},
		"AreaChart": {"chooseColumn":0, "singleColumnDataArray":0, "transponse":1},
		"TreeMap": {"chooseColumn":1, "singleColumnDataArray":2, "transponse":0},
		"LineChart": {"chooseColumn":0, "singleColumnDataArray":0, "transponse":1},
	},
	
	/**
	 * In case the user selects to download the table
     * @desc This function opens a download link in a new browser window
     * @name downloadCSV
     */
	downloadCSV: function () {
	  window.open(this.mainDir+'?csvFile='+IUse.loadCsv+'&sortColumn='+IUse.sortColumn+'&order='+IUse.order+'&delete='+IUse.deleteArray.join(":"));
	},
	
	/**
	 * @desc Selects / deselects all checkboxes
     * the master control checkbox sits under the id #all
	 * @name - changeAll
     * @retutn - void
	 */
	changeAll:function () {
	  if (jQuery('#all').prop('checked')) {
	    jQuery('input:checkbox').prop('checked', true);
	    IUse.calculateDeleteArray();
	  } else {
	    jQuery('input:checkbox').prop('checked', false);
	    IUse.calculateDeleteArray();
	  }  
	},
	
	/**
	 * @desc Calculate which indexes has not to be shown - based on the input from the checkboxes
	 * @name calculateDeleteArray
	 * @return void
	 */
	calculateDeleteArray: function () {
	  var newArray = new Array();
      //Walk all checkboxes on the page
	  jQuery("input:checkbox").each(function() {
	    var index = IUse.deleteArray.indexOf(parseInt(jQuery(this).val()));
	    if (!jQuery(this).prop('checked')) {
	    	if (index == -1)
	      		newArray.push(parseInt(jQuery(this).val()));
	    } else {
	    	if (index > -1) 
	    		IUse.deleteArray.splice(index, 1);
	    }
	  });
	  //console.log(IUse.deleteArray);
	  jQuery.merge(IUse.deleteArray, newArray.slice()); 
	},
	
	/**
	 * @desc Opens a chart in an iframe id taking into account the user screen size
     * @name openChart
	 * @param optionGraph - takes the type of display needed in the iframe
     * @param mapCenter - where does the user want the map to be zoomed at
	 * @return void
	 */
	openChart: function (optionGraph, mapCenter) {
	  if (jQuery("#mapCenter").val() != undefined ) {
	  		mapCenter = jQuery("#mapCenter").val()
	  }
	  var height = jQuery(window).height();
	  var width = jQuery(window).width();
	  console.log(width, height);
	  if (height > 650 && optionGraph == "earth") 
	  	height = 650;
	  if (width > height) {
	  	width = height*1.41;
	  } else {
	  	height = width/1.41;
	  }
	  var heightWindow = height - 20;
	  console.log(width, height);
	  var myIframe = jQuery("<iframe/>");
	  var queryString = {
	  	'type' : optionGraph,
	  	'mapcenter' : mapCenter,
	  	'csvFile': IUse.loadCsv,
	  	'csvInput':'csv',
	  	'w' : width,
	  	'h' : heightWindow,
	  	'd' : IUse.deleteArray.join(":"),
	  };
	  //console.log(queryString);
	  myIframe.attr({	
	  	'src':this.mainDir+'/displaygraph.php?'+jQuery.param(queryString), 
	  	'width':width+'px', 
	  	'height':height+'px'
	  });
      jQuery('#holder').css({'width':width, 'left':'50%', 'margin-left':-(width/2)});
	  jQuery('#holder').html(myIframe);
	  jQuery('#overlay').show();
	},
	
	/**
	 * @desc Draws a GeoChart in page element with id #visualization
	 * @name drawMap
     * @return void
	 */
	drawMap: function() {
		var data = google.visualization.arrayToDataTable(arrayData);	
		var geochart = new google.visualization.GeoChart(
		document.getElementById('visualization'));
		var options = {width: 780, height: 550, region: 150, colorAxis:{colors:IUse.colors}};
		options['title'] = IUse.tableTitle;
		geochart.draw(data, options);	
	},
	
	/**
	 * @desc Function that takes the content of the table and prepares it for printing
	 * @name printTable
	 * @return true
	 */
	printTable: function () 
    {
        var mywindow = window.open('', 'my div', 'height=400,width=600');
        mywindow.document.write('<html><head><title>my div</title>');
        /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
        mywindow.document.write('<link rel="stylesheet" href="'+this.mainDir+'/css/main.css">');
        mywindow.document.write('<style>');
        mywindow.document.write('.firstRowClass {font-size: 11px;font-weight: bold;background: rgb(240,240,240);padding: 1px;min-width: 47px;}');
        mywindow.document.write('.oddRowClass {font-size: 10px;background: rgb(241,241,241);padding: 1px;}');
        mywindow.document.write('.evenRowClass {font-size: 10px;background: rgb(251,251,251);padding: 1px;}');
        mywindow.document.write('</style>');
        mywindow.document.write('</head><body >');
        mywindow.document.write(jQuery('.rt-article').html());
        mywindow.document.write('</body></html>');

        mywindow.print();
        mywindow.close();

        return true;
    },
    
	/**
	 * @desc Constructs the main parameters for the display of the data
	 * @name prepareCsvInput
	 * @param jsonData - json object returned by asynchronous call to the server 
	 * @param displayType - string 
	 * @param deleteString - array
	 */
    prepareCsvInput: function(jsonData, displayType, deleteString) {
  		IUse.displayType = displayType;
  		deleteArray = deleteString.split(":");
		for(var i = 0; i < deleteArray.length; i++)
    		IUse.deleteArray.push(parseInt(deleteArray[i]));	
		
  		IUse.initialJsonData = jsonData;
  		//console.log(IUse.initialJsonData['datalines'].slice());
  		IUse.fixInitialData();		
 		//
 		IUse.processDataArray();
 		//console.log(IUse.initialJsonData);
        if (IUse.chartType == "BarChart" && IUse.displayType == "graph") 
            IUse.calculateMultiColumn();
        else
            IUse.calculateSingleColumn();
 		//console.log(IUse.initialJsonData['datalines'].slice());
 		KML.colorMax = IUse.colors[1];
 		KML.colorMin = IUse.colors[0];
    },
    
	
	/**
	 * @desc Get the CSV file from the server in JSON format 
	 * @param id - HTML id of the DOM object
     * @param csvInput - name of the csv file
     * @return void - put result in HTML
	 */
	getCsvTable: function (id, csvInput) { 
	
		IUse.htmlElement = id;
		IUse.loadCsv = jQuery.trim(IUse.htmlElement.html());
		if (csvInput != undefined && csvInput.length == 32) {
			jQuery.post( this.mainDir+"/return-json.php", {'uid':csvInput}, function( data ) {
			  	IUse.initialJsonData = jQuery.parseJSON(data);
			  	IUse.fixInitialData();
			  	IUse.processDataArray();
			  	IUse.buildTable(IUse.htmlElement, IUse.jsonData['headlines'] , IUse.jsonData['datalines'] , IUse.jsonData['bottomlines']);
            });		
		} else if (csvInput != undefined) {
			IUse.csvInput = csvInput + "\n Created with http://i-use.eu/ \n";
			//console.log(IUse.csvInput);
			jQuery.post( this.mainDir+"/return-json.php", {csvInput:IUse.csvInput}, function( data ) {
                //console.log(data);
                IUse.initialJsonData = jQuery.parseJSON(data);
			  	IUse.fixInitialData();
			  	IUse.processDataArray();
			  	console.log(IUse.initialJsonData);
			  	IUse.buildTable(IUse.htmlElement, IUse.jsonData['headlines'] , IUse.jsonData['datalines'] , IUse.jsonData['bottomlines']);
			  	if (IUse.initialJsonData['uid'] != undefined) {
		            var urlAddress = "http://i-use.eu/userinput/"+IUse.initialJsonData['uid']+".html";
		            IUse.htmlElement.append("<br/>");
		            IUse.htmlElement.append("Below you can find a personal link to your data<br/>");
		            IUse.htmlElement.append(urlAddress);
		            //console.log(urlAddress);
		        }
            });			
		} else {
			var paramValue = IUse.loadCsv;
			jQuery.post( this.mainDir+"/return-json.php", {csvFile:paramValue}, function( data ) {
			  	IUse.initialJsonData = jQuery.parseJSON(data);
			  	IUse.fixInitialData();
			  	IUse.processDataArray();
			  	//console.log(IUse.jsonData);
			  	IUse.buildTable(IUse.htmlElement, IUse.jsonData['headlines'] , IUse.jsonData['datalines'] , IUse.jsonData['bottomlines']);
			  	if (IUse.initialJsonData['uid'] != undefined) {
		            var urlAddress = "http://i-use.eu/userinput/"+IUse.initialJsonData['uid']+".html";
		            IUse.htmlElement.append("<br/>");
		            IUse.htmlElement.append("Below you can find a personal link to your data<br/>");
		            IUse.htmlElement.append(urlAddress);
		            //console.log(urlAddress);
		        }
			});			
		}	
	},
        
    /**
     * @desc Creates index on the rows in the JSON datalines in their order of appearance
     * @name fixInitialData
     * @param void
     */
	fixInitialData: function() {
	  	var jsonDataDataLines = [];
	  	var countRows = 0;
	  	IUse.initialJsonData['datalines'].forEach(function (row) {
	  		jsonDataDataLines.push([countRows, row]);
	  		countRows++;
	  	});
	  	IUse.initialJsonData['datalines'] = jsonDataDataLines.slice();		
	},
        
    /**
     * @desc reset delete array if initial is set to 1, process the data array and rebuild the HTML table
     * @name rebuildCsvTable
     * @param initial 
     * @return void
     */	
	rebuildCsvTable: function(initial) {
		if(initial == 1) {
			IUse.deleteArray = [];
		}
	  	IUse.processDataArray(IUse.initialJsonData);
	  	IUse.buildTable(IUse.htmlElement, IUse.jsonData['headlines'] , IUse.jsonData['datalines'] , IUse.jsonData['bottomlines']);		
	},
        
    /**
     * @desc remove rows from initial JSON which index is in deleteArray, convert empty space to slash, parse float the data value
     * @name processDataArray
     */	
	processDataArray: function() {
		//console.log(IUse.deleteArray);
		var newDataLinesArray = [];
        //Presumably there are two headlines one for title one for series, we take as default option index 1 - second row of the headlines  
		var optionIndex = 1;

	  	IUse.initialJsonData['datalines'].forEach(function (row) {
	  		if (row[1].filter(String).length > 1) {
                //If the row index is not into deleteArray 
	  			if ( jQuery.inArray(row[0], IUse.deleteArray) == -1 ) {
			  		var cellArray = [];
			  		var cellCount = 0;
                    
			  		cellArray.push(row[0]);
			  		row[1].forEach(function (cell) {
                        //If it is not the first cell in the row which is a name
			  			if (cellCount != 0) {
                            //Parse float the cell if do not succeed convert to slash
			  				cell = parseFloat(cell.replace(",",".")) || "-";
			  			}
                        cellArray.push(cell);
			  			cellCount++;   
			  		});
			  		newDataLinesArray.push(cellArray);
			  }
		  	}
	  	});
        //If there is title in the headline (two headlines,, one for data series and one for title) assign it to tableTitle 
	  	if ( IUse.initialJsonData['headlines'].length == 2 ) {
	  		IUse.tableTitle = IUse.initialJsonData['headlines'][0][0];  
	  	} else {
	  		optionIndex = 0;
	  		IUse.tableTitle = IUse.loadCsv;
	  	}
	  	console.log(IUse.jsonData);
		IUse.jsonData['headlines'] = IUse.initialJsonData['headlines'].slice();
		IUse.jsonData['datalines'] = newDataLinesArray.slice();		
		IUse.jsonData['bottomlines'] = IUse.initialJsonData['bottomlines'].slice();
		IUse.jsonData['options'] = IUse.getOptions(IUse.initialJsonData['headlines'], optionIndex);	
		IUse.sourceLines = IUse.jsonData['bottomlines'].join('</br>');
		IUse.sourceLines = IUse.sourceLines.replace(",,", "");
	},	
	
    /**
     * @desc Get the options, from the headlines/data series of JSON data, for the dropdown menus in the charts
     * @name getOptions 
     * @param lines - the headlines of the jsonData
     * @param optionIndex - index defining the position of the data series in jsonData
     * @return options - array taken from the 
     */
	getOptions: function (lines, optionIndex) {
		var countOption = 0;
		var options = [];
		console.log(lines);
		lines[optionIndex].forEach( function (option) {
			//console.log(option);
			if(countOption > 0) { 
				options.push(option);
			}
			countOption++;
		});
		return options;
	},
	
    /**
     * @desc sortable function
     */
	sortIt: function (a, b) {
        //console.log(IUse.sortColumn);
		if (IUse.sortColumn != 1) {
			var aVal = parseFloat(a[IUse.sortColumn]) || 0, bVal = parseFloat(b[IUse.sortColumn]) || 0;
		} else {
            var aVal = a[IUse.sortColumn], bVal = b[IUse.sortColumn];
        }
		
		if ( IUse.order == 2 ) {    
	        return aVal > bVal ? 1 : (aVal < bVal ?  - 1 : 0);
		} else {
	        return aVal < bVal ? 1 : (aVal > bVal ?  - 1 : 0);
		}
	},
	
    /**
     * @desc - add sort buttons to the html table
     * @name addSortButtons
     * @param index 
     * @return sort - jQuery HTML object
     */
	addSortButtons: function(index) {
		var sort = jQuery("<div>");
		var up = jQuery("<a>");
		var down = jQuery("<a>");
		if (index == 1) 
			sort.attr({"style":"float:left; height:13px; width:14px; line-height:6px;"});
		else
			sort.attr({"style":"float:right; height:13px; width:14px; line-height:6px;"});
		up.attr({"href":"#", "onclick":"IUse.calculateTable("+index+", 1);", "class":"sortUp"});
		up.append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
		down.attr({"href":"#", "onclick":"IUse.calculateTable("+index+", 2);", "class":"sortDown"});
		down.append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
		sort.append(up, "<br>", down);
		return sort;		
	},

    /**
     * @desc - add checkbox to the html table with them a control over delete array is made
     * @name addCheckBoxes
     * @param value - value of the checkbox  
     * @return input - jQuery HTML object
     */
	addCheckBoxes: function(value) {
		var checkBoxId = "checkbox"+value;
		var input = jQuery("<input/>");
		var existing = jQuery("#"+checkBoxId);

		if (existing.val() != undefined && !existing.prop('checked')){
			input.attr({"type":"checkbox", "value":value});	
		} else {
			input.attr({"type":"checkbox", "value":value, "checked":""});
		}

		if (value == -1) {
			input.attr({"id":"all","onclick":"IUse.changeAll()"});
		} else {
			input.attr({"onclick":"IUse.calculateDeleteArray()", "id":checkBoxId});
		}
		return input;
	},
	
    
    /**
     * @desc Build the html table
     * @name buildTable
     * @param id - html id where the table should be placed in
     * @param headlines 
     * @param datalines
     * @param bottomlines
     * @return void - appends the table to the HTML id
     */
	buildTable: function(id, headlines, datalines, bottomlines) {
		IUse.htmlElement = id;
		
		id.html("");
		id.append(IUse.addMainButton('Initial', 'IUse.rebuildCsvTable(1)'));
		id.append(IUse.addMainButton('CSV', 'IUse.downloadCSV()'));
		id.append(IUse.addMainButton('Graph', 'IUse.openChart(\'graph\', mapCenter);window.location.href=\'#graph\';'));
		id.append(IUse.addMainButton('Map', 'IUse.openChart(\'map\', mapCenter);window.location.href=\'#map\';'));
		id.append(IUse.addMainButton('3D Map', 'IUse.openChart(\'earth\', mapCenter);window.location.href=\'#earth\';'));
		id.append(IUse.addMainButton('Print', 'IUse.printTable();'));
		id.append(IUse.addMainButton('Remove unselected', 'IUse.rebuildCsvTable(0);'));
		id.append("<br/>");
		
		var table = jQuery("<table>");
		table.attr({"class":"tableClass", "style":"border-colapse:separate;"});
	
		var tr;
		var td;
		var row;
		var checkIfTitleWritten = false;  
		headlines.forEach(function( row ) {
			var count = 1;
			tr = jQuery("<tr>");
			var emptyTd = jQuery("<td>");
			emptyTd.attr({"class":"oddRowClass"});
			if (row.filter(String).length != 1 ) {
				emptyTd.append(IUse.addCheckBoxes(-1));
			}
			tr.append(emptyTd);
			row.forEach(function ( cell ) {
				td = jQuery("<td>");
				td.append(cell);
				td.attr({"class":"firstRowClass"});
				if (row.filter(String).length == 1 && !checkIfTitleWritten) {
					td.attr({'colspan':(row.length + 1), "class":"firstRowClass"});
					tr.append(td);
					checkIfTitleWritten = true;
					return;
				} else if (row.filter(String).length != 1 ) {
					td.append(IUse.addSortButtons(count));
					tr.append(td);
					count++;
				} 
			});
			/* Add trend column */
			if ( count > 1 ) {
				td = jQuery("<td>");
				td.append("Growth ");	
				td.append( row[1], " - " ,row[row.length-1]);	
				td.attr({"class":"firstRowClass"});
				tr.append(td);
			}
			table.append(tr);
		});
		
		var countOddEvenLines = true;	
		datalines.forEach(function( row ) {
			tr = jQuery("<tr>");
			//var emptyTd = jQuery("<td>");
			//emptyTd.append(IUse.addCheckBoxes(IUse.jsonData['datalines'].indexOf(row)));
			//tr.append(emptyTd);
			if (countOddEvenLines) {
				classRow = "evenRowClass";
				countOddEvenLines = false;
			} else {
				classRow = "oddRowClass";
				countOddEvenLines = true;					
			}
			//emptyTd.attr({"class":classRow});
			var countColumn = 0;
			row.forEach(function ( cell ) {
				td = jQuery("<td>");
				if (countColumn == 0) {
					td.append(IUse.addCheckBoxes(cell));
				} else {
					td.append(cell);
				}
				
                if (countColumn > 1) 
                    td.attr({"class":classRow + " alignRight"});
                else 
                    td.attr({"class":classRow});
                    
				tr.append(td);
				countColumn++;
			});			
			trend = ( ( parseFloat(row[countColumn-1]) - parseFloat(row[2]) )*100 / parseFloat(row[2]) );  
			if (trend == undefined || isNaN(trend)) {
				trend = "-";
			} else {
			    trend = Number((parseFloat(trend)).toFixed(2));
			}
			//console.log(row[countColumn-1], row[2])
			td = jQuery("<td>");
			td.attr({"class":classRow + " alignRight"});
			td.append(trend);
			if (trend != "-")
			    td.append("%");
			//console.log(trend);
			tr.append(td);
			table.append(tr);
		});
		
		bottomlines.forEach(function( row ) {
			tr = jQuery("<tr>");
			var emptyTd = jQuery("<td>");
			emptyTd.attr({"class":"oddRowClass"});
			tr.append(emptyTd);
			//row.forEach(function ( cell ) {
			td = jQuery("<td>");
			td.append(row[0]); 
			td.attr({"class":"firstRowClass"});
				//if (row.filter(String).length == 1 && !checkIfTitleWritten) {
			td.attr({'colspan':(row.length+1) , "class":"firstRowClass"});
			tr.append(td);
					//checkIfTitleWritten = true;
					//return;
				//}
			//});
			table.append(tr);
		});
        
		id.append(table);		
	},
	
    /**
     * @desc order table rows based on choosen index and order 
     * @param index
     * @param order
     * @return void
     */
	calculateTable: function (index, order) {	
		IUse.sortColumn = index;
		IUse.order = order;	
		var datalines = IUse.jsonData['datalines'].slice();
		if (IUse.sortColumn != 0) {
			datalines.sort(IUse.sortIt);
		} else {
			if (IUse.order == 2) {
				datalines.sort();
			} else {
				datalines.reverse();
			}
		}
	  	IUse.buildTable(IUse.htmlElement,  IUse.jsonData['headlines'], datalines, IUse.jsonData['bottomlines']);		
	},
	
    /**
     * @desc Some charts require transponsing the JSON data for correct display
     * @name transponseArray
     * @param array
     * @return transponse
     */
	transponseArray: function(array) {
		//var newrows = [];
		var transponse = [];
		array.forEach( function (row) {
			var column = 0;
			row.forEach( function(cell) {
				//console.log(transponse[column]);
				if ( typeof transponse[column] == 'undefined' ) {
					transponse[column] = [];
				}
				transponse[column].push(cell);
				column++;
			});
		});
		return transponse;
	},
        
    /**
     * @desc graphDatalines are the one used by Google Charts library. The difference is only in the missing index of the data.
     * @name calculateGraphDatalines
     * @return void - sets the graphDatalines
     */
	calculateGraphDatalines: function() {
		var datalines = IUse.jsonData['datalines'].slice();			
		datalines.forEach(function(row){
			row.splice(0,1);
			IUse.graphDatalines.push(row);
		});		
	},
	
    /**
     * @todo Could be designed to set another field curently it sets singleColumnDataArray 
     * @desc Some charts require multicolumn JSON data for correct display
     * @name calculateMultiColumn
     * @return void
     */   
	calculateMultiColumn: function() {
		var options = [];
		var singleLines = [];
		options.push(IUse.tableTitle);
		IUse.jsonData['options'].forEach( function (value) {
			options.push(value);
		});
		singleLines.push(options);
		
		if (IUse.graphDatalines.length == 0) {
			IUse.calculateGraphDatalines();
		}
		
		IUse.graphDatalines.forEach( function (row) {
			var newRow = [];
			row.forEach( function (cell)  {
				if ( cell == "-" ) {
					cell = 0;
				}
				newRow.push(cell);
			});
			singleLines.push(newRow);
		});
		
		//singleLines.push(datalines);
		IUse.singleColumnDataArray = singleLines.slice();				
	},
        
    /**
     * @desc Some charts require singlecolumn JSON data for correct display
     * @name calculateMultiColumn
     * @return void
     */   
	calculateSingleColumn: function(tableIndex) {

		if (IUse.graphDatalines.length == 0) {
			IUse.calculateGraphDatalines();
		}
		
		IUse.tableIndex = tableIndex || (IUse.jsonData['options'].length);
		
		var singleLines = [];

		/**
		 * TableIndex - 2 because the options array have two less columns than the 
		 * data 
		 */
		singleLines.push([IUse.tableTitle, IUse.jsonData['options'][IUse.tableIndex-1]]);
		IUse.graphDatalines.forEach ( function (row) {
			//console.log(row)
			if (row[IUse.tableIndex] != "-") {
				rowArray = new Array();
				rowArray.push(row[0]);
				
				if ( Countries.names[row[0]] != undefined && IUse.minValue == 0 && IUse.maxValue == 0 ) 
					IUse.maxValue = IUse.minValue = row[IUse.tableIndex];
				
				if ( Countries.names[row[0]] != undefined && (row[IUse.tableIndex] < IUse.minValue || IUse.minValue == "-")) 
					IUse.minValue =  row[IUse.tableIndex];
					//console.log(row[IUse.tableIndex], IUse.minValue)
				if ( Countries.names[row[0]] != undefined && (row[IUse.tableIndex] > IUse.maxValue  || IUse.maxValue == "-"))
					IUse.maxValue =  row[IUse.tableIndex]; 
				
				rowArray.push(row[IUse.tableIndex]);
				
				singleLines.push(rowArray);
			}
		});
		//console.log(IUse.maxValue, IUse.minValue);
		IUse.singleColumnDataArray = singleLines.slice();
	},
     
    /**
     * @todo Could be designed to set another field curently it sets singleColumnDataArray  
     * @desc Tree maps require special multicolumn JSON data for correct display
     * @name calculateTreemapColumn
     * @param tableIndexOne
     * @param tableIndexTwo
     * @return void
     */        
	calculateTreemapColumn: function(tableIndexOne, tableIndexTwo) {

		if (IUse.graphDatalines.length == 0) {
			IUse.calculateGraphDatalines();
		}

		IUse.tableIndex = tableIndexOne || (IUse.jsonData['options'].length);
		IUse.tableTreeIndex = tableIndexTwo ||  (IUse.tableIndex + 1);
		if ( IUse.graphDatalines[0][IUse.tableTreeIndex] == undefined ) {
			IUse.tableTreeIndex = IUse.tableIndex - 1;
			if ( IUse.graphDatalines[0][IUse.tableTreeIndex] == undefined ) {
				IUse.tableTreeIndex = IUse.tableIndex ;	
			}		
		}
		
		var singleLines = [];

		/**
		 * TableIndex - 2 because the options array have two less columns than the 
		 * data 
		 */

		singleLines.push([IUse.tableTitle, "Parent", IUse.jsonData['options'][IUse.tableIndex-1], IUse.jsonData['options'][IUse.tableTreeIndex-1]]);
		singleLines.push(['Global', null, 0, 0]);
		IUse.graphDatalines.forEach ( function (row) {
            //console.log("Row added");
			rowArray = new Array();
			rowArray.push(row[0]);
			rowArray.push("Global");
			rowArray.push(row[IUse.tableIndex]);
			rowArray.push(row[IUse.tableTreeIndex]);

			singleLines.push(rowArray);
		});
		
		IUse.singleColumnDataArray = singleLines.slice();
		//console.log(IUse.singleColumnDataArray);
	},

    /**
     * @desc function is called when a display needs to be recalculated 
     * @return void
     */
	recalculateDisplay: function() {
		if (IUse.displayType == 'graph') {
			IUse.recalculateGraphDisplay();
		} else if (IUse.displayType == 'earth') {
			IUse.recalculateEarthDisplay();
		} else {
			IUse.recalculateMapDisplay();
		}
		//IUse.buildHtml(IUse.displayType);
	},

    /**
     * @desc function is called if a Map display needs to be recalculated 
     * @return void
     */
	recalculateMapDisplay: function() {
		IUse.colors = [];
		//var values = jQuery("input[name='values[]']");
		var columnIndex = jQuery("select[name='chooseColumn']").val();
		var colors = jQuery("input[name='colors[]']");
		
		colors.each( function (){
			IUse.colors.push(jQuery(this).val());	
		});
				
		IUse.calculateSingleColumn(columnIndex);
		jQuery("input[name='valueMin']").val(IUse.minValue);
		jQuery("input[name='valueMax']").val(IUse.maxValue);
		drawVisualization();
	}, 

    /**
     * @desc function is called if a Earth display needs to be recalculated 
     * @return void
     */
	recalculateEarthDisplay: function() {
		IUse.colors = [];
		//var values = jQuery("input[name='values[]']");
		var columnIndex = jQuery("select[name='chooseColumn']").val();
		var colors = jQuery("input[name='colors[]']");
		
		colors.each( function (){
			IUse.colors.push(jQuery(this).val());	
		});
        KML.colorMin = IUse.colors[0];
        KML.colorMax = IUse.colors[1];
        //console.log(IUse.colors, colors, "Test");
		IUse.calculateSingleColumn(columnIndex);
		jQuery("input[name='valueMin']").val(IUse.minValue);
		jQuery("input[name='valueMax']").val(IUse.maxValue);
		RemoveAllFeatures();
		drawThreeD(KML.ge);
	}, 
    
    /**
     * @desc function is called if a Graph display needs to be recalculated 
     * @return void
     */
	recalculateGraphDisplay: function() {
		//if (IUse.chartType != jQuery("select[name='chooseGraph']").val())
			
		IUse.chartType = jQuery("select[name='chooseGraph']").val();
		var columnIndex = jQuery("select[name='chooseColumn']").val();

		if (IUse.graphTypes[IUse.chartType]['singleColumnDataArray'] == 1) {		
			IUse.calculateSingleColumn(columnIndex);
		} else if (IUse.graphTypes[IUse.chartType]['singleColumnDataArray'] == 2) {	
			var columnTreeIndex = jQuery("select[name='chooseTreeColumn']").val();
			IUse.calculateTreemapColumn(columnIndex, columnTreeIndex);
		} else {
			IUse.calculateMultiColumn();
		}

		if (IUse.graphTypes[IUse.chartType]['transponse'] == 1) {		
			IUse.singleColumnDataArray = IUse.transponseArray(IUse.singleColumnDataArray);
		} 
		//console.log(IUse.singleColumnDataArray);
		drawVisualization();
	}, 
	
    /**
     * @desc builds management form at top of display graph
     * @param displayType
     * @return void
     */	
	buildHtml: function(displayType) {
		var postFieldId = jQuery('#postfield');
		var submitFieldId = jQuery('#submitfield');
		var methodName = displayType+'Html';
		postFieldId.html("");
		submitFieldId.html("");
		IUse[methodName](postFieldId, submitFieldId);
	},

    /**
     * @desc orders the management form at top of display graph graphHtml
     * @param postFieldId
     * @param submitFieldId
     * @return void
     */
	graphHtml: function(postFieldId, submitFieldId) {
		postFieldId.append(IUse.addSelectGraph());
		//console.log(IUse.chartType, IUse.graphTypes[IUse.chartType]['chooseColumn']);
		if (IUse.graphTypes[IUse.chartType]['chooseColumn'] == 1) {
			postFieldId.append(IUse.addSelectColumn("chooseColumn", IUse.tableIndex));
			if (IUse.chartType == "TreeMap") 
				postFieldId.append(IUse.addSelectColumn("chooseTreeColumn", IUse.tableTreeIndex));
		} 
		submitFieldId.append(IUse.addSubmit());
		submitFieldId.append(IUse.addPrint());
	},

    /**
     * @desc orders the management form at top of display graph mapHtml
     * @param postFieldId
     * @param submitFieldId
     * @return void
     */
	mapHtml: function(postFieldId, submitFieldId) {
		postFieldId.append(IUse.addSelectColumn("chooseColumn", IUse.tableIndex));
		postFieldId.append(" value:");
		postFieldId.append(IUse.addValue(IUse.minValue, 'valueMin'));
		postFieldId.append(" color:");
		postFieldId.append(IUse.addColorChooserHtml('picker1',IUse.colors[0]));
		postFieldId.append(" value:");
		postFieldId.append(IUse.addValue(IUse.maxValue, 'valueMax'));
		postFieldId.append(" color:");
		postFieldId.append(IUse.addColorChooserHtml('picker2',IUse.colors[1]));
		submitFieldId.append(IUse.addSubmit());
		submitFieldId.append(IUse.addPrint());
	},
    
    /**
     * @desc orders the management form at top of display graph earthHtml
     * @param postFieldId
     * @param submitFieldId
     * @return void
     */
	earthHtml: function(postFieldId, submitFieldId) {
		postFieldId.append(IUse.addSelectColumn("chooseColumn", IUse.tableIndex));
		postFieldId.append(" value:");
		postFieldId.append(IUse.addValue(IUse.minValue, 'valueMin'));
		postFieldId.append(" color:");
		postFieldId.append(IUse.addColorChooserHtml('picker1',IUse.colors[0]));
		postFieldId.append(" value:");
		postFieldId.append(IUse.addValue(IUse.maxValue, 'valueMax'));
		postFieldId.append(" color:");
		postFieldId.append(IUse.addColorChooserHtml('picker2',IUse.colors[1]));
		submitFieldId.append(IUse.addSubmit());
	},

    /**
     * @desc onclick executes a given function
     * @param value
     * @param onclick
     * @param addValue
     * @return button jQquery HTML object
     */
	addMainButton: function( value, onclick, addValue ) {
		var inputAttr = {
				//'href' : '#' +  value.replace(' ', '-') ,
				'class':'classname',
				'type':'button', 
				'onclick' : onclick, 
				'value' : value
		};
		var input = jQuery('<input>');
		input.attr(inputAttr);
		input.append(value);
		return input;
	},

    /**
     * @desc adds submit button
     * @return submit jQquery HTML object
     */
	addSubmit: function() {
		var inputAttr = {
				'type':'button', 
				'name' : name,
				'onclick' : 'IUse.recalculateDisplay()', 
				'value' : 'Submit'
			};
		var inputStyle = {
			'margin-left':'3px',
			'padding':0,
			'border':0,
			'width':'40px',
			'cursor':'pointer'
		};
		var input = jQuery('<input>');
		input.attr(inputAttr);
		input.css(inputStyle);
		return input;
	},
    
    /**
     * @desc Creates an jQquery HTML dropdown menu
     * @name addSelectColumn 
     * @param columnName - select name
     * @param columnIndex - identify selected option
     * @return select jQquery HTML object 
     */			
	addSelectColumn: function(columnName, columnIndex) {
		var selectAttr = {
			'name':columnName
		};
		var selectColumn = jQuery("<select>");
		selectColumn.attr(selectAttr);
		var count = 1;
		var selectColumnOption;
		IUse.jsonData['options'].forEach( function(option) {
			selectColumnOption = jQuery("<option>");
			selectColumnOption.attr({'value':count});
			//console.log(IUse.tableIndex);
			if (count == columnIndex) {
				selectColumnOption.attr({'selected':'selected'});
			}
			selectColumnOption.html(option);
			selectColumn.append(selectColumnOption);
			count++;
		});		
		return selectColumn;
	},
    
    /**
     * @desc Creates an jQquery HTML dropdown menu
     * @name addSelectGraph 
     * @return sele jQquery HTML object 
     */		
	addSelectGraph: function() {
		var selectAttr = {
			'name':'chooseGraph'
		};
		var selectColumn = jQuery("<select>");
		selectColumn.attr(selectAttr);
		var count = 1;
		var selectColumnOption;
		Object.keys(IUse.graphTypes).forEach( function(option) {
			selectColumnOption = jQuery("<option>");
			selectColumnOption.attr({'value':option});
			if (option == IUse.chartType) {
			  selectColumnOption.attr({'selected':'selected'});	
			}
			selectColumnOption.html(option);
			selectColumn.append(selectColumnOption);
			count++;
		});		
        selectColumn.on( "change", function() {
          IUse.chartType = jQuery(this).val();
          IUse.buildHtml(IUse.displayType);
        });
		return selectColumn;		
	},
    
    /**
     * @desc Creates an jQquery HTML object input text form element - for color management
     * @param id 
     * @param color
     * @name addColorChooser 
     * @return input jQquery HTML object 
     */	
	addColorChooser: function(id, color) {
		var inputAttr = {
			'type':'color', 
			'id':id,
			'name':'colors[]',
			'value':color 
		};
		var inputStyle = { 
			'margin-left':'3px',
			'padding':0,
			'border':0,
			'width':'35px',
			'border-right':'20px solid #'+color,	
		};
		var input = jQuery("<input>");
		input.attr(inputAttr);
		input.css(inputStyle);
		input.on('change', { elementId: id }, IUse.changeColorChooserHtml);
		return input;				
	},
    
    /**
     * @desc Creates an jQquery HTML object input text form element 
     * @name addValue 
     * @return input jQquery HTML object 
     */
	addColorChooserHtml: function(id, color) {
		var inputAttr = {
			'type':'color', 
			'id':id,
			'font-size': '1em',
			'name':'colors[]',
			'value':color 
		};
		var inputStyle = { 
			'margin-left':'3px',
			'padding':0,
			'border':0,
			'font-size': '1em',
			'width':'35px',
			'border-right':'20px solid '+color,	
		};
		var input = jQuery("<input>");
		input.attr(inputAttr);
		input.css(inputStyle);
		input.on('change', { elementId: id }, IUse.changeColorChooserHtml);
		return input;				
	},
	
    /**
     * @desc Changes the border of a color chooser 
     * @name changeColorChooserHtml 
     * @param event mouse event
     * @return void
     */
	changeColorChooserHtml: function(event) {
		var input = jQuery("#"+event.data.elementId);
		var inputStyle = { 
			'margin-left':'3px',
			'padding':0,
			'border':0,
			'font-size': '1em',
			'width':'35px', 
			'border-right':'20px solid '+input.val(),	
		};
		input.css(inputStyle);
	},

    /**
     * @desc Creates an jQquery HTML object input text form element 
     * @name addValue 
     * @return input jQquery HTML object 
     */
	addValue: function(value, name) {
		var inputAttr = {
				'type':'text', 
				'disabled':'disabled',
				'name' : name,
				'value' : value
			};
		var inputStyle = {
			'margin-left':'3px',
			'padding':0,
			'border':0,
			'font-size': '1em',
			'width':'20px'
		};
		var input = jQuery('<input>');
		input.attr(inputAttr);
		input.css(inputStyle);
		return input;
	},
	
    /**
     * @desc Creates an jQquery HTML object print button
     * @name addPrint
     * @return input jQquery HTML object 
     */
	addPrint: function() {
		var inputAttr = {
				'type':'button', 
				'name' : 'print',
				'onclick' : 'window.print();', 
				'value' : 'print'
			};
		var inputStyle = {
			'margin-left':'3px',
			'padding':0,
			'border':0,
			'cursor':'pointer',	
			'width':'20px'
		};
		var input = jQuery('<input>');
		input.attr(inputAttr);
		input.css(inputStyle);
		return input;		
	} 
} 