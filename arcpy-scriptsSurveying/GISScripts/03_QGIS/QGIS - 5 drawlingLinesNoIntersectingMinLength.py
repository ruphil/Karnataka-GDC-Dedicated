import math
import numpy as np
from itertools import combinations

ptsLyr = QgsVectorLayer('D:/OneDrive - Indian Institute of Science/Survey of India/QGISProjects/1 drawingLinesBTWPoints/pointsLayer/points.shp', 'points', 'ogr')

vl = QgsVectorLayer("LineString?crs=epsg:4326", "Lines", "memory")
pr = vl.dataProvider()

pr.addAttributes([QgsField("ID", QVariant.Int)])
vl.updateFields()

ptArry = []
for fet in ptsLyr.getFeatures():
    x = fet.geometry().asPoint().x()
    y = fet.geometry().asPoint().y()
    ptArry.append([x, y])
    
#print(ptArry)

distArry = []
for combo in list(combinations(ptArry, 2)):
    newFet = QgsFeature()
    x1 = combo[0][0]
    y1 = combo[0][1]
    x2 = combo[1][0]
    y2 = combo[1][1]
    distance = math.sqrt( (x2 - x1)**2 + (y2 - y1)**2 )
    distArry.append(distance)

distArryLen = len(distArry)
distArry.sort()

smallDist = distArry[0]
bigDist = distArry[distArryLen - 1]
#print(distArry)
#print(smallDist, bigDist)

loopRange = np.linspace(smallDist, bigDist, 10)
#print(loopRange)

for length in loopRange:
#    print(length)
    for combo in list(combinations(ptArry, 2)):
        newFet = QgsFeature()
        x1 = combo[0][0]
        y1 = combo[0][1]
        x2 = combo[1][0]
        y2 = combo[1][1]
        distance = math.sqrt( (x2 - x1)**2 + (y2 - y1)**2 )
    #    print(distance)
    #    print(x1, y1, x2, y2)
        if (distance <= length):
            gLine = QgsGeometry.fromPolyline([QgsPoint(x1, y1), QgsPoint(x2, y2)])
            
            whetherIntersecting = 0
            for lineFet in pr.getFeatures():
                if(lineFet.geometry().crosses(gLine)):
                    whetherIntersecting = 1
        #        print(lineFet.geometry().intersects(gLine))
        #    print("yep")
            
            if (whetherIntersecting == 0):
                newFet.setGeometry(gLine)
                newFet.setAttributes([0])
                pr.addFeatures([newFet])

vl.updateExtents()
QgsProject.instance().addMapLayer(vl)
print("done")
