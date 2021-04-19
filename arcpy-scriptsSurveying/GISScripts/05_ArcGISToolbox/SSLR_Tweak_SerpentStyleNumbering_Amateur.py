#!/usr/bin/env python
# coding: utf-8

# In[1]:


import arcpy
from operator import itemgetter, attrgetter
arcpy.env.overwriteOutput = True


# In[2]:


landparcels = "D:/GIS/ESRI/PROPERTY.shp"
landparcelsClass = arcpy.mapping.Layer(landparcels)

gramthana = "D:/GIS/ESRI/GRAMATHANA.shp"
gramthanaClass = arcpy.mapping.Layer(gramthana)


# In[8]:


property_data_array = []
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
    property_data_array.append([surveyNoCollections, geom_land, geom_land.trueCentroid.X, geom_land.trueCentroid.Y])


# In[24]:


directory = "D:/GIS/out/"
fileName = "PROPERTY_SURVEYNo.shp"
outShp = arcpy.CreateFeatureclass_management(directory, fileName, "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))
arcpy.AddField_management(outShp, "Survey_Nos", "TEXT")
cursor = arcpy.da.InsertCursor(outShp, ['Survey_Nos', 'SHAPE@'])

# arcpy.DeleteFeatures_management(directory + fileName)


# In[25]:


property_data_array_sorted = sorted(property_data_array, key=itemgetter(3), reverse=True)
print(len(property_data_array_sorted))

def divide_chunks(l, n):
    # looping till length l
    for i in range(0, len(l), n):
        yield l[i:i + n]

n = 10
property_data_array_sorted = list(divide_chunks(property_data_array_sorted, n))
print(len(property_data_array_sorted))
# print(property_data_array_sorted)


# In[26]:


odd_round = 1
for property_data_array_sorted_chunk in property_data_array_sorted:
    if(odd_round):
        property_data_array_sorted_chunk = sorted(property_data_array_sorted_chunk, key=itemgetter(2))
        odd_round = 0
    else:
        property_data_array_sorted_chunk = sorted(property_data_array_sorted_chunk, key=itemgetter(2), reverse=True)
        odd_round = 1
    for row in property_data_array_sorted_chunk:
        surveyNoCollections = row[0]
        geom_land = row[1]
        cursor.insertRow([surveyNoCollections, geom_land])

del cursor


# In[ ]:




