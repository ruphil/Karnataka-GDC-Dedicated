import arcpy

import os

directory = "D:\outGIS\poly"
os.mkdir(directory)

outShp = arcpy.CreateFeatureclass_management(directory, "polygons.shp", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))

# Create a polygon geometry
array = arcpy.Array([arcpy.Point(77.446641, 13.032519),
                     arcpy.Point(77.755632, 13.107431),
                     arcpy.Point(77.681474, 12.910739),
                     arcpy.Point(77.391710, 12.841123)
                     ])
polygon = arcpy.Polygon(array)

# Open an InsertCursor and insert the new geometry
cursor = arcpy.da.InsertCursor(outShp, ['SHAPE@'])
cursor.insertRow([polygon])

# Delete cursor object
del cursor
