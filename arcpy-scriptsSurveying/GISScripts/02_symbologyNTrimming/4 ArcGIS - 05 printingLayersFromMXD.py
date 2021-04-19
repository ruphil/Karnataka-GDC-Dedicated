import arcpy

inDir = "D:/inGIS/"

templateMXD = inDir + "template.mxd"
templatemxd = arcpy.mapping.MapDocument(templateMXD)
templatelyrs = arcpy.mapping.ListLayers(templatemxd)

for tlyr in templatelyrs:
    print(tlyr.name)
    
del templatemxd

print("done")
