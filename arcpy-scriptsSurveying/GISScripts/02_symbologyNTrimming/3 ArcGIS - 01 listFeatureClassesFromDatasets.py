import arcpy

directory = "D:/inGIS/"

gdb = "FINAL_SDMS.gdb"

gdbPath = directory + gdb
arcpy.env.workspace = gdbPath

datasetList = arcpy.ListDatasets("*", "Feature")

print("Datasets:")
totalDatasets = 0
totalFeatures = 0
for dataset in datasetList:
    totalDatasets = totalDatasets + 1
    arcpy.env.workspace = gdbPath + "/" + dataset
    fcList = arcpy.ListFeatureClasses()
    totalFeatureClasses = 0
    for fc in fcList:
        totalFeatureClasses = totalFeatureClasses + 1
        totalFeatures = totalFeatures + 1

    print(dataset, ":", totalFeatureClasses)

print("Total Datasets:", totalDatasets)
print("Total Feature Classes:", totalFeatures)
