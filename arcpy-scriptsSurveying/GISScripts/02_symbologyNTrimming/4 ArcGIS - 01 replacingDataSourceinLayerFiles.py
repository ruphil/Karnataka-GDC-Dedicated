import arcpy

lyr = arcpy.mapping.Layer(r"D:\outGIS\layers\WELL.lyr")
print(lyr, lyr.dataSource, lyr.datasetName)

##lyr.name = "WELL"
lyr.replaceDataSource(r"D:\inGIS\NTDBV2.gdb", "FILEGDB_WORKSPACE", "CANAL_BANK", True)

print(lyr, lyr.dataSource, lyr.datasetName)

lyr.save()
