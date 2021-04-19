import arcpy
import numpy as np

directory = "D:/outGIS/"

print("starting")

gdbName = "GeoDB-SheetNos-Karnataka.gdb"
gdbPath = directory + gdbName

karnStateGeom = arcpy.da.SearchCursor(gdbPath + "/stateWGS84", ["SHAPE@"]).next()[0]

outFeatureClass1M = arcpy.CreateFeatureclass_management(gdbPath, "sheetNos1M", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))
arcpy.AddField_management(outFeatureClass1M, "SheetNo", "TEXT")
cursor1M = arcpy.da.InsertCursor(outFeatureClass1M, ['SheetNo', 'SHAPE@'])

def getSheetNo_1M(lon, lat):
    latBand = ['A', 'B', 'C', 'D', 'E' , 'F', 'G', 'H', 'I', 'J']

    latCalc = int(lat / 4)
    latCat = latBand[latCalc]

    lon_crct = 180 + lon
    lonCalc = str(int(lon_crct / 6) + 1)

    sheetNo_1M = latCat + lonCalc
    return sheetNo_1M

lonInc = float(6)
latInc = float(4)
for lon in np.arange(66, 102, lonInc):
    for lat in np.arange(8, 40, latInc):
        SWPt = (lon, lat)
        NWPt = (lon + 0, lat + latInc)
        NEPt = (lon + lonInc, lat + latInc)
        SEPt = (lon + lonInc, lat + 0)
        MidPt = (lon + lonInc/2, lat + latInc/2)
##        print(SWPt, NWPt, NEPt, SEPt)

        sheetNo = getSheetNo_1M(MidPt[0], MidPt[1])
        
        array = arcpy.Array([arcpy.Point(SWPt[0], SWPt[1]),
                     arcpy.Point(NWPt[0], NWPt[1]),
                     arcpy.Point(NEPt[0], NEPt[1]),
                     arcpy.Point(SEPt[0], SEPt[1])
                ])
        
        polygon = arcpy.Polygon(array, arcpy.SpatialReference(4326))

        if polygon.overlaps(karnStateGeom):
            cursor1M.insertRow([sheetNo, polygon])

del cursor1M

print("done")

