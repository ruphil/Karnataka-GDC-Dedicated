import numpy as np
gridLyr1M = QgsVectorLayer("Polygon?crs=epsg:4326", "grid1M", "memory")
#gridLyr250k = QgsVectorLayer("Polygon?crs=epsg:4326", "grid2", "memory")
#gridLyr50k = QgsVectorLayer("Polygon?crs=epsg:4326", "grid3", "memory")
#gridLyr10k = QgsVectorLayer("Polygon?crs=epsg:4326", "grid4", "memory")
#gridLyr2k = QgsVectorLayer("Polygon?crs=epsg:4326", "grid5", "memory")
#gridLyr500 = QgsVectorLayer("Polygon?crs=epsg:4326", "grid6", "memory")

stateLyr = QgsVectorLayer('F:/gridLSM/stateWGS84.shp', 'stateWGS84', 'ogr')
stateBoundaryGeometry = next(stateLyr.getFeatures()).geometry()

#Grid Layer 1 million
pr1 = gridLyr1M.dataProvider()

pr1.addAttributes([QgsField("ID", QVariant.Int),QgsField("Grid No.", QVariant.String)])
gridLyr1M.updateFields()

s = 1
#g1 = 74
g2 = 42
for x in np.arange (66, 102, 6):
    g1 = 74
    for y in np.arange (40, 7, -4):
            PT1 = QgsPointXY(x,y)
            PT2 = QgsPointXY(x,y-4)
            PT3 = QgsPointXY(x+6,y-4)
            PT4 = QgsPointXY(x+6,y)
    
            newFet = QgsFeature()
            ptArry = [[PT1, PT2, PT3, PT4]]
#            print(ptArry)
            gPolygon = QgsGeometry.fromPolygonXY(ptArry)
#            print(gPolygon)
            newFet.setGeometry(gPolygon)
            
            if newFet.geometry().intersects(stateBoundaryGeometry):
                newFet.setAttributes([s, chr(g1) + str(g2)])
                s=s+1
                pr1.addFeatures([newFet])
            g1 = g1-1
    g2 = g2+1

gridLyr1M.updateExtents()
QgsProject.instance().addMapLayer(gridLyr1M)
print('done')


#Grid Layer 250k
#pr2 = gridLyr250k.dataProvider()
#
#pr2.addAttributes([QgsField("ID", QVariant.Int)])
#gridLyr250k.updateFields()

#s = 1
#
#for x in np.arange (74, 79, 1):
#    for y in np.arange (19, 11, -1):
#            PT1 = QgsPointXY(x,y)
#            PT2 = QgsPointXY(x,y-1)
#            PT3 = QgsPointXY(x+1,y-1)
#            PT4 = QgsPointXY(x+1,y)
#            
#            cX = (2*x+1)/2
#            cY = (2*y-1)/2
#    
#            newFet = QgsFeature()
#            ptArry = [[PT1, PT2, PT3, PT4]]
##            print(ptArry)
#            gPolygon = QgsGeometry.fromPolygonXY(ptArry)
##            print(gPolygon)
#            newFet.setGeometry(gPolygon)
#            
#            if newFet.geometry().intersects(stateBoundaryGeometry):
#                newFet.setAttributes([s])
#                s=s+1
#                pr2.addFeatures([newFet])
#
#gridLyr250k.updateExtents()
#QgsProject.instance().addMapLayer(gridLyr250k)
#print('done')