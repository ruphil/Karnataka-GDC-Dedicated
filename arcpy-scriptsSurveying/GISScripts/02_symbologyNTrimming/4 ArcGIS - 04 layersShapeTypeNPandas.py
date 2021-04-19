import arcpy

print("running")

inDir = "D:/inGIS/"
outDir = "D:/outGIS/"
templateLayersPath = outDir + "templateLayers/"

lyr = templateLayersPath + "ATM.lyr"

desc = arcpy.Describe(lyr)
properties = ['DSID', 'FIDSet', 'GCSTransforms', 'JPEGQuality',
          'LERCTolerance', 'MExtent', 'OIDFieldName', 'ZClusterTolerance',
          'ZExtent', 'ZFactor', 'accumulators', 'aliasName',
          'allowedCompressionMethods', 'allowedFields',
          'allowedMensurationCapabilities', 'allowedMosaicMethods',
          'alternateName', 'applyColorCorrection', 'areaFieldName',
          'areaOfInterest', 'associationSource', 'attributes',
          'backwardPathLabel', 'bandCount', 'baseName', 'batch',
          'blendWidth', 'blendWidthUnits', 'canVersion', 'cardinality',
          'catalogPath', 'categories', 'cellSizeToleranceFactor',
          'changeTracked', 'checkParameters', 'children',
          'childrenExpanded', 'childrenNames', 'classKey',
          'clipToBoundary', 'clipToFootprint', 'clusterTolerance',
          'compressionType', 'connectionProperties', 'connectionString',
          'connectionsFeatureClass', 'constraintCount',
          'createDirtyAreaForAnyAttributeUpdate', 'createdAtFieldName',
          'creationTime', 'creatorFieldName', 'currentRelease',
          'dataCollection', 'dataElement', 'dataElementType',
          'dataType', 'datasetType', 'defaultCompressionMethod',
          'defaultMensurationCapability', 'defaultMosaicMethod',
          'defaultProcessingTemplate', 'defaultResamplingMethod',
          'defaultSubtypeCode', 'defaultTravelModeName', 'description',
          'destinationClassKeys', 'destinationClassNames',
          'diagramClassName', 'dimensionAttributes', 'dimensionNames',
          'dimensionValues', 'directions', 'domainNetworks', 'domains',
          'edgeSources', 'editedAtFieldName', 'editorFieldName',
          'editorTrackingEnabled', 'elevationModel', 'endTimeField',
          'errorMessage', 'errorNumber', 'evaluationOrder',
          'excludeFromClientEvaluation', 'excludeRestrictedElements',
          'extension', 'extensionProperties', 'extent', 'featureClass',
          'featureClassNames', 'featureClassType', 'featureType',
          'fieldInfo', 'fieldName', 'fieldNames', 'fields', 'file',
          'fileCount', 'findClosest', 'footprintMayContainNoData',
          'format', 'forwardPathLabel', 'fullPropsRetrieved',
          'geometryStorage', 'globalID', 'globalIDFieldName',
          'hasEdgeTagValues', 'hasFAT', 'hasGlobalID', 'hasM',
          'hasNodeTagValues', 'hasOID', 'hasSpatialIndex',
          'hasStatistics', 'hasTriangleTagValues', 'hasZ', 'height',
          'hierarchyAttribute', 'hierarchyLevelCount',
          'historicalTrafficData', 'id', 'ignoreInvalidLocations',
          'impedance', 'indexes', 'is2D', 'is3D', 'isArchived',
          'isAttachmentRelationship', 'isAttributed', 'isAutoCAD',
          'isBuildable', 'isComposite', 'isDGN', 'isDelaunay',
          'isEditingRestrictive', 'isEnabled', 'isIndexed', 'isInteger',
          'isMultidimensional', 'isPseudo', 'isRedefined', 'isReflexive',
          'isTimeInUTC', 'isVersioned', 'itemSet', 'itemType', 'json',
          'junctionSources', 'keyType', 'layer', 'lengthFieldName',
          'liveTrafficData', 'locatorCount', 'locators',
          'maxDownloadImageCount', 'maxDownloadSizeLimit',
          'maxRastersPerMosaic', 'maxRecordsReturned', 'maxRequestSizeX',
          'maxRequestSizeY', 'maxValueForHierarchyX',
          'maximumGeneratedErrorCount', 'meanCellHeight',
          'meanCellWidth', 'metadataRetrieved', 'minimalDirtyAreaSize',
          'minimumPixelContribution', 'modelName', 'mosaicOperator',
          'multidimensionalInfo', 'name', 'nameString',
          'needsUpdateStatistics', 'network', 'networkAttributes',
          'networkType', 'noDataValue', 'notification', 'numberDecimals',
          'optimizations', 'orderBaseValue', 'orderField',
          'originClassKeys', 'originClassNames',
          'orphanJunctionFeatureClassName', 'outputWidth',
          'overrideFieldName', 'parameterCount', 'parameters',
          'parcelTypeNames', 'parcelTypes', 'path', 'permanent',
          'pixelType', 'pjson', 'pointCount', 'pointsFeatureClass',
          'primaryField', 'proVersion', 'processingTemplates',
          'rasterFieldName', 'rasterMetadataLevel', 'recordsFeatureClass',
          'referenced', 'referencesExternalService',
          'relationshipClassNames', 'relationshipRules', 'release',
          'representations', 'requireShapeOverride',
          'requiredGeodatabaseClientVersion', 'restrictions',
          'ruleIDFieldName', 'schemaGeneration', 'scriptExpression',
          'searchTolerance', 'sensorType',
          'serviceTerritoryFeatureClassName', 'severity',
          'shapeFieldName', 'shapeType', 'solverName', 'solverProperties',
          'sortAscending', 'sources', 'spatialReference', 'startPosition',
          'startTimeField', 'subtypeCode', 'subtypeFieldName',
          'supportsDirections', 'supportsHistoricalTrafficData',
          'supportsLiveTrafficData', 'supportsTurns',
          'systemJunctionSource', 'table', 'tableType', 'tags',
          'terminalConfigurations', 'timeValueFormat',
          'timeZoneAttributeName', 'timeZoneTableName', 'topology',
          'topologyEnabled', 'trafficSupportType', 'triggeringEvents',
          'turnSources', 'type', 'uTurns', 'useHierarchy', 'useTime',
          'userEditable', 'usesRelativePath', 'variableAttributes',
          'variableNames', 'versionedView', 'viewpointSpacingX',
          'viewpointSpacingY', 'whereClause', 'width',
          'workspaceFactoryProgID', 'workspaceType']
for prop in properties:
     try:
         print "{}:\t{}".format (prop, getattr (desc, prop))
     except AttributeError:
         continue

##templateMXD = inDir + "template.mxd"
##
##templatemxd = arcpy.mapping.MapDocument(templateMXD)
##templatelyrs = arcpy.mapping.ListLayers(templatemxd)
##
##for tlyr in templatelyrs:
##    tlyr_name = tlyr.name
##    for fClass in featureClasses:
##        if tlyr_name == fClass[0]:
##            print(tlyr_name)
##            arcpy.MakeFeatureLayer_management(fClass[2], tlyr_name)
##            newlayer = arcpy.mapping.Layer(tlyr_name)
##            print()

            
 


##templatemxd = arcpy.mapping.MapDocument(inDir + "template.mxd")
##
##for lyr in arcpy.mapping.ListLayers(templatemxd):
##    print(lyr.name)
##    desc = arcpy.Describe(lyr)
##    print(desc.shapeType)
##
##del templatemxd

##lyr = outDir + "BEACH_POINT.lyr"
##
##lyrDesc = arcpy.Describe(lyr)
##print(lyrDesc.shapeType)


print("done")



##from os import listdir
##from os.path import isfile, join
##
##print("starting")
##
##inDir = "D:\\inGIS\\"
##outDir = "D:\\outGIS\\"
##templateLayersPath = outDir + "templateLayers\\"
##
##lyr = templateLayersPath + "AERODROME_CELL.lyr"
##print(lyr)
##newlayer = arcpy.mapping.Layer(lyr)
##desc = arcpy.Describe(newlayer)
##print(dir(desc))
##print(desc.shapeType)
##
####lyrFiles = [f for f in listdir(templateLayersPath) if isfile(join(templateLayersPath, f))]
####for lyr in lyrFiles:
####    lyrPath = templateLayersPath + lyr
####    print(lyrPath)
####    desc = arcpy.Describe(lyrPath)
####    print(desc)
####    print(desc.shapeType)
######    print(tlyr.name, desc)
##
##print("done")
##
####atmlyr = templateLayersPath + "AERODROME_CELL.lyr"
######desc = arcpy.Describe(atmlyr)
####arcpy.MakeFeatureLayer_management(atmlyr, "jack")
####newlayer = arcpy.mapping.Layer("jack")
####print(newlayer)
