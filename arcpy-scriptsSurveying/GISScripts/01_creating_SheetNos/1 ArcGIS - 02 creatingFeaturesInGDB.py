import arcpy
from datetime import datetime

directory = "D:/outGIS/"

now = datetime.now()
gdbWithTime = now.strftime("GeoDB-%H-%M-%S.gdb")

outGDB = arcpy.CreateFileGDB_management(directory, gdbWithTime)
arcpy.CreateFeatureclass_management(outGDB, "polygons", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))
