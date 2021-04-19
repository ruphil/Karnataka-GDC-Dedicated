import arcpy
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
            displayName="GRAMATHANA_BOUNDARY",
            name="in_gramthana",
            datatype="GPLayer",
            parameterType="Required",
            direction="Input")

        param1 = arcpy.Parameter(
            displayName="GRAMATHANA_BOUNDARY_SURVEY_Nos_FIELD",
            name="in_surveyNos",
            datatype="Field",
            parameterType="Required",
            direction="Input")

        param2 = arcpy.Parameter(
            displayName="PROPERTY_BOUNDARY",
            name="in_properties",
            datatype="GPLayer",
            parameterType="Required",
            direction="Input")
        
        param3 = arcpy.Parameter(
            displayName="OUTPUT_SURVEYNos_FIELDNAME",
            name="out_surveyNos",
            datatype="GPString",
            parameterType="Required",
            direction="Input")

        param1.parameterDependencies = [param0.name]
        param3.values = "Survey_Nos"

        params = [param0, param1, param2, param3]

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
        out_surveyNo_FieldName = parameters[3].valueAsText

        """messages.addMessage(gramthana + "|" + gramthana_surveyNo_Field + "|" + in_properties + "|" + out_surveyNo_FieldName)"""

        gramthanaClass = arcpy.mapping.Layer(gramthana)
        landparcelsClass = arcpy.mapping.Layer(in_properties)

        arcpy.AddField_management(landparcelsClass, out_surveyNo_FieldName, "TEXT")

        fields = ["OID@", "SHAPE@", out_surveyNo_FieldName]
        with arcpy.da.UpdateCursor(landparcelsClass, fields) as cursor:
            for land_row in cursor:
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
                land_row[2] = surveyNoCollections
                cursor.updateRow(land_row)
        del cursor
