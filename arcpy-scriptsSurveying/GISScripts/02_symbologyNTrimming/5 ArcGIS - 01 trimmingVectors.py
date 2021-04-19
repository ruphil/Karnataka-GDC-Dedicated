import arcpy

print("starting")

in_features = r"D:\outGIS\output.gdb\Line"
clip_features = r"D:\outGIS\GeoDB-SheetNos-Karnataka Upto50K.gdb\sheetNos50K"
out_feature_class = r"D:\outGIS\output.gdb\linesout"

expression = "SheetNo = 'D43K11'"
print(expression)

sheetPolygon = arcpy.da.SearchCursor(clip_features, ["SHAPE@", "SheetNo"], where_clause=expression).next()
sheetGeom = sheetPolygon[0]
sheetNo = sheetPolygon[1]
print(sheetGeom)
print(sheetNo)

arcpy.Clip_analysis(in_features, sheetGeom, out_feature_class)

print("done")
