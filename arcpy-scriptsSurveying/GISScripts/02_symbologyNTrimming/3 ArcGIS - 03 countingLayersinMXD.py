import arcpy

inDir = "D:/inGIS/"
outDir = "D:/outGIS/layers/"

mxd1 = "sdms_style10.5.mxd"
mxd2 = "sdms_style10.0.mxd"

mxd1 = arcpy.mapping.MapDocument(inDir + mxd1)
layers1 = arcpy.mapping.ListLayers(mxd1)

mxd2 = arcpy.mapping.MapDocument(inDir + mxd2)
layers2 = arcpy.mapping.ListLayers(mxd2)

print("Total Layers 1: ", len(layers1))
print("Total Layers 2: ", len(layers2))

for i in range(len(layers1)):
    print(layers1[i], layers2[i])

del mxd1
del mxd2

