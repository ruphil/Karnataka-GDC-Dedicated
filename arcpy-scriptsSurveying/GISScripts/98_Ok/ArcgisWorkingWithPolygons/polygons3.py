import arcpy
arcpy.env.overwriteOutput = True

inGDBPath = "D:/GIS/geodatabase.gdb/"
inFCName = "PROPERTY_BOUNDARY"

simplePolygons = arcpy.CreateFeatureclass_management("in_memory", "simplePolygons", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))
polygonToLine = arcpy.CreateFeatureclass_management("in_memory", "polygonToLine", "POLYLINE", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))
linesAtVertices = arcpy.CreateFeatureclass_management("in_memory", "linesAtVertices", "POLYLINE", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))

arcpy.cartography.SimplifyPolygon(inGDBPath + inFCName, simplePolygons, "WEIGHTED_AREA", 5, 0, "#", "NO_KEEP")
arcpy.PolygonToLine_management(simplePolygons, polygonToLine, "IGNORE_NEIGHBORS")
arcpy.SplitLine_management(polygonToLine, linesAtVertices)

arcpy.CopyFeatures_management(linesAtVertices, inGDBPath + "plines")

