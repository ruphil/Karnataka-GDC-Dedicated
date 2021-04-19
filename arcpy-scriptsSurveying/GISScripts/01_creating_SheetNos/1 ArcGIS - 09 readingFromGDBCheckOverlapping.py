import arcpy

arcpy.env.workspace = "D:/outGIS/GeoDB-07-14-41.gdb"

fclist = arcpy.ListFeatureClasses()
fc = fclist[0]

print fc

for feat in arcpy.da.SearchCuror(fc, ["SHAPE@"]):
    print(feat)

##geom1 = arcpy.da.SearchCursor(outFeatureClass, ["SHAPE@"]).next()[0]
##geom2 = arcpy.da.SearchCursor(outFeatureClass, ["SHAPE@"]).next()[0]
##print(geom1.touches(geom2))



