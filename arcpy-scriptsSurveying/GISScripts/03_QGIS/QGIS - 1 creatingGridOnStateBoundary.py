import numpy as np
gridLyr = QgsVectorLayer('C:/Users/Debanjana/Desktop/testQgis/grid.shp', 'grid', 'ogr')
QgsProject.instance().addMapLayer(gridLyr)

stateLyr = QgsVectorLayer('C:/Users/Debanjana/Desktop/testQgis/state.shp', 'state', 'ogr')
gridLyr.startEditing()
s = 1

stateBoundaryGeometry = next(stateLyr.getFeatures()).geometry()
#print(stateBoundaryGeometry)

for x in np.arange (401584.53, 888845.59, 5000):
    for y in np.arange (1282368.32, 2041673.47, 5000):
            PT1 = QgsPointXY(x,y)
            PT2 = QgsPointXY(x,y+5000)
            PT3 = QgsPointXY(x+5000,y+5000)
            PT4 = QgsPointXY(x+5000,y)
    
            newFet = QgsFeature()
            ptArry = [[PT1, PT2, PT3, PT4]]
#            print(ptArry)
            gPolygon = QgsGeometry.fromPolygonXY(ptArry)
#            print(gPolygon)
            newFet.setGeometry(gPolygon)
            
            if newFet.geometry().intersects(stateBoundaryGeometry):
                newFet.setAttributes([s])
                s=s+1
                gridLyr.addFeatures([newFet])

gridLyr.commitChanges()
iface.vectorLayerTools().stopEditing(gridLyr)
print('done')
