import arcpy
import os

directory = "D:\outGIS\poly"
os.mkdir(directory)

arcpy.CreateFeatureclass_management(directory, "polygons.shp", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))
