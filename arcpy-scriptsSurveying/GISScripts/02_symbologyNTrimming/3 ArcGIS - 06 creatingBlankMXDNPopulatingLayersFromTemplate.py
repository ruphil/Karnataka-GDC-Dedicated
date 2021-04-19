import arcpy
import pickle

inDir = "D:/inGIS/"
outDir = "D:/outGIS/"

layersDir = outDir + "layers/"

gdb = "NTDBV2.gdb"
gdbPath = inDir + gdb

pickleAvailableAssumption = True
try:
    pickleFile = open("D:/outGIS/pickleFile.pickle", 'rb')      
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
        dsPath = gdbPath + "/" + dataset
        arcpy.env.workspace = dsPath
        fcList = arcpy.ListFeatureClasses()
        for fc in fcList:
            fcPath = gdbPath + "/" + dataset + "/" + fc
            fcdesc = arcpy.Describe(fcPath)
            fcName = fc
            fcType = fcdesc.shapeType
            featureClasses.append([fcName, fcType, fcPath, dataset, dsPath])

    pickleFile = open("D:/outGIS/pickleFile.pickle", "wb")
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
templatelyrs = arcpy.mapping.ListLayers(templatemxd)

for tlyr in templatelyrs:
    tlyr_name = tlyr.name
    for fClass in featureClasses:
        if tlyr_name == fClass[0]:
            print(tlyr_name)
            arcpy.MakeFeatureLayer_management(fClass[2], tlyr_name)
            newlayer = arcpy.mapping.Layer(tlyr_name)
            tlyrPath = layersDir + tlyr_name + ".lyr"
            tlyr.saveACopy(tlyrPath)

            arcpy.mapping.AddLayer(newmxd_df, newlayer)
##            arcpy.mapping.UpdateLayer(newmxd_df, tlyr, newlayer, symbology_only = True)
            arcpy.ApplySymbologyFromLayer_management(newlayer, tlyrPath)
            
newmxd.save()    

del blankmxd
del newmxd
del templatemxd

print("done")

