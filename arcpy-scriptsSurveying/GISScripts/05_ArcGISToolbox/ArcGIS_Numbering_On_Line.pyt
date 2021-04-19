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
        self.label = "Numbering_On_Line"
        self.description = ""
        self.canRunInBackground = False

    def getParameterInfo(self):
        """Define parameter definitions"""
        param0 = arcpy.Parameter(
            displayName="PROPERTY_BOUNDARY",
            name="in_properties",
            datatype="GPLayer",
            parameterType="Required",
            direction="Input")

        param1 = arcpy.Parameter(
            displayName="SEQUENTIAL_NUMBERING_FIELDNAME",
            name="out_numbers",
            datatype="GPString",
            parameterType="Required",
            direction="Input")

        param2 = arcpy.Parameter(
            displayName="LINE_LAYER",
            name="in_line",
            datatype="GPLayer",
            parameterType="Required",
            direction="Input")

        param3 = arcpy.Parameter(
            displayName="LINE_FEATURE_OBJECTID",
            name="objectid",
            datatype="GPLong",
            parameterType="Required",
            direction="Input")

        param4 = arcpy.Parameter(
            displayName="LINE_FEATURE_PARTNO",
            name="partno",
            datatype="GPLong",
            parameterType="Required",
            direction="Input")
        
        param1.values = "LinearNums"
        param3.values = 0
        param4.values = 0

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

        in_properties = parameters[0].valueAsText
        out_numbers = parameters[1].valueAsText
        in_line = parameters[2].valueAsText
        objectid = parameters[3].valueAsText
        partno = parameters[4].valueAsText

        property_boundaryClass = arcpy.mapping.Layer(in_properties)
        lineClass = arcpy.mapping.Layer(in_line)

        arcpy.AddField_management(property_boundaryClass, out_numbers, "TEXT")

        objectID_linefeature = int(objectid)
        part_objectID = int(partno)
        total_linear_numbers = 1
        for line_row in arcpy.da.SearchCursor(lineClass, ["OID@", "SHAPE@"]):
            if (line_row[0] == objectID_linefeature):
                line_geom = line_row[1].projectAs(arcpy.SpatialReference(32643))
                line_part = line_geom[part_objectID]
                
                first_point = []
                second_point = []
                for pnt in line_part:
                    first_point = second_point
                    second_point = [pnt.X, pnt.Y]
                    if not first_point:
                        continue
                    
                    array = arcpy.Array([arcpy.Point(first_point[0], first_point[1]), arcpy.Point(second_point[0], second_point[1])])
                    polyline = arcpy.Polyline(array, arcpy.SpatialReference(32643))
                    
                    distance_array = []
                    for property_row in arcpy.da.SearchCursor(property_boundaryClass, ["SHAPE@"]):
                        geom_property_prj = property_row[0].projectAs(arcpy.SpatialReference(32643))
                        if polyline.crosses(geom_property_prj):
                            first_point_geom = arcpy.PointGeometry(arcpy.Point(first_point[0], first_point[1]), arcpy.SpatialReference(32643))
                            distance = round(first_point_geom.distanceTo(geom_property_prj), 2)
                            
                            distance_array.append(distance)
                    
                    distance_array = sorted(distance_array)
                    print(distance_array, len(distance_array))
                    
                    fields = ["OID@", "SHAPE@", out_numbers]
                    for distance_in_array in distance_array:
                        with arcpy.da.UpdateCursor(property_boundaryClass, fields) as cursor:
                            for property_row in cursor:
                                geom_property_prj = property_row[1].projectAs(arcpy.SpatialReference(32643))
                                if polyline.crosses(geom_property_prj):
                                    first_point_geom = arcpy.PointGeometry(arcpy.Point(first_point[0], first_point[1]), arcpy.SpatialReference(32643))
                                    distance = round(first_point_geom.distanceTo(geom_property_prj), 2)
                                    
                                    if property_row[2] == "" and distance_in_array == distance:
                                        property_row[2] = str(total_linear_numbers)
                                        cursor.updateRow(property_row)
                                        total_linear_numbers += 1
                    
