/**
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2012, Script Tutorials
 * http://www.script-tutorials.com/
 */

// Main initialization

 function eye(x,y,radius)
    {

        context.fillstyle="#00FF00";
        context.beginPath();
        context.arc(x,y,radius,0,2*Math.PI);
        context.stroke();

        context.beginPath();
        context.arc(x,y,radius+2,0,2*Math.PI);
        context.stroke();
    }


document.addEventListener('DOMContentLoaded', function() {


    console.log("DOMContentLoaded");
    // Global variables
    var video = document.querySelector('video');
    var audio, audioType;
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');


   

    // Added globals
    frame=0;
    snapshots=0;
    scanmode=0;
    oldData=context.getImageData(0,0,720,540);


    // Custom video filters
    var iFilter = 0;
    var filters = [
        'grayscale',
        'sepia',
        'blur',
        'brightness',
        'contrast',
        'hue-rotate',
        'hue-rotate2',
        'hue-rotate3',
        'saturate',
        'invert',
        'none'
    ];

    // Get the video stream from the camera with getUserMedia
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;

    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    if (navigator.getUserMedia) {

        // Evoke getUserMedia function
        navigator.getUserMedia({video: true, audio: true}, onSuccessCallback, onErrorCallback);

        function onSuccessCallback(stream) {
            // Use the stream from the camera as the source of the video element
            video.src = window.URL.createObjectURL(stream) || stream;

            // Autoplay
            video.play();

            // HTML5 Audio
            audio = new Audio();
            audioType = getAudioType(audio);
            if (audioType) {
                audio.src = 'polaroid.' + audioType;
                audio.play();
            }
        }

        // Display an error
        function onErrorCallback(e) {
            var expl = 'An error occurred: [Reason: ' + e.code + ']';
            console.error(expl);
            alert(expl);
            return;
        }
    } else {
        document.querySelector('.container').style.visibility = 'hidden';
        document.querySelector('.warning').style.visibility = 'visible';
        return;
    }

    // Draw the video stream at the canvas object
    function drawVideoAtCanvas(obj, context) {
        window.setInterval(function() {

            // Added code

            frame+=1
            context.drawImage(obj, 0, 0);
            
            if (scanmode==0)// Scanning without knowing last eye positions
            {
                if (frame%5==0)
                    {
                        snapshots+=1;
                        delete oldData;
                        oldData=context.getImageData(0,0,640,480);
                    }
                delete imgData;
                imgData=context.getImageData(0,0,640,480);

                rcount=0;
                imax=0;imaxv=0;
                imin=0;
                pixarray=[];
                for (var i=0;i<imgData.data.length;i+=4) //total scan
                        {   

                            imgData.data[i]=oldData.data[i]-imgData.data[i]; // use red channel to map changes
                            rcount+=imgData.data[i]>99;
                            if (rcount<100&&imgData.data[i]>99)
                            {
                                pixarray.push(i);
                            }
                            //if (imgData.data[i]>imaxv)
                            //{
                             //   imaxv=imgData.data[i];
                              //  imax=i;
                            //}
                            
                            //imin

                            imgData.data[i+1]=0;
                            imgData.data[i+2]=imgData.data[i+2];   // we keep blue channel
                            imgData.data[i+3]=255;
                        }


                        //scan selected picels

                var xmean=0;
                var samples=0;
                for (var i = 0; i < pixarray.length; i++) //convert samples to x,y values
                {
                    pixarray[i] /= 4;
                    pixarray[i] = [pixarray[i]%720,(pixarray[i]-pixarray[i]%720)/720];
                    xmean+=pixarray[i][0];
                    samples+=1;
                } 
                //console.log(pixarray.length);
                //console.log(pixarray[0]);
                xmean/=samples;
                //console.log(xmean);

                samples=0;
                var getx=0;
                var gety=0;
                
                for (var i = 0; i < pixarray.length; i++) //getlefteye
                {
                    getx+=pixarray[i][0]*(pixarray[i][0]<xmean);
                    gety+=pixarray[i][1]*(pixarray[i][0]<xmean);
                    samples+=(pixarray[i][0]<xmean);
                } 
                getx/=samples;
                gety/=samples;

              


                getx=Math.round(getx);
                gety=Math.round(gety);
                if (getx>0)
                {
                console.log("Left"+[getx,gety])
                }




                samples=0;

                var getx=0;
                var gety=0;
                
                
                for (var i = 0; i < pixarray.length; i++) //getrighteye
                {
                    getx+=pixarray[i][0]*(pixarray[i][0]>xmean);
                    gety+=pixarray[i][1]*(pixarray[i][0]>xmean);
                    samples+=(pixarray[i][0]>xmean);
                } 
                getx/=samples;
                gety/=samples;

                getx=Math.round(getx);
                gety=Math.round(gety);

                if (getx>0)
                {
                console.log("Right"+[getx,gety])
                }   


                var getx=0;
                var gety=0;
                for (var i = 0; i < pixarray.length; i++) //righteye
                {
                    xmean+=pixarray[i][0];
                    samples+=1;
                } 

                if (rcount>5&&rcount<100)
                        {snapshots+=1000;scanmode+=0;//change scanmode?
                        for (var i=0;i<imgData.data.length;i+=4)
                            {   
                            imgData.data[i]
                            }
                        }
                    else //get rid of noise
                    {
                        for (var i=0;i<imgData.data.length;i+=4)
                        {   
                          imgData.data[i]=0;
                        }
                    }

               

               

                                   
                    delete context;
                    context.putImageData(imgData,0,0);

                    document.getElementById("undervid").innerHTML = "Frame: "+(""+Math.round(frame+100000)).substring(1,9)+ " Scan mode: "+scanmode;
                    var srcount=(""+Math.round(rcount+1000000)).substring(1,9);
                    var simax=(""+Math.round(imax/4%720+1000000)).substring(1,9);
                    document.getElementById("undercanv").innerHTML =  "R_Count: "+srcount+" W: "+canvas.width+" H: "+canvas.height+ " Snaps: "+snapshots+" Imax: "+simax;













            }

            if (scanmode==1)// Scanning while knowing last eye position
            {
                if (frame%5==0)
                 oldData=context.getImageData(0,0,640,480);
            }



        }, 30);
    }

    // The canPlayType() function doesn’t return true or false. In recognition of how complex
    // formats are, the function returns a string: 'probably', 'maybe' or an empty string.
    function getAudioType(element) {
        if (element.canPlayType) {
            if (element.canPlayType('audio/mp4; codecs="mp4a.40.5"') !== '') {
                return('aac');
            } else if (element.canPlayType('audio/ogg; codecs="vorbis"') !== '') {
                return("ogg");
            }
        }
        return false;
    }

    // Add event listener for our video's Play function in order to produce video at the canvas
    video.addEventListener('play', function() {
        drawVideoAtCanvas(this, context);
    }, false);

    // Add event listener for our Button (to switch video filters)
    document.querySelector('button').addEventListener('click', function() {
        video.className = '';
        canvas.className = '';
        var effect = filters[iFilter++ % filters.length]; // Loop through the filters.
        if (effect) {
            video.classList.add(effect);
            canvas.classList.add(effect);

            document.querySelector('.container h3').innerHTML = 'Current filter is: ' + effect;
        }
    }, false);

}, false);