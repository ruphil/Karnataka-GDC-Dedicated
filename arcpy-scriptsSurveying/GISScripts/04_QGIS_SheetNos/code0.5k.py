import numpy as np
gridLyr500 = QgsVectorLayer("Polygon?crs=epsg:4326", "grid3", "memory")

grid2k = QgsVectorLayer('F:/gridLSM/grid2k/grid2k.shp', 'grid2k', 'ogr')

stateLyr = QgsVectorLayer('F:/gridLSM/stateWGS84.shp', 'stateWGS84', 'ogr')
stateBoundaryGeometry = next(stateLyr.getFeatures()).geometry()

pr2 = gridLyr500.dataProvider()

pr2.addAttributes([QgsField("ID", QVariant.Int),QgsField("Grid No.", QVariant.String)])
gridLyr500.updateFields()

s = 1
for feat in grid2k.getFeatures():
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
   
    g1 = 65
    for x in np.arange (west, east - 0.0025 * 0.9, 0.0025):
        g2 = g1
        for y in np.arange (north, south + 0.0025 * 0.9, -0.0025):
                PT1 = QgsPointXY(x,y)
                PT2 = QgsPointXY(x,y-0.0025)
                PT3 = QgsPointXY(x+0.0025,y-0.0025)
                PT4 = QgsPointXY(x+0.0025,y)
                
                      
                newFet = QgsFeature()
                ptArry = [[PT1, PT2, PT3, PT4]]
                
                gPolygon = QgsGeometry.fromPolygonXY(ptArry)
                
                newFet.setGeometry(gPolygon)
                
                if newFet.geometry().intersects(stateBoundaryGeometry):
                    
                    newFet.setAttributes([s, prefix + chr(g2)])
                    s=s+1
                    if s>1000:
                        pr2.addFeatures([newFet])
                g2 = g2+4
        g1 = g1+1   
    if s > 1500:
        break
        
#    if s > 100:
#        break
    

gridLyr500.updateExtents()
QgsProject.instance().addMapLayer(gridLyr500)
print('done')