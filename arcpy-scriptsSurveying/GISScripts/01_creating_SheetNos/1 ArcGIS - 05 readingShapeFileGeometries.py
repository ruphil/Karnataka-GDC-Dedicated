import arcpy

shpFile = "D:/inGIS/KarnState/stateWGS84.shp"

shpClass = arcpy.mapping.Layer(shpFile)

##for row in arcpy.da.SearchCursor(shpClass, ["OID@", "SHAPE@"]):
##    ID = row[0]
##    geom = row[1]
##    print(ID, geom)

karnStateGeom = arcpy.da.SearchCursor(shpClass, ["OID@", "SHAPE@"]).next()[1]
print(karnStateGeom)
