import arcpy

inDir = "D:/inGIS/"
outDir = "D:/outGIS/"

gdb = "NTDBV2.gdb"
gdbPath = inDir + gdb


arcpy.env.workspace = gdbPath
datasetList = arcpy.ListDatasets("*", "Feature")
featureClasses = []
for dataset in datasetList:
    dsPath = gdbPath + "/" + dataset
    arcpy.env.workspace = dsPath
    fcList = arcpy.ListFeatureClasses()
    for fc in fcList:
        fcPath = gdbPath + "/" + dataset + "/" + fc
        fcdesc = arcpy.Describe(fcPath)
        fcName = fc
        fcType = fcdesc.shapeType
        print(fcName, fcType)

print("done")
