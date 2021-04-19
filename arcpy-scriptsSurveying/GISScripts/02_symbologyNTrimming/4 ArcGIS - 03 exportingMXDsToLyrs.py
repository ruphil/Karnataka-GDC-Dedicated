import arcpy
import pickle

print("starting")

inDir = "D:/inGIS/"
outDir = "D:/outGIS/"
templateLayersPath = outDir + "templateLayers/"

templatemxd = arcpy.mapping.MapDocument(inDir + "template.mxd")

totalLayers = 0
for tlyr in arcpy.mapping.ListLayers(templatemxd):
   tlyr.saveACopy(templateLayersPath + tlyr.name + ".lyr")
   totalLayers = totalLayers + 1

print("Total Layers Saved: ", totalLayers)

del templatemxd

print("done")

