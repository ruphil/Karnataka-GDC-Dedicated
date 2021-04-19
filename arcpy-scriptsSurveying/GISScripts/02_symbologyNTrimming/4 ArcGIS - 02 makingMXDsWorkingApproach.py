import arcpy
import pickle

inDir = "D:/inGIS/"
outDir = "D:/outGIS/"

gdb = "NTDBV2.gdb"
newMXDName = "newMXD.mxd"

pickleAvailableAssumption = True
featureClasses = []
try:
    pickleFile = open("D:/outGIS/pickleFile.pickle", 'rb')
    featureClasses = pickle.load(pickleFile)
    pickleFile.close()
except:
    pickleAvailableAssumption = False

print("Pickle Available: ", pickleAvailableAssumption)
print("")
gdbPath = inDir + gdb
if pickleAvailableAssumption == False:
    arcpy.env.workspace = gdbPath
    datasetList = arcpy.ListDatasets("*", "Feature")
    for dataset in datasetList:
        dsPath = gdbPath + "/" + dataset
        arcpy.env.workspace = dsPath
        fcList = arcpy.ListFeatureClasses()
        for fc in fcList:
            featureClasses.append(fc)

    pickleFile = open("D:/outGIS/pickleFile.pickle", "wb")
    pickle.dump(featureClasses, pickleFile)
    pickleFile.close()



blankMXD = inDir + "blank.mxd"
templateMXD = inDir + "template.mxd"
newMXD = outDir + newMXDName

blankmxd = arcpy.mapping.MapDocument(blankMXD)
blankmxd.saveACopy(newMXD)

newmxd = arcpy.mapping.MapDocument(newMXD)
newmxd_df = arcpy.mapping.ListDataFrames(newmxd)[0]

templatemxd = arcpy.mapping.MapDocument(templateMXD)

def matchSymbology(tlyr_name, fClass):
    commonChars = set((fClass).lower()) & set((tlyr_name).lower())
    percentMatch = float(len(commonChars)) / float(len(fClass))
    if  percentMatch >= 0.75:
        return True
##    if tlyr_name == fClass:


matchedFeaturesCount = 0
for tlyr in arcpy.mapping.ListLayers(templatemxd):
    tlyr_name = tlyr.name
    for fClass in featureClasses:
        if matchSymbology(tlyr_name, fClass):
            matchedFeaturesCount = matchedFeaturesCount + 1
            print(tlyr_name, fClass)
            tlyr.replaceDataSource(gdbPath, "FILEGDB_WORKSPACE", fClass, True)
            arcpy.mapping.AddLayer(newmxd_df, tlyr)

newmxd.save()

print("")
print("Total Feature Classes: ", len(featureClasses))
print("Matched Feature Classes: ", matchedFeaturesCount)

del blankmxd
del newmxd
del templatemxd

print("done")

