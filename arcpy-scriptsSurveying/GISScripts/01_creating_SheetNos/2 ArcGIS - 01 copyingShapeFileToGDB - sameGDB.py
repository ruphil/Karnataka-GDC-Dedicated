import arcpy

directory = "D:/outGIS/"

print("starting")

gdbName = "GeoDB-SheetNos-Karnataka.gdb"
gdbPath = directory + gdbName

outGDB = arcpy.CreateFileGDB_management(directory, gdbName)
arcpy.CopyFeatures_management("D:/inGIS/KarnState/stateWGS84.shp", gdbPath + "/stateWGS84")

print("done")

