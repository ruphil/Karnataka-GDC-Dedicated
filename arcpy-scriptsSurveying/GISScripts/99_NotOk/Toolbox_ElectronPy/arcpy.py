import arcpy
import sys

# print(arcpy)

# print(2)

print(sys.argv[0])

arcpy.env.workspace = "D:/testGDB/MGP_New.gdb"

fclist = arcpy.ListFeatureClasses()
print(fclist)