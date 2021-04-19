import arcpy
import numpy as np

directory = "D:/outGIS/"

print("starting")

gdbName = "GeoDB-SheetNos-Karnataka.gdb"
gdbPath = directory + gdbName

karnStateGeom = arcpy.da.SearchCursor(gdbPath + "/stateWGS84", ["SHAPE@"]).next()[0]

outFeatureClass10K = arcpy.CreateFeatureclass_management(gdbPath, "sheetNos10K", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))
arcpy.AddField_management(outFeatureClass10K, "SheetNo", "TEXT")
cursor10K = arcpy.da.InsertCursor(outFeatureClass10K, ['SheetNo', 'SHAPE@'])

def getSheetNo_10K_suffix(lon, lat):
    cats = ['A', 'B', 'C', 'D', 'E' , 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y']
    catCalc = int(round(20 * (lon % 0.25) - 0.5, 1)) + int(round(22.5 - 100 * ( lat % 0.25 )))
    
    sheetNo_10K_suffix = cats[catCalc]
    return sheetNo_10K_suffix

##iteration = 0
for row in arcpy.da.SearchCursor(gdbPath + "/sheetNos50K", ["SHAPE@", "SheetNo"]):
    geom = row[0]
    sheetNo50K = row[1]

    lonMin = geom.extent.XMin
    lonMax = geom.extent.XMax
    latMin = geom.extent.YMin
    latMax = geom.extent.YMax
    
##    print(lonMin, lonMax, latMin, latMax)
    lonInc = float(0.05)
    latInc = float(0.05)
    for lon in np.arange(lonMin, lonMax, lonInc):
        for lat in np.arange(latMin, latMax, latInc):
            SWPt = (lon, lat)
            NWPt = (lon + 0, lat + latInc)
            NEPt = (lon + lonInc, lat + latInc)
            SEPt = (lon + lonInc, lat + 0)
            MidPt = (lon + lonInc/2, lat + latInc/2)
    ##        print(SWPt, NWPt, NEPt, SEPt)
            
            array = arcpy.Array([arcpy.Point(SWPt[0], SWPt[1]),
                         arcpy.Point(NWPt[0], NWPt[1]),
                         arcpy.Point(NEPt[0], NEPt[1]),
                         arcpy.Point(SEPt[0], SEPt[1])
                    ])
            
            polygon = arcpy.Polygon(array, arcpy.SpatialReference(4326))
            
            if karnStateGeom.overlaps(polygon) or karnStateGeom.contains(polygon):
                sheetNo = sheetNo50K + getSheetNo_10K_suffix(MidPt[0], MidPt[1])
                cursor10K.insertRow([sheetNo, polygon])
##    iteration = iteration + 1
##    if iteration == 10:
##        break
    
del cursor10K

print("done")

