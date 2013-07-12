Facedetect
==========

Using getUserMedia() provided by the browser to get the webcam acquiring images, which are bound to <video>. 
Draw the video into <canvas>, then the image is sent through websocket to the backend for image processing.
In the backend, node-opencv is used to detect faces in the image and send faces information (location and size) back
to the client, which was drawn in the canvas.
