import arcpy
import numpy as np

directory = "D:/outGIS/"

print("starting")

gdbName = "GeoDB-SheetNos-Karnataka.gdb"
gdbPath = directory + gdbName

karnStateGeom = arcpy.da.SearchCursor(gdbPath + "/stateWGS84", ["SHAPE@"]).next()[0]

outFeatureClass250K = arcpy.CreateFeatureclass_management(gdbPath, "sheetNos250K", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))
arcpy.AddField_management(outFeatureClass250K, "SheetNo", "TEXT")
cursor250K = arcpy.da.InsertCursor(outFeatureClass250K, ['SheetNo', 'SHAPE@'])


def getSheetNo_250K_suffix(lon, lat):
    cats = ['A', 'B', 'C', 'D', 'E' , 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X']
    suffix_cat = int(lon % 6) + 6 * int(4 - lat % 4)

    sheetNo_250K_suffix = cats[suffix_cat]
    return sheetNo_250K_suffix

for row in arcpy.da.SearchCursor(gdbPath + "/sheetNos1M", ["SHAPE@", "SheetNo"]):
    geom = row[0]
    sheetNo1M = row[1]

    lonMin = geom.extent.XMin
    lonMax = geom.extent.XMax
    latMin = geom.extent.YMin
    latMax = geom.extent.YMax
    
##    print(lonMin, lonMax, latMin, latMax)
    lonInc = float(1)
    latInc = float(1)
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
            
            if polygon.overlaps(karnStateGeom):
                sheetNo = sheetNo1M + getSheetNo_250K_suffix(MidPt[0], MidPt[1])
                cursor250K.insertRow([sheetNo, polygon])

del cursor250K


print("done")

