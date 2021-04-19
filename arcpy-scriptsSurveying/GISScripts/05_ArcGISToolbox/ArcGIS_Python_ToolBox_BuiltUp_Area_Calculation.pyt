import arcpy
arcpy.env.overwriteOutput = True

class SSLR_Tweak(object):
    def __init__(self):
        """Define the toolbox (the name of the toolbox is the name of the
        .pyt file)."""
        self.label = "BUILTUP_AREA"
        self.alias = ""

        # List of tool classes associated with this toolbox
        self.tools = [Tool]

class Tool(object):
    def __init__(self):
        """Define the tool (tool name is the name of the class)."""
        self.label = "BUILTUP_AREA"
        self.description = ""
        self.canRunInBackground = False

    def getParameterInfo(self):
        """Define parameter definitions"""
        param0 = arcpy.Parameter(
            displayName="BUILTUP_LAND_POLYGON",
            name="in_builtup",
            datatype="GPLayer",
            parameterType="Required",
            direction="Input")

        param1 = arcpy.Parameter(
            displayName="BUILTUP_LAND_POLYGON_SHAPE_AREA",
            name="in_area",
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
            displayName="TOTAL_BUILTUP_AREA",
            name="out_area",
            datatype="GPString",
            parameterType="Required",
            direction="Input")

        param1.parameterDependencies = [param0.name]
        param3.values = "TOTAL_AREA"

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

        builtup_polygon = parameters[0].valueAsText
        polygon_area = parameters[1].valueAsText
        in_properties = parameters[2].valueAsText
        out_polygon_area = parameters[3].valueAsText

        """messages.addMessage(builtup_polygon + "|" + polygon_area + "|" + in_properties + "|" + out_polygon_area)"""

        builtupClass = arcpy.mapping.Layer(builtup_polygon)
        landparcelsClass = arcpy.mapping.Layer(in_properties)

        arcpy.AddField_management(landparcelsClass, out_polygon_area, "FLOAT")

        fields = ["OID@", "SHAPE@", out_polygon_area]
        with arcpy.da.UpdateCursor(landparcelsClass, fields) as cursor:
            for land_row in cursor:
                geom_land = land_row[1]
                geom_land_prj = geom_land.projectAs(arcpy.SpatialReference(32643))

                total_area = 0
                for builtup_row in arcpy.da.SearchCursor(builtupClass, ["SHAPE@", polygon_area]):
                    geom_builtup = builtup_row[0]
                    area_builtup = builtup_row[1]
                    geom_builtup_prj = geom_builtup.projectAs(arcpy.SpatialReference(32643))

                    if geom_land_prj.overlaps(geom_builtup_prj) or geom_land_prj.contains(geom_builtup_prj):
                        total_area += area_builtup

                land_row[2] = total_area
                cursor.updateRow(land_row)
        del cursor
