import arcpy
import math
arcpy.env.overwriteOutput = True

inGDBPath = "D:/GIS/geodatabase.gdb/"
inFCName = "PROPERTY_BOUNDARY"

base_tolerance_collinearity = 0.1
angle_tolerance = 5

simplePolygons = arcpy.CreateFeatureclass_management("in_memory", "simplePolygons", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))
cursor_simplify = arcpy.da.InsertCursor(simplePolygons, ['SHAPE@'])

def tweakPolygon(poly_feat_geom):
    feat_part = poly_feat_geom[0]

    arcpy_pts_array = []
    simple_pts_array = []
    for pnt in feat_part:
        arcpy_pts_array.append(arcpy.Point(pnt.X, pnt.Y))
        simple_pts_array.append([pnt.X, pnt.Y])

    # print(len(simple_pts_array))
    pts_array_len = len(simple_pts_array)
    for index, _ in enumerate(arcpy_pts_array):
        # angle algorithm
        angleBtw = 45
        
        simplePt1 = simple_pts_array[int((index + 0) % pts_array_len)]
        simplePt2 = simple_pts_array[int((index + 1) % pts_array_len)]
        simplePt3 = simple_pts_array[int((index + 2) % pts_array_len)]

        try:
            m1 = (simplePt1[1] - simplePt2[1]) / (simplePt1[0] - simplePt2[0])
            m2 = (simplePt2[1] - simplePt3[1]) / (simplePt2[0] - simplePt3[0])

            tanTheta = abs((m1 - m2)/(1 + m1 * m2))

            angleBtw = math.degrees(math.atan(tanTheta))
        except:
            pass

        # length algorithm
        arcpt1 = arcpy_pts_array[int((index + 0) % pts_array_len)]
        arcpt2 = arcpy_pts_array[int((index + 1) % pts_array_len)]
        arcpt3 = arcpy_pts_array[int((index + 2) % pts_array_len)]

        lineAB = arcpy.Polyline(arcpy.Array([arcpt1, arcpt2]), arcpy.SpatialReference(32643))
        lineBC = arcpy.Polyline(arcpy.Array([arcpt2, arcpt3]), arcpy.SpatialReference(32643))
        lineAC = arcpy.Polyline(arcpy.Array([arcpt1, arcpt3]), arcpy.SpatialReference(32643))

        cond1 = abs((lineAB.length + lineBC.length) - lineAC.length) < base_tolerance_collinearity
        cond2 = angleBtw < angle_tolerance
        if cond1 and cond2:
            arcpy_pts_array.remove(arcpt2)

            poly_feat_geom_mod = arcpy.Polygon(arcpy.Array(arcpy_pts_array), arcpy.SpatialReference(32643))
            return [True, poly_feat_geom_mod]

        # if index == len(arcpy_pts_array) - 3:
        #     break

    return [False]

total_feat_count = arcpy.GetCount_management(inGDBPath + inFCName)

feat_count = 0
for poly_feat in arcpy.da.SearchCursor(inGDBPath + inFCName, ["SHAPE@"]):
    poly_feat_geom = poly_feat[0].projectAs(arcpy.SpatialReference(32643))

    toTweakPolygonBool = True
    while toTweakPolygonBool:
        result = tweakPolygon(poly_feat_geom)
        toTweakPolygonBool = result[0]

        if(toTweakPolygonBool):
            poly_feat_geom = result[1]

    cursor_simplify.insertRow([poly_feat_geom])
    feat_count += 1

    if feat_count % 10 == 0 or feat_count == int(str(total_feat_count)):
        print(str(feat_count) +  " Features of " + str(total_feat_count) + " Total Features simplified")

    # if feat_count == 20:
    #     break

del cursor_simplify

polygonToLine = arcpy.CreateFeatureclass_management("in_memory", "polygonToLine", "POLYLINE", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))
linesAtVertices = arcpy.CreateFeatureclass_management("in_memory", "linesAtVertices", "POLYLINE", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))

arcpy.PolygonToLine_management(simplePolygons, polygonToLine, "IGNORE_NEIGHBORS")
arcpy.SplitLine_management(polygonToLine, linesAtVertices)

arcpy.CopyFeatures_management(linesAtVertices, inGDBPath + "PROPERTY_LINES_SIMPLIFIED")

print("all done")