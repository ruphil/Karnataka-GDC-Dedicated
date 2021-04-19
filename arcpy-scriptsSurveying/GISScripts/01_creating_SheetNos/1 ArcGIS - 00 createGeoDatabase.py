import arcpy
from datetime import datetime

now = datetime.now()

gdbWithTime = now.strftime("GeoDB-%H-%M-%S.gdb")

directory = "D:/outGIS"

arcpy.CreateFileGDB_management(directory, gdbWithTime)

