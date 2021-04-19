import numpy as np
gridLyr2k = QgsVectorLayer("Polygon?crs=epsg:4326", "grid3", "memory")

grid10k = QgsVectorLayer('F:/gridLSM/grid10k/grid10k.shp', 'grid10k', 'ogr')

stateLyr = QgsVectorLayer('F:/gridLSM/stateWGS84.shp', 'stateWGS84', 'ogr')
stateBoundaryGeometry = next(stateLyr.getFeatures()).geometry()

pr2 = gridLyr2k.dataProvider()

pr2.addAttributes([QgsField("ID", QVariant.Int),QgsField("Grid No.", QVariant.String)])
gridLyr2k.updateFields()

s = 1
for feat in grid10k.getFeatures():
    prefix = feat.attributes()[1]
    east1 = feat.geometry().boundingBox().xMaximum()
    east = round(east1,4)
    west1 = feat.geometry().boundingBox().xMinimum()
    west = round(west1,4)
    north1 = feat.geometry().boundingBox().yMaximum()
    north = round(north1,4)
    south1 = feat.geometry().boundingBox().yMinimum()
    south = round(south1,4)
    
#    print(prefix, east1,west,north,south)
   
    g1 = 1
    for x in np.arange (west, east - 0.01 * 4 / 5, 0.01):
        for y in np.arange (north, south + 0.01 * 4 / 5, -0.01):
                PT1 = QgsPointXY(x,y)
                PT2 = QgsPointXY(x,y-0.01)
                PT3 = QgsPointXY(x+0.01,y-0.01)
                PT4 = QgsPointXY(x+0.01,y)
                
                      
                newFet = QgsFeature()
                ptArry = [[PT1, PT2, PT3, PT4]]
                
                gPolygon = QgsGeometry.fromPolygonXY(ptArry)
                
                newFet.setGeometry(gPolygon)
                
                if newFet.geometry().intersects(stateBoundaryGeometry):
                    
                    newFet.setAttributes([s, prefix + str(g1)])
                    s=s+1
                    pr2.addFeatures([newFet])
                g1 = g1+1
                
#    if s > 100:
#        break
    

gridLyr2k.updateExtents()
QgsProject.instance().addMapLayer(gridLyr2k)
print('done')