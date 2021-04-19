import arcpy
from datetime import datetime

directory = "D:/outGIS/"

now = datetime.now()
gdbWithTime = now.strftime("GeoDB-%H-%M-%S.gdb")

outGDB = arcpy.CreateFileGDB_management(directory, gdbWithTime)
outFeatureClass = arcpy.CreateFeatureclass_management(outGDB, "polygons", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))

array = arcpy.Array([arcpy.Point(76, 12),
                     arcpy.Point(76, 14),
                     arcpy.Point(78, 14),
                     arcpy.Point(78, 12)
                     ])
polygon1 = arcpy.Polygon(array)

# Open an InsertCursor and insert the new geometry
cursor = arcpy.da.InsertCursor(outFeatureClass, ['SHAPE@'])
cursor.insertRow([polygon1])

array = arcpy.Array([arcpy.Point(77, 13),
                     arcpy.Point(77, 15),
                     arcpy.Point(79, 15),
                     arcpy.Point(79, 13)
                     ])
polygon2 = arcpy.Polygon(array)

# Open an InsertCursor and insert the new geometry
cursor = arcpy.da.InsertCursor(outFeatureClass, ['SHAPE@'])
cursor.insertRow([polygon2])

# Delete cursor object
del cursor

g = arcpy.Geometry()
gList = arcpy.CopyFeatures_management(directory + gdbWithTime + "/polygons", g)

for feat in gList:
    print(feat)

geom1 = gList[0]
geom2 = gList[1]

print(geom1.overlaps(geom2))

shpFile = "D:/inGIS/KarnState/stateWGS84.shp"
stateGeomList = arcpy.CopyFeatures_management(shpFile, g)
print(stateGeomList)
