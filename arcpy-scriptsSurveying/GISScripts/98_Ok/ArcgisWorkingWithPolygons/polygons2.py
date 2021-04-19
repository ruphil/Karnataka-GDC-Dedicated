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

def checkLinesNBendssssssssssssssssssssss(lines_array):
    for line1 in lines_array:
        vertex1 = (line1[0][0].X, line1[0][0].Y)
        vertex2 = (line1[0][1].X, line1[0][1].Y)
        commonvertex1 = 0
        commonvertex2 = 0

        for line2 in lines_array:
            if (line1.touches(line2)):
                vertex3 = (line2[0][0].X, line2[0][0].Y)
                vertex4 = (line2[0][1].X, line2[0][1].Y)

                if (vertex1 == vertex3 or vertex1 == vertex4):
                    commonvertex1 += 1

                if (vertex2 == vertex3 or vertex2 == vertex4):
                    commonvertex2 += 1

        if (commonvertex1 > commonvertex2):
            maxAdjacentVertices = commonvertex1
        else:
            maxAdjacentVertices = commonvertex2

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

                cond1 = abs(len_act - len_mod) < base_tolerance
                cond2 = angleBtw < angle_tolerance
                cond3 = maxAdjacentVertices == 1
                if(cond1 and cond2 and cond3):
                    lines_array.append(line_mod)
                    lines_array.remove(line1)
                    lines_array.remove(line2)

                    return [True, lines_array]

    return [False]

def checkLinesNBend(lines_geom_array):
    for line1_geom in lines_geom_array:
        for line2_geom in lines_geom_array:
            if line1_geom.touches(line2_geom):
                vertices = []
                vertex1 = (line1_geom[0][0].X, line1_geom[0][0].Y)
                vertex2 = (line1_geom[0][1].X, line1_geom[0][1].Y)

                vertex3 = (line2_geom[0][0].X, line2_geom[0][0].Y)
                vertex4 = (line2_geom[0][1].X, line2_geom[0][1].Y)
                # print(vertex1, vertex2, vertex3, vertex4)

                vertices.extend([vertex1, vertex2, vertex3, vertex4])
                
                extremePts = [vertex for vertex in vertices if vertices.count(vertex) == 1]
                # print(extremePts)
                first_point = extremePts[0]
                second_point = extremePts[1]
                array = arcpy.Array([arcpy.Point(first_point[0], first_point[1]), arcpy.Point(second_point[0], second_point[1])])
                line_mod = arcpy.Polyline(array, arcpy.SpatialReference(32643))

                len_act = line1_geom.length + line2_geom.length
                len_mod = line_mod.length

                cond1 = abs(len_act - len_mod) < base_tolerance
                # cond2 = angleBtw < angle_tolerance
                # cond3 = maxAdjacentVertices == 1
                # if(cond1 and cond2 and cond3):
                if(cond1):
                    lines_geom_array.append(line_mod)
                    lines_geom_array.remove(line1_geom)
                    lines_geom_array.remove(line2_geom)

                    return [True, lines_geom_array]
        # break

    return [False]

polygonToLine = arcpy.CreateFeatureclass_management("in_memory", "polygonToLine", "POLYLINE", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))
linesAtVertices = arcpy.CreateFeatureclass_management("in_memory", "linesAtVertices", "POLYLINE", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))
fc_simplify = arcpy.CreateFeatureclass_management("in_memory", "lsimplified", "POLYLINE", None, "DISABLED", "DISABLED", arcpy.SpatialReference(32643))

arcpy.PolygonToLine_management(inGDBPath + inFCName, polygonToLine, "IDENTIFY_NEIGHBORS")
arcpy.SplitLine_management(polygonToLine, linesAtVertices)

# arcpy.CopyFeatures_management(linesAtVertices, inGDBPath + "linesAtVertices")
cursor_simplify = arcpy.da.InsertCursor(fc_simplify, ['SHAPE@'])

lines_geom_array = []
for line in arcpy.da.SearchCursor(linesAtVertices, ["SHAPE@"]):
    line_geom = line[0].projectAs(arcpy.SpatialReference(32643))
    lines_geom_array.append(line_geom)

haveLinesToBend = True
while haveLinesToBend:
    result = checkLinesNBend(lines_geom_array)
    
    if(result[0]):
        haveLinesToBend = result[0]
        lines_geom_array = result[1]
    else:
        haveLinesToBend = False

for line in lines_geom_array:
    cursor_simplify.insertRow([line])

del cursor_simplify

arcpy.CopyFeatures_management(fc_simplify, inGDBPath + "lsimplified")

print("done")