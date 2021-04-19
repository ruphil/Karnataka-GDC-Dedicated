import numpy as np
gridLyr250k = QgsVectorLayer("Polygon?crs=epsg:4326", "grid2", "memory")

grid1M = QgsVectorLayer('F:/gridLSM/grid1M/grid1M.shp', 'grid1M', 'ogr')

stateLyr = QgsVectorLayer('F:/gridLSM/stateWGS84.shp', 'stateWGS84', 'ogr')
stateBoundaryGeometry = next(stateLyr.getFeatures()).geometry()

pr2 = gridLyr250k.dataProvider()

pr2.addAttributes([QgsField("ID", QVariant.Int),QgsField("Grid No.", QVariant.String)])
gridLyr250k.updateFields()

s = 1
for feat in grid1M.getFeatures():
    prefix = feat.attributes()[1]
    east = feat.geometry().boundingBox().xMaximum()
    west = feat.geometry().boundingBox().xMinimum()
    north = feat.geometry().boundingBox().yMaximum()
    south = feat.geometry().boundingBox().yMinimum()
   
    g1 = 65
    for x in np.arange (west, east, 1):
        g2 = g1
        for y in np.arange (north, south, -1):
                PT1 = QgsPointXY(x,y)
                PT2 = QgsPointXY(x,y-1)
                PT3 = QgsPointXY(x+1,y-1)
                PT4 = QgsPointXY(x+1,y)
                
                      
                newFet = QgsFeature()
                ptArry = [[PT1, PT2, PT3, PT4]]
                
                gPolygon = QgsGeometry.fromPolygonXY(ptArry)
                
                newFet.setGeometry(gPolygon)
                
                if newFet.geometry().intersects(stateBoundaryGeometry):
                    
                    newFet.setAttributes([s, prefix + chr(g2)])
                    s=s+1
                    pr2.addFeatures([newFet])
                g2 = g2+6
        g1 = g1+1

gridLyr250k.updateExtents()
QgsProject.instance().addMapLayer(gridLyr250k)
print('done')