import arcpy
import numpy as np

directory = "D:/outGIS/"

print("starting")

gdbName = "GeoDB-SheetNos-Karnataka.gdb"
gdbPath = directory + gdbName

karnStateGeom = arcpy.da.SearchCursor(gdbPath + "/stateWGS84", ["SHAPE@"]).next()[0]

outFeatureClass50K = arcpy.CreateFeatureclass_management(gdbPath, "sheetNos50K", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))
arcpy.AddField_management(outFeatureClass50K, "SheetNo", "TEXT")
cursor50K = arcpy.da.InsertCursor(outFeatureClass50K, ['SheetNo', 'SHAPE@'])

def getSheetNo_50K_suffix(lon, lat):
    sheetNo_50K_suffix = str(int(4.5 - 4 * (lat % 1) + 16 * (lon % 1) - 2)).zfill(2)
    return sheetNo_50K_suffix

for row in arcpy.da.SearchCursor(gdbPath + "/sheetNos250K", ["SHAPE@", "SheetNo"]):
    geom = row[0]
    sheetNo250K = row[1]

    lonMin = geom.extent.XMin
    lonMax = geom.extent.XMax
    latMin = geom.extent.YMin
    latMax = geom.extent.YMax
    
##    print(lonMin, lonMax, latMin, latMax)
    lonInc = float(0.25)
    latInc = float(0.25)
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
                sheetNo = sheetNo250K + getSheetNo_50K_suffix(MidPt[0], MidPt[1])
                cursor50K.insertRow([sheetNo, polygon])

del cursor50K

print("done")

