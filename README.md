iusestatisticsforeducation
==========================

Project website: http://www.i-use.eu/

I-Use Statistics for Education

Configuration file Countries.js explained.

The configuration consists of two main parts. 
-	Borders 
-	Names

Names:

Here we define the names we use. Key, value representations. 
Key -  is a generic unique name, example "Greece". So when a user inputs "Greece" in his datatable the application tries to locate which values it should get for a KML border. This is done by looking at the value for the given key.

Value - is a short abreviation, example "GR". This value corresponds to a border definition in the borders section. 

To anticipate input errors, the system is designed to have different keys with the same value. Example:
....
"Greece":"GR",
"Greace":"GR",
...

This way we can tackle typos. So if a user puts a misspelled "Greace" in his table he would get the borders for "GR" 

Borders 
Here we define the KML borders/shapes of the geographic region. Each entry contains of an key and an array of borders.

"GR" : [ 
["border", " xcoor0,ycoor0,0  xcoor1,ycoor1,0 .....  xcoorN,ycoorN,0 "], 
["border", " xcoor0,ycoor0,0  xcoor1,ycoor1,0 .....  xcoorN,ycoorN,0 "],
["border", " xcoor0,ycoor0,0  xcoor1,ycoor1,0 .....  xcoorN,ycoorN,0 "],
["innerborder", " xcoor0,ycoor0,0  xcoor1,ycoor1,0 .....  xcoorN,ycoorN,0 "],
 ]

Where "border" is  points that define a shape (shapes might consist of more than one area). The "innerborder" is again collection of points but it defines an area to retracted from the main shape.

Each points consists of the following three properties: 
  - longitude xcoor 0...N;
  - and latitude ycoor 0...N;
  - and height which is always 0 in the configuration.  

Each point property is separated from the other with a comma. 

Each point (collection of three properties - longitude,latitude,height) is separated by a "single space character".

To add a new point

add a new key:value pair to the names section

....
"New area":"NEWAR",
....

add the borders for the "NEWAR" value 
....
"NEWAR" : [ 
["border", " xcoor0,ycoor0,0  xcoor1,ycoor1,0 .....  xcoorN,ycoorN,0 "], 
 ]
....

In this simple example we assume that the shape consists of single area.
