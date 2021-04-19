import arcpy
import numpy as np
arcpy.env.overwriteOutput = True

directory = "D:/GIS/out"

outShp = arcpy.CreateFeatureclass_management(directory, "PROPERTY_SURVEYNo.shp", "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))
arcpy.AddField_management(outShp, "Survey_Nos", "TEXT")
cursor = arcpy.da.InsertCursor(outShp, ['Survey_Nos', 'SHAPE@', 'Id'])

landparcels = "D:/GIS/ESRI/PROPERTY.shp"
landparcelsClass = arcpy.mapping.Layer(landparcels)

gramthana = "D:/GIS/ESRI/GRAMATHANA.shp"
gramthanaClass = arcpy.mapping.Layer(gramthana)

property_data_array = []
geom_X_points = np.array([])
geom_Y_points = np.array([])
for land_row in arcpy.da.SearchCursor(landparcelsClass, ["OID@", "SHAPE@"]):
    ID_land = land_row[0]
    geom_land = land_row[1]
    geom_land_prj = geom_land.projectAs(arcpy.SpatialReference(32643))

    surveyNoCollections = ""
    for gram_row in arcpy.da.SearchCursor(gramthanaClass, ["SHAPE@", "DXF_TEXT"]):
        geom_gram = gram_row[0]
        surveyNo_gram = gram_row[1]
        geom_gram_prj = geom_gram.projectAs(arcpy.SpatialReference(32643))

        if geom_gram_prj.overlaps(geom_land_prj) or geom_gram_prj.contains(geom_land_prj):
            surveyNoCollections += surveyNo_gram + ", "

    surveyNoCollections = surveyNoCollections[:-2]
    property_data_array.append([surveyNoCollections, geom_land, geom_land.firstPoint.X, geom_land.firstPoint.Y])
    geom_X_points = np.append(geom_X_points, geom_land.firstPoint.X)
    geom_Y_points = np.append(geom_Y_points, geom_land.firstPoint.Y)

X_min = np.amin(geom_X_points) * 0.95
Y_min = np.amin(geom_Y_points) * 0.95
X_max = np.amax(geom_X_points) * 1.05
Y_max = np.amax(geom_Y_points) * 1.05

print(X_min, Y_min, X_max, Y_max)

grid_size_X = (X_max - X_min) / 10
grid_size_Y = (Y_max - Y_min) / 10

grid_size_X -= grid_size_X % -100
grid_size_Y -= grid_size_Y % -100

Id = 1
Y_start = Y_min
odd_round = 1
while(Y_start < Y_max):
    Y_end = Y_start + grid_size_Y
    if(odd_round):
        X_start = X_min
        while(X_start < X_max):
            X_end = X_start + grid_size_X

            for property_data in property_data_array:
                surveyNoCollections = property_data[0]
                geom_land = property_data[1]
                firstPoint_X = property_data[2]
                firstPoint_Y = property_data[3]

                if X_start < firstPoint_X and firstPoint_X < X_end and Y_start < firstPoint_Y and firstPoint_Y < Y_end:
                    # print([surveyNoCollections, geom_land])
                    cursor.insertRow([surveyNoCollections, geom_land, Id])
                    Id += 1
            
            # print(X_start, X_end, Y_start, Y_end)
            X_start += grid_size_X
        odd_round = 0
    else:
        X_start = X_max
        while(X_start > X_min):
            X_end = X_start - grid_size_X

            for property_data in property_data_array:
                surveyNoCollections = property_data[0]
                geom_land = property_data[1]
                firstPoint_X = property_data[2]
                firstPoint_Y = property_data[3]

                if X_start < firstPoint_X and firstPoint_X < X_end and Y_start < firstPoint_Y and firstPoint_Y < Y_end:
                    # print([surveyNoCollections, geom_land])
                    cursor.insertRow([surveyNoCollections, geom_land, Id])
                    Id += 1

            # print(X_start, X_end, Y_start, Y_end)
            X_start -= grid_size_X
        odd_round = 1

    Y_start += grid_size_Y

# arcpy.DeleteField_management(outShp, ["Id"])
del cursor
