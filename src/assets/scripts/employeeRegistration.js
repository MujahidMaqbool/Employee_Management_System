﻿var imageSource;

/**
 * Created by ezgoing on 14/9/2014.
 */

"use strict";
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {
    var cropbox = function (options, el) {
        var el = el || $(options.imageBox),
            obj =
            {
                state: {},
                ratio: 1,
                options: options,
                imageBox: el,
                thumbBox: el.find(options.thumbBox),
                spinner: el.find(options.spinner),
                image: new Image(),
                getDataURL: function () {
                    var width = this.thumbBox.width(),
                        height = this.thumbBox.height(),
                        canvas = document.createElement("canvas"),
                        dim = el.css('background-position').split(' '),
                        size = el.css('background-size').split(' '),
                        dx = parseInt(dim[0]) - el.width() / 2 + width / 2,
                        dy = parseInt(dim[1]) - el.height() / 2 + height / 2,
                        dw = parseInt(size[0]),
                        dh = parseInt(size[1]),
                        sh = parseInt(this.image.height),
                        sw = parseInt(this.image.width);

                    canvas.width = width;
                    canvas.height = height;
                    var context = canvas.getContext("2d");
                    context.drawImage(this.image, 0, 0, sw, sh, dx, dy, dw, dh);
                    var imageData = canvas.toDataURL('image/png');
                    return imageData;
                },
                getBlob: function () {
                    var imageData = this.getDataURL();
                    var b64 = imageData.replace('data:image/png;base64,', '');
                    var binary = atob(b64);
                    var array = [];
                    for (var i = 0; i < binary.length; i++) {
                        array.push(binary.charCodeAt(i));
                    }
                    return new Blob([new Uint8Array(array)], { type: 'image/png' });
                },
                zoomIn: function () {
                    this.ratio *= 1.1;
                    setBackground();
                },
                zoomOut: function () {
                    this.ratio *= 0.9;
                    setBackground();
                }
            },
            setBackground = function () {
                var w = parseInt(obj.image.width) * obj.ratio;
                var h = parseInt(obj.image.height) * obj.ratio;

                var pw = (el.width() - w) / 2;
                var ph = (el.height() - h) / 2;

                el.css({
                    'background-image': 'url(' + obj.image.src + ')',
                    'background-size': w + 'px ' + h + 'px',
                    'background-position': pw + 'px ' + ph + 'px',
                    'background-repeat': 'no-repeat'
                });
            },
            imgMouseDown = function (e) {
                e.stopImmediatePropagation();

                obj.state.dragable = true;
                obj.state.mouseX = e.clientX;
                obj.state.mouseY = e.clientY;
            },
            imgMouseMove = function (e) {
                e.stopImmediatePropagation();

                if (obj.state.dragable) {
                    var x = e.clientX - obj.state.mouseX;
                    var y = e.clientY - obj.state.mouseY;

                    var bg = el.css('background-position').split(' ');

                    var bgX = x + parseInt(bg[0]);
                    var bgY = y + parseInt(bg[1]);

                    el.css('background-position', bgX + 'px ' + bgY + 'px');

                    obj.state.mouseX = e.clientX;
                    obj.state.mouseY = e.clientY;
                }
            },
            imgMouseUp = function (e) {
                e.stopImmediatePropagation();
                obj.state.dragable = false;
            },
            zoomImage = function (e) {
                e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0 ? obj.ratio *= 1.1 : obj.ratio *= 0.9;
                setBackground();
            }

        obj.spinner.show();
        obj.image.onload = function () {
            obj.spinner.hide();
            setBackground();

            el.bind('mousedown', imgMouseDown);
            el.bind('mousemove', imgMouseMove);
            $(window).bind('mouseup', imgMouseUp);
            el.bind('mousewheel DOMMouseScroll', zoomImage);
        };
        obj.image.src = options.imgSrc;
        el.on('remove', function () { $(window).unbind('mouseup', imgMouseUp) });

        return obj;
    };

    jQuery.fn.cropbox = function (options) {
        return new cropbox(options, this);
    };
}));

    var options =
       {
           thumbBox: '.thumbBox',
           spinner: '.spinner',
            imgSrc: '../images/default-img.png'
       }
    var cropper = $('.imageBox').cropbox(options);

    $(document).on("change", "#file", function () {
        var reader = new FileReader();
        reader.onload = function (e) {
            debugger;
            options.imgSrc = e.target.result;
            cropper = $('.imageBox').cropbox(options);
        }
        reader.readAsDataURL(this.files[0]);
        $('.imageBox').css({ "display": "block" });

    });

    //$(document).on("click", "#btnCrop", function () {
    //    var img = cropper.getDataURL();
    //    //var imageArray = img.split(",");
    //    var elPreview = document.getElementById("preview");

    //    var imgHtmlString = '<img src="' + img + '" style="margin-bottom:10px;border: 2px solid #d5e0f2" >';
    //    elPreview.innerHTML = "<i class='fa fa-times'></i>" + imgHtmlString;


//})
    let GetImage = function () {
        debugger;
        imageSource = cropper.getDataURL();
        ////var imageArray = img.split(",");
        //var elPreview = document.getElementById("preview");
        //var imgHtmlString = '<img src="' + imageSource + '" style="margin-bottom:10px;border: 2px solid #d5e0f2" >';
        //elPreview.innerHTML = "<i class='fa fa-times'></i>" + imgHtmlString;
    }

    $('#btnZoomIn').on('click', function () {
        cropper.zoomIn();
    });
    $('#btnZoomOut').on('click', function () {
        cropper.zoomOut();
    });

    function ConvertToCSV(objArray) {
        debugger;
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }

            str += line + '\r\n';
        }

        window.open("data:text/csv;charset=utf-8," + escape(str))
    }

    let GetReport = function (employeeList) {
        debugger;
        var employeeReportList = [];
        for (let i = 0; i < employeeList.length; i++) {
            var test = employeeList[i];
            var d = test.Date;
            d = d.split('T')[0];
            if (test.ActualTimeIn == null)
                test.ActualTimeIn = "";
            if (test.ActualTimeOut == null)
                test.ActualTimeOut = "";
            if (test.RequiredHours == null)
                test.RequiredHours = "";
            if (test.ActualHour == null)
                test.ActualHour = "";
            var items = {
                Date:  d,
                Code: test.EmployeeCode,
                Name:  test.EmployeeName,
                Designation:  test.EmployeeDesignation,
                CheckIn:  test.ActualTimeIn,
                CheckOut: test.ActualTimeOut,
                RequiredHours:  test.RequiredHours,
                HoursinOffice:  test.ActualHour
            };
            employeeReportList.push(items);
        }
        var jsonObject = JSON.stringify(employeeReportList);
        $('#report').text(ConvertToCSV(jsonObject));
    }