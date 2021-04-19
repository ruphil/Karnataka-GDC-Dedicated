import arcpy
import os

# Set workspace (where all the KMLs are)
arcpy.env.workspace = "D:/GIS/kmls"

# Set local variables and location for the consolidated file geodatabase
out_location = "D:/GIS/AllKMLsGDB"
gdb = 'AllKMLLayers.gdb'
gdb_location = os.path.join(out_location, gdb)

# Create the master FileGeodatabase
arcpy.CreateFileGDB_management(out_location, gdb)

# Convert all KMZ and KML files found in the current workspace

# for kmz in arcpy.ListFiles('*.KM*'):
#     print("CONVERTING: {0}".format(os.path.join(arcpy.env.workspace, kmz)))
#     arcpy.KMLToLayer_conversion(kmz, out_location)

# Change the workspace to fGDB location
arcpy.env.workspace = out_location

# Loop through all the FileGeodatabases within the workspace
wks = arcpy.ListWorkspaces('*', 'FileGDB')
# Skip the Master GDB
wks.remove(gdb_location)

for fgdb in wks:  
    # Change the workspace to the current FileGeodatabase
    arcpy.env.workspace = fgdb

    # For every Featureclass inside, copy it to the Master and use the name 
    # from the original fGDB  
    feature_classes = arcpy.ListFeatureClasses('*', '', 'Placemarks')
    for fc in feature_classes:
        fcName = fgdb[fgdb.rfind(os.sep) + 1:-4] + "_" + fc
        print("COPYING: {} FROM: {} WITH FC {}".format(fc, fgdb, fcName))
        fcCopy = os.path.join(fgdb, 'Placemarks', fc)
        arcpy.FeatureClassToFeatureClass_conversion(
            fcCopy, gdb_location, fcName)