import arcpy
from datetime import datetime

directory = "D:/outGIS/"

now = datetime.now()
gdbWithTime = now.strftime("GeoDB-%H-%M-%S.gdb")

outGDB = arcpy.CreateFileGDB_management(directory, gdbWithTime)
outFeatureClass = arcpy.CreateFeatureclass_management(outGDB, "polygons", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))

array = arcpy.Array([arcpy.Point(77.446641, 13.032519),
                     arcpy.Point(77.755632, 13.107431),
                     arcpy.Point(77.681474, 12.910739),
                     arcpy.Point(77.391710, 12.841123)
                     ])
polygon = arcpy.Polygon(array)

# Open an InsertCursor and insert the new geometry
cursor = arcpy.da.InsertCursor(outFeatureClass, ['SHAPE@'])
cursor.insertRow([polygon])

# Delete cursor object
del cursor
