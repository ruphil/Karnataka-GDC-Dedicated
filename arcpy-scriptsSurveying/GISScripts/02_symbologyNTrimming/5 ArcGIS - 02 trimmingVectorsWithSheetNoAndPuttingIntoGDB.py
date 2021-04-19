import arcpy

print("starting")

outDir = r"D:\outGIS"
SheetNo = "D43O10I"
gdbName = SheetNo + ".gdb"
gdbPath = outDir + "\\" + gdbName
print(gdbPath)

arcpy.CreateFileGDB_management(outDir, SheetNo + ".gdb")

in_features_Path = r"D:\inGIS\FEATURE_EXTRACTION\Kundapur_Udupi_Mangalore02_Planimetrics"
arcpy.env.workspace = in_features_Path

clip_features = r"D:\inGIS\GeoDB-SheetNos-Karnataka Upto2K.gdb\sheetNos10K"

expression = "SheetNo = '"+ SheetNo +"'"
print(expression)

sheetPolygon = arcpy.da.SearchCursor(clip_features, ["SHAPE@", "SheetNo"], where_clause=expression).next()
sheetGeom = sheetPolygon[0]
sheetNo = sheetPolygon[1]
print(sheetGeom)
print(sheetNo)

for fc in arcpy.ListFeatureClasses():
    fcName = fc.replace(".shp", "")
##    print(fcName)
    out_feature_class = gdbPath + "\\" + fcName
    try:
        arcpy.Clip_analysis(fc, sheetGeom, out_feature_class)
    except Exception as e:
        print(e)

print("done")
