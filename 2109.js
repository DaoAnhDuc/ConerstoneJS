document.getElementById('select').addEventListener('change',function(e){
    if($(this).val() == "1x1"){
    $('#image-content').html(`
      <div id="img1x1" class="imageActive">
        <div id="div1">

        </div>
      </div>
      `);
    }
    if($(this).val() == "1x2"){
      $('#image-content').html(`
        <div id="img1x2-1" class="imageActive">
        <div id="div1">

        </div>
        </div>
        <div id="img1x2-2">

        </div>
        `);
    }
    if($(this).val() == "2x2"){
      $('#image-content').html(`
        <div id="img2x2-1" class="imageActive">
        <div id="div1">

        </div>
        </div>
        <div id="img2x2-2">

        </div>
        <div id="img2x2-3">

        </div>
        <div id="img2x2-4">

        </div>
        `);
    }
    if($(this).val() == "3x3"){
      $('#image-content').html(`
        <div id="img3x3-1" class="imageActive">
        <div id="div1">

        </div>
        </div>
        <div id="img3x3-2">

        </div>
        <div id="img3x3-3">

        </div>
        <div id="img3x3-4">

        </div>
        <div id="img3x3-5">

        </div>
        <div id="img3x3-6">

        </div>
        <div id="img3x3-7">

        </div>
        <div id="img3x3-8">

        </div>
        <div id="img3x3-9">

        </div>
        `);
    }
    $('#image-content div').on('click', function () {
        $('#image-content div').removeClass('imageActive');
        ($(this)).addClass('imageActive');
    });
});

$('#image-content div').on('click', function () {
    $('#image-content div').removeClass('imageActive');
    ($(this)).addClass('imageActive');
});
$('#tblStudy canvas').on('click', function () {
    $('#tblStudy canvas').removeClass('imageActive');
    ($(this)).addClass('imageActive');
});
$('#iconGeneral button').on('click', function () {
    $('#iconGeneral button').removeClass('btnActive');
    $(this).addClass('btnActive');
})
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.init();
const listImage = [];
const listPatient = [];
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
let addData = new Promise((res, rej) => {
    document.getElementById('selectFile').addEventListener('change', function (e) {
        let count = 0;
        let listFiles = e.target.files
        for (let i = 0; i < listFiles.length; i++) {
            const file = listFiles[i];
            console.log(file);
            const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
            console.log(imageId);

            cornerstone.loadImage(imageId).then(function (image) {

                const dicomImage = {};
                dicomImage.PatientID = image.data.string('x00100020');
                dicomImage.StudyInstanceUID = image.data.string('x0020000d');
                dicomImage.SeriesIntanceUID = image.data.string('x0020000e');
                dicomImage.ImagePositionPatient = image.data.string('x00200032');
                dicomImage.Image = image;
                listImage.push(dicomImage);
                count++;
            }).then(function () {
                if (count == listFiles.length) {
                    // console.log(listImage);
                    const arrPatienID = [];
                    for (let i = 0; i < listFiles.length; i++) {
                        arrPatienID.push(listImage[i].PatientID);
                    }
                    var x = [...new Set(arrPatienID)];

                    var listPatient = [];
                    for (let i = 0; i < x.length; i++) {
                        $('#tblPatient').append(`<tr><td>${x[i]}</td></tr>`);
                        let patient = {};
                        patient.PatientID = x[i];
                        patient.ListStudy = [];
                        arrStudy = [];
                        for (let j = 0; j < listImage.length; j++) {
                            if (x[i] == listImage[j].PatientID) {
                                let study = {};
                                study.StudyInstanceUID = listImage[j].StudyInstanceUID;
                                arrStudy.push(study);
                            }
                        };
                        var arrStudyInstanceUID = [];
                        arrStudyInstanceUID[i] = [];
                        for (let k = 0; k < arrStudy.length; k++) {
                            arrStudyInstanceUID[i].push(arrStudy[k].StudyInstanceUID);
                        }
                        arrStudyInstanceUID[i] = [...new Set(arrStudyInstanceUID[i])];


                        for (let k = 0; k < arrStudyInstanceUID[i].length; k++) {
                            let study = {};
                            study.ListSeies = [];
                            study.StudyInstanceUID = arrStudyInstanceUID[i][k];

                            ListSeies = [];
                            for (let m = 0; m < listImage.length; m++) {
                                // let image = listImage[m].Image;
                                if (arrStudyInstanceUID[i][k] == listImage[m].StudyInstanceUID) {

                                    // ListSeies.push(image);
                                    ListSeies.push(listImage[m].SeriesIntanceUID);
                                }
                            }
                            let c = [...new Set(ListSeies)];
                            for (let t = 0; t < c.length; t++) {
                                let series = {};
                                series.SeriesIntanceUID = c[t];
                                series.Image = [];
                                series.ImagePositionPatient = [];
                                for (let g = 0; g < listImage.length; g++) {
                                    if (c[t] == listImage[g].SeriesIntanceUID) {
                                        series.Image.push(listImage[g].Image);
                                        series.ImagePositionPatient.push(listImage[g].ImagePositionPatient);
                                    }
                                }
                                study.ListSeies.push(series);
                            }
                            patient.ListStudy.push(study);
                        }
                        listPatient.push(patient);
                    }
                    console.log(listPatient);
                    $('#tblPatient').on('click', 'td', function () {
                        $('.tab-content div').removeClass('in active');
                        $('#study').addClass('in active');
                        $(".nav li").removeClass('active1');
                        $("#StudyActive").addClass('active1');
                        $('#tblStudy').html("");
                        for (let i = 0; i < listPatient.length; i++) {
                            if (listPatient[i].PatientID == $(this).text()) {
                                for (let j = 0; j < listPatient[i].ListStudy.length; j++) {
                                    $('#tblStudy').append(`
                                            <div id="studyImg${j}" class="studyImage" title="${listPatient[i].ListStudy[j].StudyInstanceUID}">
                                            </div>
                                    `);
                                    for (let k = 0; k < listImage.length; k++) {
                                        if (listPatient[i].ListStudy[j].StudyInstanceUID == listImage[k].StudyInstanceUID) {
                                            let imgId = (listImage[k].Image.imageId);
                                            let element = $(`#studyImg${j}`)[0];
                                            cornerstone.enable(element);
                                            cornerstone.loadImage(imgId).then(function (img) {
                                                cornerstone.displayImage(element, img);
                                            });
                                            break;
                                        }
                                    }

                                }
                            }
                        }
                    });
                    $('#tblStudy').on('click', 'div', function () {
                        $('#tblStudy').removeClass('active1');
                        $(this).addClass('active1');
                        $('#tblSeries').html("");
                        $('#tblImage').html("");
                        for (let i = 0; i < x.length; i++) {
                            for (let j = 0; j < listPatient[i].ListStudy.length; j++) {
                                if ($(this).attr('title') == listPatient[i].ListStudy[j].StudyInstanceUID) {
                                    //    console.log(listPatient[i].ListStudy[j].ListSeies.length);
                                    for (let k = 0; k < listPatient[i].ListStudy[j].ListSeies.length; k++) {
                                        $('#tblSeries').append(`
                                            <div id="seriesImg${k}" class="seriesImage" title="${listPatient[i].ListStudy[j].ListSeies[k].SeriesIntanceUID}">
                                            </div>
                                        `);
                                        for (let h = 0; h < listImage.length; h++) {
                                            if (listPatient[i].ListStudy[j].ListSeies[k].SeriesIntanceUID == listImage[h].SeriesIntanceUID) {
                                                let imgId = (listImage[h].Image.imageId);
                                                let element = $(`#seriesImg${k}`)[0];
                                                cornerstone.enable(element);
                                                cornerstone.loadImage(imgId).then(function (img) {
                                                    cornerstone.displayImage(element, img);
                                                })
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                    $('#tblSeries').on('click', 'div', function () {
                        $('#image').html("");
                        for (let i = 0; i < x.length; i++) {
                            for (let j = 0; j < listPatient[i].ListStudy.length; j++) {
                                for (let k = 0; k < listPatient[i].ListStudy[j].ListSeies.length; k++) {
                                    if (listPatient[i].ListStudy[j].ListSeies[k].SeriesIntanceUID == $(this).attr('title')) {
                                        // console.log(listPatient[i].ListStudy[j].ListSeies[k].Image.length);
                                        let series = [];
                                        let SeriesIDImage = []
                                        for (let index = 0; index < listPatient[i].ListStudy[j].ListSeies[k].Image.length; index++) {
                                            let seriesImg = {};
                                            seriesImg.imageId = listPatient[i].ListStudy[j].ListSeies[k].Image[index].imageId;
                                            // console.log(listPatient[i]);
                                            let imgPP = listPatient[i].ListStudy[j].ListSeies[k].ImagePositionPatient[index];
                                            // console.log(imgPP);
                                            
                                            let n = parseFloat(imgPP.slice(imgPP.lastIndexOf("\\")+1,imgPP.length));
                                            seriesImg.ImagePositionPatient = n;
                                            series.push(seriesImg);
                                        }
                                        // console.log(series);
                                        series.sort(function(a,b){
                                            return a.ImagePositionPatient - b.ImagePositionPatient;
                                        })
                                        for(let m =0; m < series.length; m++){
                                            SeriesIDImage.push(series[m].imageId);                                            
                                        }
                                        // console.log(SeriesIDImage);
                                        
                                        
                                        const imageIds = SeriesIDImage.map(seriesImage => `${seriesImage}`);
                                        const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;
                                        const stack = {
                                            currentImageIdIndex: 0,
                                            imageIds
                                        }
                                        let element1 = $('.imageActive')[0];
                                        cornerstone.enable(element1);
                                        cornerstone.loadImage(imageIds[0]).then((image) => {
                                            // console.log(image.data.string("x00080080"));
                                            element1.addEventListener(cornerstone.EVENTS.IMAGE_RENDERED,function(e){
                                                console.log(e.detail);
                                                
                                                $('#div1').html("PatientName: "+e.detail.image.data.string('x00100010')
                                                +"<br> Modality:"+e.detail.image.data.string('x00080060')
                                                +"<br> Age:"+e.detail.image.data.string('x00101010')
                                                +"<br> PatientID"+e.detail.image.data.string('x00100020')
                                                +"<br> Date:"+e.detail.image.data.string('x00080020')
                                                +"<br> ImagePositionPatient:"+e.detail.image.data.string('x00200032')
                                                +"<br>"+cornerstoneTools.getToolState(element1,'stack').data[0].currentImageIdIndex+"/"
                                                +(series.length-1)
                                                );

                                            })
                                            cornerstone.displayImage(element1, image)
                                            cornerstoneTools.addStackStateManager(element1, ['stack'])
                                            cornerstoneTools.addToolState(element1, 'stack', stack)
                                            cornerstoneTools.getToolState(element1,'stack');
                                            
                                        })
                                        cornerstoneTools.addTool(StackScrollMouseWheelTool)
                                        cornerstoneTools.setToolActive('StackScrollMouseWheel', {})
                                        $('#ResetTool').on('click', function (e) {
                                            cornerstone.reset(element1);
                                            cornerstone.updateImage(element1);                                   
                                        });
                                        document.getElementById('hFlip').addEventListener('click', function (e) {
                                            const viewport = cornerstone.getViewport(element1);
                                            viewport.hflip = !viewport.hflip;
                                            cornerstone.setViewport(element1, viewport);
                                        });
                                        
                                        document.getElementById('vFlip').addEventListener('click', function (e) {
                                            const viewport = cornerstone.getViewport(element1);
                                            viewport.vflip = !viewport.vflip;
                                            cornerstone.setViewport(element1, viewport);
                                        });
                                        
                                        document.getElementById('lRotate').addEventListener('click', function (e) {
                                            const viewport = cornerstone.getViewport(element1);
                                            viewport.rotation-=90;
                                            cornerstone.setViewport(element1, viewport);
                                        });
                                        
                                        document.getElementById('rRotate').addEventListener('click', function (e) {
                                            const viewport = cornerstone.getViewport(element1);
                                            viewport.rotation+=90;
                                            cornerstone.setViewport(element1, viewport);
                                        });                                       
                                    }
                                }
                            }
                        }
                    })
                }
            });
        };
    });
});
// $('#Disconnect').on("click", function () {
//     cornerstoneTools.removeTool('DragProbe');
//     cornerstoneTools.removeTool('Magnify');
//     cornerstoneTools.removeTool('Pan');
//     cornerstoneTools.removeTool('Rotate');
//     cornerstoneTools.removeTool('ScaleOverlay');
//     cornerstoneTools.removeTool('WwwcRegion');
//     cornerstoneTools.removeTool('Wwwc');
//     cornerstoneTools.removeTool('ZoomMouseWheel');
//     cornerstoneTools.removeTool('ZoomTouchPinch');
//     cornerstoneTools.removeTool('DragProbe');
//     cornerstoneTools.removeTool('DragProbe');
//     cornerstoneTools.removeTool('DragProbe');
//     cornerstoneTools.removeTool('DragProbe');
// });
$('#EraserTool').on("click", function () {
    const EraserTool = cornerstoneTools.EraserTool;
    cornerstoneTools.addTool(EraserTool)
    cornerstoneTools.setToolActive('Eraser', { mouseButtonMask: 1 })
});
$('#DragProbeTool').on("click", function () {
    const DragProbeTool = cornerstoneTools.DragProbeTool;
    cornerstoneTools.addTool(DragProbeTool)
    cornerstoneTools.setToolActive('DragProbe', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('DragProbe')
    })
});
$('#MagnifyTool').on("click", function () {
    const MagnifyTool = cornerstoneTools.MagnifyTool;
    cornerstoneTools.addTool(MagnifyTool)
    cornerstoneTools.setToolActive('Magnify', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('Magnify')
    })
})
$('#PanTool').on("click", function () {
    const PanTool = cornerstoneTools.PanTool;
    cornerstoneTools.addTool(PanTool)
    cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('Pan')
    })
});
$('#PanTool').on("click", function () {
    const PanTool = cornerstoneTools.PanTool;
    cornerstoneTools.addTool(PanTool)
    cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('Pan')
    })
});


$('#RotateTool').on('click', function () {
    const RotateTool = cornerstoneTools.RotateTool;
    cornerstoneTools.addTool(RotateTool)
    cornerstoneTools.setToolActive('Rotate', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('Rotate')
    })
})
$('#ScaleOverlayTool').on('click', function () {
    const ScaleOverlayTool = cornerstoneTools.ScaleOverlayTool;
    cornerstoneTools.addTool(ScaleOverlayTool)
    cornerstoneTools.setToolActive('ScaleOverlay', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('ScaleOverlay')
    })
})
$('#WWWCRegionTool').on('click', function () {
    const WwwcRegionTool = cornerstoneTools.WwwcRegionTool;
    cornerstoneTools.addTool(WwwcRegionTool)
    cornerstoneTools.setToolActive('WwwcRegion', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('WwwcRegion')
    })
})

$('#WwwcTool').on('click', function () {
    const WwwcTool = cornerstoneTools.WwwcTool;
    cornerstoneTools.addTool(WwwcTool)
    cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('Wwwc')
    })
})
$('#ZoomMouseWheelTool').on('click', function () {
    const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;
    cornerstoneTools.addTool(ZoomMouseWheelTool)
    cornerstoneTools.setToolActive('ZoomMouseWheel', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('ZoomMouseWheel')
    })
})
$('#ZoomTouchPinchTool').on('click', function () {
    const ZoomTouchPinchTool = cornerstoneTools.ZoomTouchPinchTool;
    cornerstoneTools.addTool(ZoomTouchPinchTool)
    cornerstoneTools.setToolActive('ZoomTouchPinch', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('ZoomTouchPinch')
    })
})
$('#ZoomTool').on('click', function () {
    const ZoomTool = cornerstoneTools.ZoomTool;
    cornerstoneTools.addTool(cornerstoneTools.ZoomTool, {
        // Optional configuration
        configuration: {
            invert: false,
            preventZoomOutsideImage: false,
            minScale: .1,
            maxScale: 20.0,
        }
    });
    cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('Zoom')
    })
})
$('#AngleTool').on('click', function () {
    const AngleTool = cornerstoneTools.AngleTool;
    cornerstoneTools.addTool(AngleTool)
    cornerstoneTools.setToolActive('Angle', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('Angle');
        cornerstone.updateImage(element);
    })
})
$('#ArrowAnnotateTool').on('click', function () {
    const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;
    cornerstoneTools.addTool(ArrowAnnotateTool)
    cornerstoneTools.setToolActive('ArrowAnnotate', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('ArrowAnnotate');
        cornerstone.updateImage(element);
    })
})
$('#BidirectionalTool').on('click', function () {
    const BidirectionalTool = cornerstoneTools.BidirectionalTool;
    cornerstoneTools.addTool(BidirectionalTool)
    cornerstoneTools.setToolActive('Bidirectional', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('Bidirectional');
        cornerstone.updateImage(element);
    })
})
$('#CobbAngleTool').on('click', function () {
    const CobbAngleTool = cornerstoneTools.CobbAngleTool;
    cornerstoneTools.addTool(CobbAngleTool)
    cornerstoneTools.setToolActive('CobbAngle', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('CobbAngle');
        cornerstone.updateImage(element);
    })
})
$('#EllipticalRoiTool').on('click', function () {
    const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool;
    cornerstoneTools.addTool(EllipticalRoiTool)
    cornerstoneTools.setToolActive('EllipticalRoi', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('EllipticalRoi');
        cornerstone.updateImage(element);
    })
})
$('#FreehandMouseTool').on('click', function () {
    const FreehandMouseTool = cornerstoneTools.FreehandMouseTool;
    cornerstoneTools.addTool(FreehandMouseTool)
    cornerstoneTools.setToolActive('FreehandMouse', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('FreehandMouse');
        cornerstone.updateImage(element);
    })
})
$('#LengthTool').on('click', function () {
    const LengthTool = cornerstoneTools.LengthTool;
    cornerstoneTools.addTool(LengthTool)
    cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('Length');
        cornerstone.updateImage(element);
    })
})
$('#ProbeTool').on('click', function () {
    const ProbeTool = cornerstoneTools.ProbeTool;
    cornerstoneTools.addTool(ProbeTool)
    cornerstoneTools.setToolActive('Probe', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('Probe');
        cornerstone.updateImage(element);
    })
})
$('#RectangleRoiTool').on('click', function () {
    const RectangleRoiTool = cornerstoneTools.RectangleRoiTool;
    cornerstoneTools.addTool(RectangleRoiTool)
    cornerstoneTools.setToolActive('RectangleRoi', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('RectangleRoi');
        cornerstone.updateImage(element);
    })
})
$('#TextMarkerTool').on('click', function () {
    const TextMarkerTool = cornerstoneTools.TextMarkerTool
    // set up the markers configuration
    const configuration = {
        markers: ['F5', 'F4', 'F3', 'F2', 'F1'],
        current: 'F5',
        ascending: true,
        loop: true,
    }
    cornerstoneTools.addTool(TextMarkerTool, { configuration })
    cornerstoneTools.setToolActive('TextMarker', { mouseButtonMask: 1 })
    $("#disabled").on("click", function () {
        cornerstoneTools.removeTool('TextMarker')
        cornerstone.updateImage(element);
    })
})



