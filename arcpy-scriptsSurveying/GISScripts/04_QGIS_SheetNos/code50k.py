import numpy as np
gridLyr50k = QgsVectorLayer("Polygon?crs=epsg:4326", "grid3", "memory")

grid250k = QgsVectorLayer('F:/gridLSM/grid250k/grid250k.shp', 'grid250k', 'ogr')

stateLyr = QgsVectorLayer('F:/gridLSM/stateWGS84.shp', 'stateWGS84', 'ogr')
stateBoundaryGeometry = next(stateLyr.getFeatures()).geometry()

pr2 = gridLyr50k.dataProvider()

pr2.addAttributes([QgsField("ID", QVariant.Int),QgsField("Grid No.", QVariant.String)])
gridLyr50k.updateFields()

s = 1
for feat in grid250k.getFeatures():
    prefix = feat.attributes()[1]
    east = feat.geometry().boundingBox().xMaximum()
    west = feat.geometry().boundingBox().xMinimum()
    north = feat.geometry().boundingBox().yMaximum()
    south = feat.geometry().boundingBox().yMinimum()
    
#    print(prefix, east,west,north,south)
   
    g1 = 1
    for x in np.arange (west, east, 0.25):
        for y in np.arange (north, south, -0.25):
                PT1 = QgsPointXY(x,y)
                PT2 = QgsPointXY(x,y-0.25)
                PT3 = QgsPointXY(x+0.25,y-0.25)
                PT4 = QgsPointXY(x+0.25,y)
                
                      
                newFet = QgsFeature()
                ptArry = [[PT1, PT2, PT3, PT4]]
                
                gPolygon = QgsGeometry.fromPolygonXY(ptArry)
                
                newFet.setGeometry(gPolygon)
                
                if newFet.geometry().intersects(stateBoundaryGeometry):
                    
                    newFet.setAttributes([s, prefix + str(g1)])
                    s=s+1
                    pr2.addFeatures([newFet])
                g1 = g1+1
        

gridLyr50k.updateExtents()
QgsProject.instance().addMapLayer(gridLyr50k)
print('done')