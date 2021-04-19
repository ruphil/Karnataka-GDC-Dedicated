import numpy as np
gridLyr = QgsVectorLayer("Polygon?crs=epsg:4326", "grid", "memory")
pr = gridLyr.dataProvider()

pr.addAttributes([QgsField("ID", QVariant.Int)])
gridLyr.updateFields()

s = 1
for x in np.arange (66, 102, 6):
    for y in np.arange (8, 40, 4):
            PT1 = QgsPointXY(x,y)
            PT2 = QgsPointXY(x,y+4)
            PT3 = QgsPointXY(x+6,y+4)
            PT4 = QgsPointXY(x+6,y)
    
            newFet = QgsFeature()
            ptArry = [[PT1, PT2, PT3, PT4]]
#            print(ptArry)
            gPolygon = QgsGeometry.fromPolygonXY(ptArry)
#            print(gPolygon)
            newFet.setGeometry(gPolygon)
            
            newFet.setAttributes([s])
            s=s+1
            pr.addFeatures([newFet])

gridLyr.updateExtents()
QgsProject.instance().addMapLayer(gridLyr)
print('done')
