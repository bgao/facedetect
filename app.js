
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
, cv = require('opencv');

var app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

// io.socket
io.sockets.on('connection', function(socket) {
  socket.emit('message', { message: 'Welcome!' });
  socket.on('clientImage', function(data) {
    // process image
    debugger;
    var imgData = data.image.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(imgData, 'base64');
    cv.readImage(buf, function(err, im) {
      debugger;
      if (err) console.log("cv.readImage error: " + err);
      else
	im.detectObject("./data/haarcascade_frontalface_alt.xml", 
			{},
			function(err, faces_) {
			  if (err) console.log ("error found");
			  else socket.emit('face', { faces: faces_ });
			});
    });
  });
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
