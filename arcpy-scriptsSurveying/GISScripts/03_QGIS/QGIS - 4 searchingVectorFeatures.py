path = 'C:\\Users\\theNextGen\\Desktop\\temp\\places.shp'

lyr = QgsVectorLayer(path, 'places', 'ogr')

pt_geo = QgsGeometry.fromPointXY(QgsPointXY(76,13))

for fet in lyr.getFeatures():
    if fet.geometry().contains(pt_geo):
        print(fet.attributes())
