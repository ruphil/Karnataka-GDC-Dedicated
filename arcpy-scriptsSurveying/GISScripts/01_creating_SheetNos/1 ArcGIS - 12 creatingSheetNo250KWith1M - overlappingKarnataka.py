import arcpy
import numpy as np
from datetime import datetime

directory = "D:/outGIS/"

print("starting")

now = datetime.now()
gdbWithTime = now.strftime("GeoDB-250K-1M-%H-%M-%S.gdb")
gdbPath = directory + gdbWithTime

outGDB = arcpy.CreateFileGDB_management(directory, gdbWithTime)

arcpy.CopyFeatures_management("D:/inGIS/KarnState/stateWGS84.shp", gdbPath + "/stateWGS84")

kg = arcpy.Geometry()
karnStateGeomList = arcpy.CopyFeatures_management(gdbPath + "/stateWGS84", kg)
karnStateGeom = karnStateGeomList[0]
##print(karnStateGeom)

outFeatureClass1M = arcpy.CreateFeatureclass_management(outGDB, "sheetNos1M", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))
outFeatureClass250K = arcpy.CreateFeatureclass_management(outGDB, "sheetNos250K", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))

arcpy.AddField_management(outFeatureClass1M, "SheetNo", "TEXT")
arcpy.AddField_management(outFeatureClass250K, "SheetNo", "TEXT")

cursor1M = arcpy.da.InsertCursor(outFeatureClass1M, ['SheetNo', 'SHAPE@'])
cursor250K = arcpy.da.InsertCursor(outFeatureClass250K, ['SheetNo', 'SHAPE@'])

def getSheetNo_1M(lon, lat):
    latBand = ['A', 'B', 'C', 'D', 'E' , 'F', 'G', 'H', 'I', 'J']

    latCalc = int(lat / 4)
    latCat = latBand[latCalc]

    lon_crct = 180 + lon
    lonCalc = str(int(lon_crct / 6) + 1)

    sheetNo_1M = latCat + lonCalc
    return sheetNo_1M

def getSheetNo_250K(lon, lat):
    prefix = getSheetNo_1M(lon, lat)

    cats = ['A', 'B', 'C', 'D', 'E' , 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X']
    suffix_cat = int(lon % 6) + 6 * int(4 - lat % 4)

##    print(suffix_cat, lon, lat)
    suffix = cats[suffix_cat]

    sheetNo_250K = prefix + suffix
    return sheetNo_250K

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

lonInc = float(1)
latInc = float(1)
for lon in np.arange(66, 102, lonInc):
    for lat in np.arange(8, 40, latInc):
        SWPt = (lon, lat)
        NWPt = (lon + 0, lat + latInc)
        NEPt = (lon + lonInc, lat + latInc)
        SEPt = (lon + lonInc, lat + 0)
        MidPt = (lon + lonInc/2, lat + latInc/2)
##        print(SWPt, NWPt, NEPt, SEPt)

        sheetNo = getSheetNo_250K(MidPt[0], MidPt[1])
        
        array = arcpy.Array([arcpy.Point(SWPt[0], SWPt[1]),
                     arcpy.Point(NWPt[0], NWPt[1]),
                     arcpy.Point(NEPt[0], NEPt[1]),
                     arcpy.Point(SEPt[0], SEPt[1])
                ])
        
        polygon = arcpy.Polygon(array, arcpy.SpatialReference(4326))

        if polygon.overlaps(karnStateGeom):
            cursor250K.insertRow([sheetNo, polygon])

del cursor250K

print ("done")
