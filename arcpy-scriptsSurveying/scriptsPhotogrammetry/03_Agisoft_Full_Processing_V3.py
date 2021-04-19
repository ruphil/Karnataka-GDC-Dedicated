#Python script to automate the processing of UAV photographs using Agisoft Metashape Professional version 1.5.4
#Python Script version: 2.0
#Updated on: 07.05.2020

#Import statement
import os, Metashape as ps, math, textwrap
global doc
doc = Metashape.app.document
Metashape.app.console.clear()

#Grid ID input
GridID = Metashape.app.getString(label = "Enter Folder Name / Area ID / Grid ID:")

#Path to Photos
path_photos = Metashape.app.getExistingDirectory("Select Geo-Tagged Image Folder")

#Creating New Chunk
chunk = doc.chunks
doc.remove(chunk)
doc.addChunk()
chunk = doc.chunks[-1]
chunk.label = GridID.upper()

#Loading Images
image_list = os.listdir(path_photos)
photo_list = list()
for photo in image_list:
   photo_list.append(path_photos + "\\" + photo)
chunk.addPhotos(photo_list)

#Output Location
output_path = Metashape.app.getExistingDirectory("Select Folder to Save Output & Agisoft Project")

#Enable Log File
Metashape.app.console.clear()
file=open(output_path + "\\" + GridID.upper() + "_LOG" + ".txt", "w+")
file.close()
Metashape.app.settings.log_enable = True
Metashape.app.settings.log_path = output_path + "\\" + GridID.upper() + "_LOG" + ".txt"

#Information
print("------------------------------------------------------------------------")
print("======================== " + "Area/Grid ID = " + GridID.upper() + " ========================")
print("------------------------------------------------------------------------")

#Coordinate Reference System
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
chunk.camera_location_accuracy = Metashape.Vector([0.03,0.03,0.03])

#Project Save As
doc.save(path=output_path + "\\" + GridID.upper() + ".psx")

#Align Photos
print("------------------------------------------------------------------------")
print("============================= Align Photos =============================")
print("------------------------------------------------------------------------")
chunk = doc.chunk
chunk.matchPhotos(accuracy=Metashape.HighAccuracy, 
                  generic_preselection=False, 
                  reference_preselection=True,
                  keypoint_limit=40000, 
                  tiepoint_limit=4000,
                  filter_mask=False,
                  mask_tiepoints=False)             
chunk.alignCameras(adaptive_fitting=True)
doc.save()

#Duplicate Chunk
print("------------------------------------------------------------------------")
print("============================ Duplicate Chunk ===========================")
print("------------------------------------------------------------------------")
chunk.copy()
doc.chunk=doc.chunks[0]
doc.save()

#Total Error Calculation Function
def TotalErrorCalc():
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
   return TotalError

#Otimization of Camera Alignment Errors Function
def OptCameras():
   chunk.optimizeCameras(fit_f=True, fit_cx=True, fit_cy=True, fit_b1=True, fit_b2=True,
                         fit_k1=True, fit_k2=True, fit_k3=True, fit_k4=False, fit_p1=True,
                         fit_p2=True, fit_p3=False, fit_p4=False, adaptive_fitting=True,
                         tiepoint_covariance=False)

def Optimization():
   THRESHOLD = 1 #percentage values for selection
   print("Error Removal Threshold: {0}%".format(THRESHOLD))
   
   """ Reduce Reconstruction Uncertainty """
   pnts_init = len(pc.points)
   print("Points before Reconstruction Uncertainty Reduction: {0}".format(pnts_init))
   fltr = ps.PointCloud.Filter()
   fltr.init(chunk, ps.PointCloud.Filter.ReconstructionUncertainty)
   values = fltr.values.copy()
   values.sort()
   thresh = values[int(pnts_init * (1-THRESHOLD/100))]
   fltr.selectPoints(thresh)
   nselected = len([p for p in chunk.point_cloud.points if p.selected])
   pc.removeSelectedPoints()
   print("Removed {0} points".format(nselected))
   OptCameras()

   """ Reduce Projection Accuracy """
   pnts_init = len(pc.points)
   print("Points before Projection Accuracy Reduction: {0}".format(pnts_init))
   fltr = ps.PointCloud.Filter()
   fltr.init(chunk, ps.PointCloud.Filter.ProjectionAccuracy)
   values = fltr.values.copy()
   values.sort()
   thresh = values[int(pnts_init * (1-THRESHOLD/100))]
   fltr.selectPoints(thresh)
   nselected = len([p for p in chunk.point_cloud.points if p.selected])
   pc.removeSelectedPoints()
   print("Removed {0} points".format(nselected))
   OptCameras()

   """ Reduce Reprojection Error """
   pnts_init = len(pc.points)
   print("Points before Reprojection Error Reduction: {0}".format(pnts_init))
   fltr = ps.PointCloud.Filter()
   fltr.init(chunk, ps.PointCloud.Filter.ReprojectionError)
   values = fltr.values.copy()
   values.sort()
   thresh = values[int(pnts_init* (1-THRESHOLD/100))]
   fltr.selectPoints(thresh)
   nselected = len([p for p in chunk.point_cloud.points if p.selected])
   pc.removeSelectedPoints()
   print("Removed {0} points".format(nselected))
   OptCameras()


#Optimization of Camera Alignment
print("------------------------------------------------------------------------")
print("==================== Camera Alignment Optimization =====================")
print("------------------------------------------------------------------------")
pc = chunk.point_cloud
int_total = len(pc.points)
print("Total number of initial points: " + str(int_total))
print("Total Camera Alignment Error Before Optimization in (m): " + str(TotalErrorCalc()))

iter_nos = 1
if TotalErrorCalc() <= 0.03:
    print("No need of Camera Alignment Optimization")
    final_total = len(pc.points)

else:
    while TotalErrorCalc() > 0.03:
        print("======================= No. of Iteration: " + str(iter_nos) + " =======================")
        Optimization()
        final_total = len(pc.points)
        print("Total number of points after Optimization: " + str(final_total))
        print("Total Camera Alignment Error After Optimization in (m): " + str(TotalErrorCalc()))
        iter_nos = iter_nos + 1

doc.save()

print("------------------------------------------------------------------------")
print("====================  Build DEM and Orthomosaics =======================")
print("------------------------------------------------------------------------")

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

print("------------------------------------------------------------------------")
print("================  Export DEM, Orthomosaics and Report ==================")
print("------------------------------------------------------------------------")

#Export Dem
chunk.exportDem(path=output_path + "\\" + GridID.upper() + "_DEM.tif", image_format = Metashape.ImageFormatTIFF,
                  raster_transform=Metashape.RasterTransformNone, projection = Metashape.CoordinateSystem("EPSG::32643"),
                  dx=0.10, dy=0.10, tiff_big=True, tiff_tiled=True, tiff_overviews=True,
                  network_links=True)

#Export Orthomosaics
chunk.exportOrthomosaic(path=output_path + "\\" + GridID.upper() + "_ORTHO.tif",image_format = Metashape.ImageFormatTIFF,
                  raster_transform=Metashape.RasterTransformNone, projection = Metashape.CoordinateSystem("EPSG::32643"),
                  dx=0.03, dy=0.03, write_kml=False, write_world=False, write_scheme=False, write_alpha=True,
                  tiff_compression=Metashape.TiffCompressionJPEG, tiff_big=True, tiff_tiled=True,
                  tiff_overviews=True, jpeg_quality=100, network_links=True, white_background=False)

#Export Report
chunk.exportReport(path=output_path + "\\" + GridID.upper() + "_REPORT.pdf", title= "GRID ID: " + str(GridID.upper()), page_numbers = True)
doc.save()

#Completion message
message = "Processing successfully completed and all the outputs are saved in " + str(output_path)
print("=================== !!! Script finished !!! ===================")
Metashape.app.messageBox(textwrap.fill(message, width=40))

#Disable Log File
Metashape.app.settings.log_enable = False
