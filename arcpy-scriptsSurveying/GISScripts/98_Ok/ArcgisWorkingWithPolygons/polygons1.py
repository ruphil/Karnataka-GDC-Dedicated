import arcpy
import math
arcpy.env.overwriteOutput = True

inGDBPath = "D:/GIS/geodatabase.gdb/"
inFCName = "PROPERTY_BOUNDARY"

outfcLineName = "PROPERTY_LINES"
# base_tolerance = 0.01
# angle_tolerance = 2

base_tolerance = 0.1
angle_tolerance = 5

fc_simplify = arcpy.CreateFeatureclass_management("in_memory", "simplified", "POLYLINE", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))
cursor_simplify = arcpy.da.InsertCursor(fc_simplify, ['SHAPE@'])

def checkLinesNBend(lines_array):
    for line1 in lines_array:
        for line2 in lines_array:
            if (line1.touches(line2)):
                # print(line1, line2)
                angleBtw = 45

                vertices = []
                vertex1 = (line1[0][0].X, line1[0][0].Y)
                vertex2 = (line1[0][1].X, line1[0][1].Y)

                vertex3 = (line2[0][0].X, line2[0][0].Y)
                vertex4 = (line2[0][1].X, line2[0][1].Y)
                # print(vertex1, vertex2, vertex3, vertex4)
            
                # angle algorithm
                try:
                    m1 = (line1[0][1].Y - line1[0][0].Y) / (line1[0][1].X - line1[0][0].X)
                    m2 = (line2[0][1].Y - line2[0][0].Y) / (line2[0][1].X - line2[0][0].X)

                    tanTheta = abs((m1 - m2)/(1 + m1 * m2))

                    angleBtw = math.degrees(math.atan(tanTheta))
                except:
                    pass
                # print(angleBtw)

                # length algorithm
                vertices.extend([vertex1, vertex2, vertex3, vertex4])
                
                extremePts = [vertex for vertex in vertices if vertices.count(vertex) == 1]
                # print(extremePts)
                first_point = extremePts[0]
                second_point = extremePts[1]
                array = arcpy.Array([arcpy.Point(first_point[0], first_point[1]), arcpy.Point(second_point[0], second_point[1])])
                line_mod = arcpy.Polyline(array, arcpy.SpatialReference(32643))

                len_act = line1.length + line2.length
                len_mod = line_mod.length

                if(abs(len_act - len_mod) < base_tolerance and angleBtw < angle_tolerance):
                    lines_array.append(line_mod)
                    lines_array.remove(line1)
                    lines_array.remove(line2)

                    return [True, lines_array]

    return [False]

for feat in arcpy.da.SearchCursor(inGDBPath + inFCName, ["SHAPE@"]):
    feat_geom = feat[0].projectAs(arcpy.SpatialReference(32643))
    
    feat_part = feat_geom[0]
    first_point = []
    second_point = []
    lines_array = []
    for pnt in feat_part:
        first_point = second_point
        second_point = [pnt.X, pnt.Y]
        if not first_point:
            continue
        
        array = arcpy.Array([arcpy.Point(first_point[0], first_point[1]), arcpy.Point(second_point[0], second_point[1])])
        polyline = arcpy.Polyline(array, arcpy.SpatialReference(32643))
        lines_array.append(polyline)
        
    # print(lines_array)
    haveLinesToBend = True
    while haveLinesToBend:
        # print("Still Have Lines To Bend in Feature No: " + str(feat_count))
        result = checkLinesNBend(lines_array)
        
        if(result[0]):
            haveLinesToBend = result[0]
            lines_array = result[1]
        else:
            haveLinesToBend = False

    for line in lines_array:
        cursor_simplify.insertRow([line])

del cursor_simplify

fc_linespass1 = arcpy.CreateFeatureclass_management("in_memory", "pass1", "POLYLINE", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))
cursor_linespass1 = arcpy.da.InsertCursor(fc_linespass1, ['SHAPE@'])

for feat_memory1 in arcpy.da.SearchCursor(fc_simplify, ["SHAPE@"]):
    feat_geom1 = feat_memory1[0].projectAs(arcpy.SpatialReference(32643))

    feat_geom_reqd = True
    for feat_memory2 in arcpy.da.SearchCursor(fc_simplify, ["SHAPE@"]): 
        feat_geom2 = feat_memory2[0].projectAs(arcpy.SpatialReference(32643))
        if feat_geom1.crosses(feat_geom2):
            feat_geom_reqd = False
            break
    
    if (feat_geom_reqd):
        cursor_linespass1.insertRow([feat_geom1])

del cursor_linespass1

fc_propertylines = arcpy.CreateFeatureclass_management(inGDBPath, outfcLineName, "POLYLINE", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))
cursor_propertylines = arcpy.da.InsertCursor(fc_propertylines, ['SHAPE@'])

for feat_memory1 in arcpy.da.SearchCursor(fc_simplify, ["SHAPE@"]):
    feat_geom1 = feat_memory1[0].projectAs(arcpy.SpatialReference(32643))

    feat_geom_reqd = True
    for feat_memory2 in arcpy.da.SearchCursor(fc_linespass1, ["SHAPE@"]): 
        feat_geom2 = feat_memory2[0].projectAs(arcpy.SpatialReference(32643))
        if feat_geom1.crosses(feat_geom2):
            feat_geom_reqd = False
            break
    
    if (feat_geom_reqd):
        cursor_propertylines.insertRow([feat_geom1])

del cursor_propertylines

arcpy.DeleteIdentical_management(fc_propertylines, ["Shape"], "0.02 Meters", "")
print("done")