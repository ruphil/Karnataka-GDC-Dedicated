import arcpy
import pickle

inDir = "D:/inGIS/"
outDir = "D:/outGIS/"

styleFile = "DSM.style"
stylePath = inDir + styleFile
print(stylePath)

styleItems = arcpy.mapping.ListStyleItems(stylePath, "Marker Symbols")

print(styleItems)
