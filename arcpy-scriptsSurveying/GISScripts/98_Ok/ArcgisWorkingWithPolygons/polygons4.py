import arcpy
arcpy.env.overwriteOutput = True

inGDBPath = "D:/GIS/geodatabase.gdb/"
inFCName = "PROPERTY_BOUNDARY"

copyPropertyBoundary = arcpy.CreateFeatureclass_management("in_memory", "copyPropertyBoundary", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))
arcpy.CopyFeatures_management(inGDBPath + inFCName, copyPropertyBoundary)

with arcpy.da.UpdateCursor(copyPropertyBoundary, ["SHAPE@", "Survey_Nos"]) as cursor:
    for row in cursor:
        feat_geom_cursor = row[0].projectAs(arcpy.SpatialReference(32643))
        feat_part = feat_geom_cursor[0]
        
        vertices_touch = []
        pt_array = []
        for pnt in feat_part:
            point = arcpy.Point()
            point.X = pnt.X
            point.Y = pnt.Y

            pointGeometry = arcpy.PointGeometry(point).projectAs(arcpy.SpatialReference(32643))
            touches = 0
            for feature_search in arcpy.da.SearchCursor(inGDBPath + inFCName, ["SHAPE@"]):
                feat_geom_search = feature_search[0].projectAs(arcpy.SpatialReference(32643))
                if (pointGeometry.touches(feat_geom_search)):
                    touches += 1

            vertices_touch.append(touches)
            if (touches > 2):
                pt_array.append(point)
        
        if len(pt_array) < 3:
            continue
        
        polygeom = arcpy.Polygon(arcpy.Array(pt_array), arcpy.SpatialReference(32643))
        print(vertices_touch, polygeom)
        
        row[0] = polygeom
        row[1] = "updated"

        cursor.updateRow(row)

        break

arcpy.CopyFeatures_management(copyPropertyBoundary, inGDBPath + "plines")
