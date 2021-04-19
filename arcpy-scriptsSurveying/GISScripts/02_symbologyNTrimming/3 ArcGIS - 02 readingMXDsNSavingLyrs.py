import arcpy

inDir = "D:/inGIS/"
outDir = "D:/outGIS/layers/"

mxd = "sdms_style10.0.mxd"

mxdPath = inDir + mxd

mxd = arcpy.mapping.MapDocument(mxdPath)
layers = arcpy.mapping.ListLayers(mxd)

for lyr in layers:
##    print(lyr.name)
    lyr.saveACopy(outDir + lyr.name + ".lyr")

##for lyr in layers:
##    print(lyr.symbology)

del mxd

