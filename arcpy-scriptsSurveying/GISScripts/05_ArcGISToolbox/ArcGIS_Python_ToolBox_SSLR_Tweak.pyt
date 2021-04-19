import arcpy
import numpy as np
import os
from operator import itemgetter, attrgetter
arcpy.env.overwriteOutput = True

class SSLR_Tweak(object):
    def __init__(self):
        """Define the toolbox (the name of the toolbox is the name of the
        .pyt file)."""
        self.label = "SSLR_Tweak"
        self.alias = ""

        # List of tool classes associated with this toolbox
        self.tools = [Tool]

class Tool(object):
    def __init__(self):
        """Define the tool (tool name is the name of the class)."""
        self.label = "SSLR_Tweak"
        self.description = ""
        self.canRunInBackground = False

    def getParameterInfo(self):
        """Define parameter definitions"""
        param0 = arcpy.Parameter(
            displayName="Input Gramthana Shapefile",
            name="in_gramthana",
            datatype="DEShapefile",
            parameterType="Required",
            direction="Input")

        param1 = arcpy.Parameter(
            displayName="Gramthana Survey Nos Source",
            name="in_surveyNos",
            datatype="Field",
            parameterType="Required",
            direction="Input")

        param2 = arcpy.Parameter(
            displayName="Input Properties Shapefile",
            name="in_properties",
            datatype="DEShapefile",
            parameterType="Required",
            direction="Input")

        param3 = arcpy.Parameter(
            displayName="Output Properties Shapefile",
            name="out_properties",
            datatype="DEShapefile",
            parameterType="Required",
            direction="Output")
        
        param4 = arcpy.Parameter(
            displayName="Output SurveyNos Fieldname",
            name="out_surveyNos",
            datatype="GPString",
            parameterType="Required",
            direction="Output")

        param1.parameterDependencies = [param0.name]
        param4.values = "Survey_Nos"

        params = [param0, param1, param2, param3, param4]

        return params

    def isLicensed(self):
        """Set whether tool is licensed to execute."""
        return True

    def updateParameters(self, parameters):
        """Modify the values and properties of parameters before internal
        validation is performed.  This method is called whenever a parameter
        has been changed."""
        return

    def updateMessages(self, parameters):
        """Modify the messages created by internal validation for each tool
        parameter.  This method is called after internal validation."""
        return

    def execute(self, parameters, messages):
        """The source code of the tool."""
        messages.addMessage("The propeties are being tweaked... Kindly wait for few minutes...")

        gramthana = parameters[0].valueAsText
        gramthana_surveyNo_Field = parameters[1].valueAsText
        in_properties = parameters[2].valueAsText
        out_properties = parameters[3].valueAsText
        out_surveyNo_FieldName = parameters[4].valueAsText

        out_properties_name = os.path.basename(out_properties)
        out_properties_dir = os.path.dirname(out_properties)

        messages.addMessage(gramthana + gramthana_surveyNo_Field + in_properties + out_properties + out_surveyNo_FieldName + out_properties_name + out_properties_dir)

        outShp = arcpy.CreateFeatureclass_management(out_properties_dir, out_properties_name, "POLYGON", None, "DISABLED", "DISABLED", arcpy.SpatialReference(4326))
        arcpy.AddField_management(outShp, out_surveyNo_FieldName, "TEXT")
        cursor = arcpy.da.InsertCursor(outShp, [out_surveyNo_FieldName, 'SHAPE@'])

        landparcels = in_properties
        landparcelsClass = arcpy.mapping.Layer(landparcels)

        gramthana = gramthana
        gramthanaClass = arcpy.mapping.Layer(gramthana)

        property_data_array = []
        for land_row in arcpy.da.SearchCursor(landparcelsClass, ["OID@", "SHAPE@"]):
            ID_land = land_row[0]
            geom_land = land_row[1]
            geom_land_prj = geom_land.projectAs(arcpy.SpatialReference(32643))

            surveyNoCollections = ""
            for gram_row in arcpy.da.SearchCursor(gramthanaClass, ["SHAPE@", gramthana_surveyNo_Field]):
                geom_gram = gram_row[0]
                surveyNo_gram = gram_row[1]
                geom_gram_prj = geom_gram.projectAs(arcpy.SpatialReference(32643))

                if geom_gram_prj.overlaps(geom_land_prj) or geom_gram_prj.contains(geom_land_prj):
                    surveyNoCollections += surveyNo_gram + ", "

            surveyNoCollections = surveyNoCollections[:-2]
            property_data_array.append([surveyNoCollections, geom_land, geom_land.firstPoint.X, geom_land.firstPoint.Y])
        
        data = sorted(property_data_array, key=itemgetter(2))
        data = sorted(data, key=itemgetter(3))
        
        for row in data:
            surveyNoCollections = row[0]
            geom_land = row[1]
            cursor.insertRow([surveyNoCollections, geom_land])

        arcpy.DeleteField_management(outShp, ["Id"])

        del cursor

        messages.addMessage("Congratulations... Properties are Tweaked Now...")
        return
