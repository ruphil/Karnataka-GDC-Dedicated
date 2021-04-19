import arcpy
from datetime import datetime

directory = "D:/outGIS/"

now = datetime.now()
gdbWithTime = now.strftime("GeoDB-%H-%M-%S.gdb")

outGDB = arcpy.CreateFileGDB_management(directory, gdbWithTime)
outFeatureClass = arcpy.CreateFeatureclass_management(outGDB, "polygons", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))
arcpy.AddField_management(outFeatureClass, "SheetNo", "TEXT")

cursor = arcpy.da.InsertCursor(outFeatureClass, ['SheetNo', 'SHAPE@'])

def getSheetNo_1M(lon, lat):
    latBand = ['A', 'B', 'C', 'D', 'E' , 'F', 'G', 'H', 'I', 'J']

    latCalc = int(lat / 4)
    latCat = latBand[latCalc]

    lon_crct = 180 + lon
    lonCalc = str(int(lon_crct / 6) + 1)

    sheetNo_1M = latCat + lonCalc
    return sheetNo_1M


for lon in range(66, 102, 6):
    for lat in range(8, 40, 4):
        SWPt = (lon, lat)
        NWPt = (lon + 0, lat + 4)
        NEPt = (lon + 6, lat + 4)
        SEPt = (lon + 6, lat + 0)
        MidPt = (lon + 3, lat + 2)
##        print(SWPt, NWPt, NEPt, SEPt)

        sheetNo = getSheetNo_1M(MidPt[0], MidPt[1])
        
        array = arcpy.Array([arcpy.Point(lon, lat),
                     arcpy.Point(lon + 0, lat + 4),
                     arcpy.Point(lon + 6, lat + 4),
                     arcpy.Point(lon + 6, lat + 0)
                     ])
        polygon = arcpy.Polygon(array)
        cursor.insertRow([sheetNo, polygon])

del cursor
