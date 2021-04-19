import arcpy

inDir = "D:/inGIS/"
outDir = "D:/outGIS/"

template = "template.mxd"
newDoc = outDir + "sheetNo.mxd"

mxdPath = inDir + template

mxd = arcpy.mapping.MapDocument(mxdPath)
mxd.saveACopy(newDoc)

newmxd = arcpy.mapping.MapDocument(newDoc)

df = arcpy.mapping.ListDataFrames(newmxd)[0]
print(df)

del mxd

