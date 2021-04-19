import os
import Metashape as ps
import math
global doc
doc = Metashape.app.document
Metashape.app.console.clear()

Metashape.app.settings.log_enable = True
Metashape.app.settings.log_path = "D:\Agisoft_Avanish_DSS_PHC_GDC\Log File\\Log_File.txt"

print("------------------------------------------------------------------------")
print("------------------------------------------------------------------------")
print("Script is written by Avanish Kumar, D.S.S., PHC GDC, Survey of India")
print("For any query pls contact at ak14@iitbbs.ac.in")
print("------------------------------------------------------------------------")
print("------------------------------------------------------------------------")

GridID = Metashape.app.getString(label = "Enter Grid ID")
project_path = 'D:\Agisoft_Avanish_DSS_PHC_GDC\Project'
doc.save(path=project_path + "\\" + GridID.upper() + ".psx")
print("Grid ID = " + GridID.upper())

#creating new chunk
chunk = doc.chunks
doc.remove(chunk)
doc.addChunk()
chunk = doc.chunks[-1]
chunk.label = GridID.upper()

#path to photos
path_photos = Metashape.app.getExistingDirectory("Select GeoTagged Image Folder")

#loading images
image_list = os.listdir(path_photos)
photo_list = list()
for photo in image_list:
   photo_list.append(path_photos + "\\" + photo)
chunk.addPhotos(photo_list)
doc.save()

#Coordinate Reference System
chunk = doc.chunk
out_crs = Metashape.CoordinateSystem("EPSG::4326")
for camera in chunk.cameras:
    if camera.reference.location:
        camera.reference.location = Metashape.CoordinateSystem.transform(camera.reference.location, chunk.crs, out_crs)
for marker in chunk.markers:
    if marker.reference.location:
        marker.reference.location = Metashape.CoordinateSystem.transform(marker.reference.location, chunk.crs, out_crs)
chunk.crs = out_crs
chunk.updateTransform()

#Camera Accuracy in (m)
chunk.camera_location_accuracy = Metashape.Vector([0.02,0.02,0.02])
doc.save()

#Align Photos
chunk.matchPhotos(accuracy=Metashape.HighAccuracy, 
                  generic_preselection=False, 
                  reference_preselection=True,
                  keypoint_limit=40000, 
                  tiepoint_limit=4000,
                  filter_mask=False,
                  mask_tiepoints=False)             
chunk.alignCameras(adaptive_fitting=True)
doc.save()

#Optimization of Camera Alignment
""" Total Error Calculation """
sums = 0
num = 0
for camera in chunk.cameras:
    if not camera.transform:
         continue
    if not camera.reference.location:
         continue

    estimated_geoc = chunk.transform.matrix.mulp(camera.center)
    error = chunk.crs.unproject(camera.reference.location) - estimated_geoc
    error = error.norm()
    sums += error**2
    num += 1
TotalError = math.sqrt(sums / num)
pc = chunk.point_cloud
int_total = len(pc.points)
print("Total number of initial points: " + str(int_total))
print("Total Camera Alignment Error Before Optimization in (m): " + str(TotalError))

""" Optimization Process """
if TotalError <= 0.02:
    print("No need of Camera Alignment Optimization")

elif TotalError <= 0.025:
    print("-----No of Iteration = 1-----")
    """ Reduce Reprojection Error """
    THRESHOLD = 10 #percentage values for selection
    print("Reprojection Error Threshold: {0}%".format(THRESHOLD))
    pc = chunk.point_cloud
    pnts_init = len(pc.points)
    print("Points before Reprojection Error Reduction: {0}".format(pnts_init))
    fltr = ps.PointCloud.Filter()
    fltr.init(chunk, ps.PointCloud.Filter.ReprojectionError)
    values = fltr.values.copy()
    values.sort()
    thresh = values[int(len(values)* (1-THRESHOLD/100))]
    fltr.selectPoints(thresh)
    nselected = len([p for p in chunk.point_cloud.points if p.selected])
    pc.removeSelectedPoints()
    print("Removed {0} points".format(nselected))

    """ Reduce Reconstruction Uncertainty """
    print("Reconstruction Uncertainty Threshold: {0}%".format(THRESHOLD))
    pnts_init = len(pc.points)- nselected
    print("Points before Reconstruction Uncertainty Reduction: {0}".format(pnts_init))
    fltr = ps.PointCloud.Filter()
    fltr.init(chunk, ps.PointCloud.Filter.ReconstructionUncertainty)
    values = fltr.values.copy()
    for i in range(len(values)):
        if values[i] >=0:
            values[i] = values[i]
        else:
            values[i] = 0
    values.sort()
    thresh = values[int(len(values) * (1-THRESHOLD/100) * (1-THRESHOLD/100)) + nselected]
    fltr.selectPoints(thresh)
    nselected1 = len([p for p in chunk.point_cloud.points if p.selected])
    nselected2 = nselected1 - nselected
    pc.removeSelectedPoints()
    print("Removed {0} points".format(nselected2))

    """ Reduce Projection Accuracy """
    print("Projection Accuracy Threshold: {0}%".format(THRESHOLD))
    pnts_init1 = pnts_init - nselected2
    print("Points before Projection Accuracy Reduction: {0}".format(pnts_init1))
    fltr = ps.PointCloud.Filter()
    fltr.init(chunk, ps.PointCloud.Filter.ProjectionAccuracy)
    values = fltr.values.copy()
    values.sort()
    thresh = values[int(pnts_init1 * (1-THRESHOLD/100)) + nselected + nselected2]
    fltr.selectPoints(thresh)
    nselected3 = len([p for p in chunk.point_cloud.points if p.selected])
    nselected4 = nselected3 - nselected1
    pc.removeSelectedPoints()
    print("Removed {0} points".format(nselected4))

    #Optimization of Camera
    print("Optimization of Camera")
    chunk.optimizeCameras(fit_f=True, fit_cx=True, fit_cy=True, fit_b1=True, fit_b2=True,
                      fit_k1=True, fit_k2=True, fit_k3=True, fit_k4=False, fit_p1=True,
                      fit_p2=True, fit_p3=False, fit_p4=False, adaptive_fitting=True,
                      tiepoint_covariance=False)

    """ Total Error Calculation """    
    sums = 0
    num = 0
    for camera in chunk.cameras:
        if not camera.transform:
            continue
        if not camera.reference.location:
            continue

        estimated_geoc = chunk.transform.matrix.mulp(camera.center)
        error = chunk.crs.unproject(camera.reference.location) - estimated_geoc
        error = error.norm()
        sums += error**2
        num += 1
    TotalError = math.sqrt(sums / num)
    pc = chunk.point_cloud
    final_total = len(pc.points)
    print("Total number of final points: " + str(final_total))
    print("Total Camera Alignment Error After Optimization in (m): " + str(TotalError))

else:
    iter_nos = 1
    while TotalError > 0.03:
        print("-----No of Iteration = " + str(iter_nos) + "-----")
        iter_nos = iter_nos + 1
        
        """ Reduce Reprojection Error """
        THRESHOLD = 10 #percentage values for selection
        print("Reprojection Error Threshold: {0}%".format(THRESHOLD))
        pc = chunk.point_cloud
        pnts_init = len(pc.points)
        print("Points before Reprojection Error Reduction: {0}".format(pnts_init))
        fltr = ps.PointCloud.Filter()
        fltr.init(chunk, ps.PointCloud.Filter.ReprojectionError)
        values = fltr.values.copy()
        values.sort()
        thresh = values[int(len(values)* (1-THRESHOLD/100))]
        fltr.selectPoints(thresh)
        nselected = len([p for p in chunk.point_cloud.points if p.selected])
        pc.removeSelectedPoints()
        print("Removed {0} points".format(nselected))

        """ Reduce Reconstruction Uncertainty """
        print("Reconstruction Uncertainty Threshold: {0}%".format(THRESHOLD))
        pnts_init = len(pc.points)- nselected
        print("Points before Reconstruction Uncertainty Reduction: {0}".format(pnts_init))
        fltr = ps.PointCloud.Filter()
        fltr.init(chunk, ps.PointCloud.Filter.ReconstructionUncertainty)
        values = fltr.values.copy()
        for i in range(len(values)):
            if values[i] >=0:
                values[i] = values[i]
            else:
                values[i] = 0
        values.sort()
        thresh = values[int(len(values) * (1-THRESHOLD/100) * (1-THRESHOLD/100)) + nselected]
        fltr.selectPoints(thresh)
        nselected1 = len([p for p in chunk.point_cloud.points if p.selected])
        nselected2 = nselected1 - nselected
        pc.removeSelectedPoints()
        print("Removed {0} points".format(nselected2))

        """ Reduce Projection Accuracy """
        print("Projection Accuracy Threshold: {0}%".format(THRESHOLD))
        pnts_init1 = pnts_init - nselected2
        print("Points before Projection Accuracy Reduction: {0}".format(pnts_init1))
        fltr = ps.PointCloud.Filter()
        fltr.init(chunk, ps.PointCloud.Filter.ProjectionAccuracy)
        values = fltr.values.copy()
        values.sort()
        thresh = values[int(pnts_init1 * (1-THRESHOLD/100)) + nselected + nselected2]
        fltr.selectPoints(thresh)
        nselected3 = len([p for p in chunk.point_cloud.points if p.selected])
        nselected4 = nselected3 - nselected1
        pc.removeSelectedPoints()
        print("Removed {0} points".format(nselected4))

        #Optimization of Camera
        print("Optimization of Camera")
        chunk.optimizeCameras(fit_f=True, fit_cx=True, fit_cy=True, fit_b1=True, fit_b2=True,
                      fit_k1=True, fit_k2=True, fit_k3=True, fit_k4=False, fit_p1=True,
                      fit_p2=True, fit_p3=False, fit_p4=False, adaptive_fitting=True,
                      tiepoint_covariance=False)

        """ Total Error Calculation """    
        sums = 0
        num = 0
        for camera in chunk.cameras:
            if not camera.transform:
                continue
            if not camera.reference.location:
                continue

            estimated_geoc = chunk.transform.matrix.mulp(camera.center)
            error = chunk.crs.unproject(camera.reference.location) - estimated_geoc
            error = error.norm()
            sums += error**2
            num += 1
        TotalError = math.sqrt(sums / num)
        pc = chunk.point_cloud
        final_total = len(pc.points)
        print("Total number of final points: " + str(final_total))
        print("Total Camera Alignment Error After Optimization in (m): " + str(TotalError))

if final_total >= 0.5 * int_total:
   doc.save()

   #Build Dense Cloud 
   chunk.buildDepthMaps(quality=Metashape.MediumQuality, filter=Metashape.ModerateFiltering, reuse_depth=False)
   chunk.buildDenseCloud(point_colors=True, keep_depth=True)
   doc.save()
   
   #Build Dem
   chunk.buildDem(source=Metashape.DenseCloudData, interpolation=Metashape.EnabledInterpolation, flip_x=False,
                  flip_y=False, flip_z=False)
   doc.save()

   #Build Orthomosaics
   chunk.buildOrthomosaic(surface=Metashape.ElevationData, blending=Metashape.MosaicBlending, fill_holes=True,
                          cull_faces=False, refine_seamlines=False, flip_x=False, flip_y=False,
                          flip_z=False)
   doc.save()
   
   #Export Dem
   output_path = 'D:\Agisoft_Avanish_DSS_PHC_GDC\Output'
   chunk.exportDem(path=output_path + "\\" + GridID.upper() + "_DEM.tif", image_format = Metashape.ImageFormatTIFF,
                   raster_transform=Metashape.RasterTransformNone, projection = Metashape.CoordinateSystem("EPSG::32643"),
                   dx=0.035, dy=0.035, tiff_big=True, tiff_tiled=True, tiff_overviews=True,
                   network_links=True)
   doc.save()
   
   #Export Orthomosaics
   chunk.exportOrthomosaic(path=output_path + "\\" + GridID.upper() + "_ORTHO.tif",image_format = Metashape.ImageFormatTIFF,
                     raster_transform=Metashape.RasterTransformNone, projection = Metashape.CoordinateSystem("EPSG::32643"),
                     dx=0.035, dy=0.035, write_kml=False, write_world=False, write_scheme=False, write_alpha=True,
                     tiff_compression=Metashape.TiffCompressionJPEG, tiff_big=True, tiff_tiled=True,
                     tiff_overviews=True, jpeg_quality=90, network_links=True, white_background=False)
   doc.save()
   
   #Export Report
   chunk.exportReport(path=output_path + "\\" + GridID.upper() + "_REPORT.pdf", title=str(GridID.upper()), page_numbers = True)
   doc.save()  
   
   #Completion message
   import textwrap
   message = "Processing successfully completed and all the outputs are saved in " + str(output_path)
   Metashape.app.messageBox(textwrap.fill(message, width=40))
   doc.save()
   
else:
   import textwrap
   message = "Total number of final points is less than 50% of initial points. Please check the geotagging of images and run the script again."
   Metashape.app.messageBox(textwrap.fill(message, 70))
