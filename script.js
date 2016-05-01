/**
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2012, Script Tutorials
 * http://www.script-tutorials.com/
 */

// Main initialization

 function showeye(x,y,radius)
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
    w640=640;
    frame=0;
    snapshots=0;
    scanmode=0;
    oldData=context.getImageData(0,0,w640,480);
    eyes=[];


    // Custom video filters
    var iFilter = 0;
    var filters = [
        'flip',
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




























            
            if (scanmode==0)scanmode0();// Scanning without knowing last eye positions
            function scanmode0()
            {
                if (frame%5==0)
                    {
                        snapshots+=1;
                        delete oldData;
                        oldData=context.getImageData(0,0,w640,480);
                    }
                delete imgData;
                imgData=context.getImageData(0,0,w640,480);
                


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
                for (var i = 0; i < pixarray.length&&rcount<100; i++) //convert samples to x,y values
                {
                    pixarray[i] /= 4;
                    pixarray[i] = [pixarray[i]%w640,(pixarray[i]-pixarray[i]%w640)/w640];
                    xmean+=pixarray[i][0];
                    samples+=1;
                } 
                //console.log(pixarray.length);
                //console.log(pixarray[0]);
                xmean/=samples;
               //console.log(Math.round(xmean));


               larray=[];
               rarray=[];

                for (var i = 0; i < pixarray.length&&rcount<100; i++) //convert samples to x,y values
                {
                    if (xmean>pixarray[i][0])
                    larray.push(pixarray[i])
                else
                    rarray.push(pixarray[i])
                } 

                if (rcount>10&&larray.length/rarray.length>0.8&&rarray.length/larray.length>0.8)
                if (rarray[0][0]-larray[0][0]>20&&rarray[0][1]-larray[0][1]<10&&rarray[0][1]-larray[0][1]>-10)
                {
                    console.log(larray.length+" "+rarray.length);
                    if (larray[0]!= undefined)
                    {
                    console.log(larray[0]+" "+rarray[0]);
                    
                    scanmode+=1;
                    }
                }


               

                if (rcount>10&&rcount<100)
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

               

                                   
                    
                    context.putImageData(imgData,0,0);

                    document.getElementById("undervid").innerHTML = "Frame: "+(""+Math.round(frame+100000)).substring(1,9)+ " Scan mode: "+scanmode;
                    var srcount=(""+Math.round(rcount+1000000)).substring(1,9);
                    var simax=(""+Math.round(imax/4%w640+1000000)).substring(1,9);
  
                    document.getElementById("undercanv").innerHTML =  "R_Count: "+srcount+" W: "+canvas.width+" H: "+canvas.height+ " Snaps: "+snapshots;



            }




















            if (scanmode==1)// Scanning while knowing last eye position
            {
                context.drawImage(obj, 0, 0);
                imgData=context.getImageData(0,0,w640,480);
                
               //context.putImageData(img,0,5);
                    
                context.putImageData(imgData,0,5);
                showeye(larray[0][0],larray[0][1],10);
                showeye(rarray[0][0],rarray[0][1],10);
               //showeye(50,50+frame%200,10);




               sensorarray=[];

                x=larray[0][0];
                y=larray[0][1];
                showsensors(x,y);

                x=rarray[0][0];
                y=rarray[0][1];
                showsensors(x,y);

                function showsensors(x,y)
                {
                sensorarray.push([x,y]);
                radius1=5;
                radius2=8;
              //context.fillstyle="rgb(" + 255, 255, 255.join(",") + ")";  sensorarray.push([x,y])
                for (var i=0;i<360;i+=30)
                    {
                    sensorarray.push([x+radius1*Math.cos(i * (Math.PI / 180)),y+radius1*Math.sin(-i * (Math.PI / 180))]);
                    //sensorarray.push([x+(radius1+radius2)*Math.cos(i * (Math.PI / 180)),y+(radius1+radius2)*Math.sin(-i * (Math.PI / 180))]);
                    sensorarray.push([x+radius2*Math.cos(i * (Math.PI / 180)),y+radius2*Math.sin(-i * (Math.PI / 180))]);
                    //sensorarray.push([x+(radius2+radius2)*Math.cos(i * (Math.PI / 180)),y+(radius2+radius2)*Math.sin(-i * (Math.PI / 180))]);
                }

                for (var i = 0; i < sensorarray.length; i++)
                {
                     sensorarray[i][0]=Math.round(sensorarray[i][0]);
                     sensorarray[i][1]=Math.round(sensorarray[i][1]);

                     pixsensor=sensorarray[i][0]+sensorarray[i][1]*w640;
                     pixsensor*=4;
                  


                   
                     //pix=pixsensor/4;
                     //xpix=pix%w640;
                     //ypix=pix-pix%640/640;

                     //showeye(xpix,ypix,10)
                   
                     context.fillStyle="#"+(imgData.data[pixsensor+2]+imgData.data[pixsensor+1]*256+imgData.data[pixsensor]*256*256).toString(16);
                     context.beginPath();
                   
            
                   
                     
                    context.arc(sensorarray[i][0],sensorarray[i][1],2,0,2*Math.PI);
                    context.fill();
                }

              

                if (frame%1000==0)
                    console.log("Running scanmode 1");
           
                   // console.log(imgData.data.length);
                    //console.log("Sensors:"+sensorarray.length);
                    //console.log("SensorsX:"+sensorarray[0]);
                }

            }



        }, 10);
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