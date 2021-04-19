import arcpy
from os.path import expanduser

##This has failed

inDir = "D:/inGIS/"
outDir = "D:/outGIS/"

newmxdPath = outDir + "sheetNo.mxd"


home = expanduser("~")

blankmxtPath = "C:\\Users\\theEnder\\AppData\\Roaming\\ESRI\\Desktop10.5\\ArcMap\\Templates\\Normal.mxt"
print(blankmxtPath)
print(newmxdPath)

blankmxd = arcpy.mapping.MapDocument(blankmxtPath)
blankmxd.saveACopy(newmxdPath)
print("done")


