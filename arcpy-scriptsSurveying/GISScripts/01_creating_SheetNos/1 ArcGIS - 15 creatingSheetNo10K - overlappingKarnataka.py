import arcpy
import numpy as np
from datetime import datetime

directory = "D:/outGIS/"

print("starting")

now = datetime.now()
gdbWithTime = now.strftime("GeoDB-10K-%H-%M-%S.gdb")
gdbPath = directory + gdbWithTime

outGDB = arcpy.CreateFileGDB_management(directory, gdbWithTime)

arcpy.CopyFeatures_management("D:/inGIS/KarnState/stateWGS84.shp", gdbPath + "/stateWGS84")

kg = arcpy.Geometry()
karnStateGeomList = arcpy.CopyFeatures_management(gdbPath + "/stateWGS84", kg)
karnStateGeom = karnStateGeomList[0]
##print(karnStateGeom)

outFeatureClass50K = arcpy.CreateFeatureclass_management(outGDB, "sheetNos10K", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))

arcpy.AddField_management(outFeatureClass50K, "SheetNo", "TEXT")

cursor10K = arcpy.da.InsertCursor(outFeatureClass50K, ['SheetNo', 'SHAPE@'])

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
    catCalc = int(lon % 6) + 6 * int(4 - lat % 4)

##    print(suffix_cat, lon, lat)
    suffix = cats[catCalc]

    sheetNo_250K = prefix + suffix
    return sheetNo_250K

def getSheetNo_50K(lon, lat):
    prefix = getSheetNo_250K(lon, lat)

    suffix = str(int(4.5 - 4 * (lat % 1) + 16 * (lon % 1) - 2)).zfill(2)

    sheetNo_50K = prefix + suffix
    return sheetNo_50K

def getSheetNo_10K(lon, lat):
    prefix = getSheetNo_50K(lon, lat)

    cats = ['A', 'B', 'C', 'D', 'E' , 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y']
    catCalc = int(round(20 * (lon % 0.25) - 0.5, 1)) + int(round(22.5 - 100 * ( lat % 0.25 )))
##    print(cats[catCalc])
    suffix = cats[catCalc]

    sheetNo_10K = prefix + suffix
    return sheetNo_10K

lonInc = float(0.05)
latInc = float(0.05)
for lon in np.arange(66, 102, lonInc):
    for lat in np.arange(8, 40, latInc):
        SWPt = (lon, lat)
        NWPt = (lon + 0, lat + latInc)
        NEPt = (lon + lonInc, lat + latInc)
        SEPt = (lon + lonInc, lat + 0)
##        print(SWPt, NWPt, NEPt, SEPt)

        array = arcpy.Array([arcpy.Point(SWPt[0], SWPt[1]),
                     arcpy.Point(NWPt[0], NWPt[1]),
                     arcpy.Point(NEPt[0], NEPt[1]),
                     arcpy.Point(SEPt[0], SEPt[1])
                ])
        
        polygon = arcpy.Polygon(array, arcpy.SpatialReference(4326))

        if karnStateGeom.overlaps(polygon) or karnStateGeom.contains(polygon):
            MidPt = (lon + lonInc/2, lat + latInc/2)
            sheetNo = getSheetNo_10K(MidPt[0], MidPt[1])
            cursor10K.insertRow([sheetNo, polygon])

del cursor10K

print ("done")
