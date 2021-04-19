import arcpy
import numpy as np

directory = "D:/outGIS/"

print("starting")

gdbName = "GeoDB-SheetNos-Karnataka.gdb"
gdbPath = directory + gdbName

karnStateGeom = arcpy.da.SearchCursor(gdbPath + "/stateWGS84", ["SHAPE@"]).next()[0]

outFeatureClass2K = arcpy.CreateFeatureclass_management(gdbPath, "sheetNos2K", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))
arcpy.AddField_management(outFeatureClass2K, "SheetNo", "TEXT")
cursor2K = arcpy.da.InsertCursor(outFeatureClass2K, ['SheetNo', 'SHAPE@'])

def getSheetNo_2K_suffix(lon, lat):
    sheetNo_2K_suffix = str(int(5.5 - 100 * (lat % 0.05) + 500 * (lon % 0.05) - 2.5)).zfill(2)
    return sheetNo_2K_suffix

##iteration = 0
for row in arcpy.da.SearchCursor(gdbPath + "/sheetNos10K", ["SHAPE@", "SheetNo"]):
    geom = row[0]
    sheetNo10K = row[1]

    lonMin = geom.extent.XMin
    lonMax = geom.extent.XMax
    latMin = geom.extent.YMin
    latMax = geom.extent.YMax
    
##    print(lonMin, lonMax, latMin, latMax)
    lonInc = float(0.01)
    latInc = float(0.01)
    for lon in np.arange(lonMin, lonMax - lonInc/2, lonInc):
        for lat in np.arange(latMin, latMax - latInc/2, latInc):
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
                sheetNo = sheetNo10K + getSheetNo_2K_suffix(MidPt[0], MidPt[1])
                cursor2K.insertRow([sheetNo, polygon])
##    iteration = iteration + 1
##    if iteration == 5:
##        break
    
del cursor2K

print("done")

