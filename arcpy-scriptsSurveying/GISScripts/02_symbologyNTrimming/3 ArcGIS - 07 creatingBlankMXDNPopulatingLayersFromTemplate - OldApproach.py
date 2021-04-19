import arcpy
import pickle

inDir = "D:\\inGIS\\"
outDir = "D:\\outGIS\\"

gdb = "NTDBV2.gdb"
gdbPath = inDir + gdb

pickleAvailableAssumption = True
try:
    pickleFile = open("D:\\outGIS\\pickleFile.pickle", 'rb')      
    featureClasses = pickle.load(pickleFile) 
    pickleFile.close()
except:
    pickleAvailableAssumption = False

print("Pickle Available: ", pickleAvailableAssumption)
if pickleAvailableAssumption == False:
    arcpy.env.workspace = gdbPath
    datasetList = arcpy.ListDatasets("*", "Feature")
    featureClasses = []
    for dataset in datasetList:
        dsPath = gdbPath + "\\" + dataset
        arcpy.env.workspace = dsPath
        fcList = arcpy.ListFeatureClasses()
        for fc in fcList:
            fcPath = gdbPath + "\\" + dataset + "\\" + fc
            fcdesc = arcpy.Describe(fcPath)
            fcName = fc
            fcType = fcdesc.shapeType
            featureClasses.append([fcName, fcType, fcPath, dataset, dsPath])

    pickleFile = open("D:\\outGIS\\pickleFile.pickle", "wb")
    pickle.dump(featureClasses, pickleFile)
    pickleFile.close()

##print(featureClasses)
print(len(featureClasses))

blankMXD = inDir + "blank.mxd"
templateMXD = inDir + "template.mxd"
newMXD = outDir + "newMXD.mxd"

blankmxd = arcpy.mapping.MapDocument(blankMXD)
blankmxd.saveACopy(newMXD)

newmxd = arcpy.mapping.MapDocument(newMXD)
newmxd_df = arcpy.mapping.ListDataFrames(newmxd)[0]
##print(newmxd_df)

templatemxd = arcpy.mapping.MapDocument(templateMXD)

newlayersInfo = []
for tlyr in arcpy.mapping.ListLayers(templatemxd):
    tlyr_name = tlyr.name
    for fClass in featureClasses:
        if tlyr_name == fClass[0]:
            print(tlyr_name, fClass[3])
##            tlyr.findAndReplaceWorkspacePath("", gdbPath, False)
##            tlyr.replaceDataSource(fClass[2], "FILEGDB_WORKSPACE", fClass[3], False)
            newlayersInfo.append([tlyr_name, fClass[3], fClass[2]])
            arcpy.mapping.AddLayer(newmxd_df, tlyr)

##newmxd.findAndReplaceWorkspacePaths("", gdbPath, False)
newmxd.save()

for nlyr in arcpy.mapping.ListLayers(newmxd):
    for info in newlayersInfo:
        if nlyr.name == info[0]:
##            arcpy.mapping.RemoveLayer(newmxd_df, nlyr)

            nlyr.replaceDataSource(gdbPath, "FILEGDB_WORKSPACE", info[1], True)
##            arcpy.mapping.AddLayer(newmxd_df, nlyr)
##            print(nlyr.supports("dataSource"))
            print(info[2], info[1])
            print(nlyr, nlyr.dataSource, nlyr.datasetName)

newmxd.save()

del blankmxd
del newmxd
del templatemxd

print("done")

