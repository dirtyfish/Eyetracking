/**
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2012, Script Tutorials
 * http://www.script-tutorials.com/
 */

// Main initialization
document.addEventListener('DOMContentLoaded', function() {

    // Global variables
    console.log("DOMContentLoaded");
    video = document.querySelector('video');
    var audio, audioType;
    canvas = document.querySelector('canvas');
    context = game.getContext('2d');
    frame=0

    gcan = canvas.getContext('2d');
    oldData=gcan.getImageData(0,0,720,540);
    savex=360;
    savey=270;
    
 

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

    function eye(x,y,radius)
    {

        gcan.fillstyle="#00FF00";
        gcan.beginPath();
        gcan.arc(x,y,radius,0,2*Math.PI);
        gcan.stroke();

        gcan.beginPath();
        gcan.arc(x,y,radius+2,0,2*Math.PI);
        gcan.stroke();
    }
    // Draw the video stream at the canvas object
    function drawVideoAtCanvas(obj, context) {
        window.setInterval(function() {
            frame+=1
            document.getElementById("undervid").innerHTML = Math.round(frame/30);

            context.drawImage(obj, 0, 0);
            //context.strokeRect(20,20,50,20+frame%25);


            gcan.clearRect(0,0,720,540);
            gcan.drawImage(obj, 0, 0);
           
            if (frame%5==0)
                 oldData=gcan.getImageData(0,0,720,540);
           
             imgData=gcan.getImageData(0,0,720,540);
             scoreData=gcan.getImageData(0,0,720,540);
             score=0;
             getsumx=0;
             //getsumxl=0;
             //getsumxr=0;
             getsumy=0;
             //getsumyl=0;
             //getsumyr=0;
             brightx=0;
             brighty=0;

             brightxl=0;
             brightyl=0;

             brightxr=0;
             brightyr=0;


             maxsum=0;
             samples=0;
             sensitivity=111;
           
            for (var i=0;i<imgData.data.length;i+=4)
                {

                var getxy=i/4;
                var getx=getxy%720;
                var gety=(getxy-getx)/720;

               

                imgData.data[i]=oldData.data[i]-imgData.data[i];
                imgData.data[i+1]=oldData.data[i+1]-imgData.data[i+1];
                imgData.data[i+2]=oldData.data[i+2]-imgData.data[i+2];
                var imgsum=imgData.data[i]+imgData.data[i+1]+imgData.data[i+2];
                imgData.data[i+3]=255;

                if (imgsum>maxsum&&imgsum>sensitivity)
                {
                    maxsum=imgsum;
                    brightx=getx;
                    brighty=gety;
                }

                score+=(imgsum>=sensitivity);
                getsumx+=(imgsum>=sensitivity)*getx;
                getsumy+=(imgsum>=sensitivity)*gety;  




                               
                }//end for



                
            
             if (score>140 && score<800)
             {
            //gcan.putImageData(imgData,0,0);
            score+=(score==0);
            savex=Math.round(getsumx/score);
             savey=Math.round(getsumy/score);
             document.getElementById("undercanv").innerHTML = maxsum+":"+score+":"+savex+" "+savey+" "+brightx+" "+brighty;
             
             
             }

        
            
        eye(savex,savey,5);

        eye(brightx,brighty,10);
            

           
             
            
        }, 20);
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
            //canvas.classList.add(effect);

            document.querySelector('.container h3').innerHTML = 'Current filter is: ' + effect;
        }
    }, false);

        document.querySelector('button2').addEventListener('click', function() {
         document.querySelector('.warning').style.visibility = 'visible';
     }, false);

}, false);