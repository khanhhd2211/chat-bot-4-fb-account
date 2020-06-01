var fs = require('fs');
    request = require('request');
function downImages(imgUrl, id) {
    var download = function(uri, filename, callback){
      request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
    
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
      });
    };
    
    download(imgUrl, `google-${id}.png`, function(){
      console.log('done');
    });
}
module.exports = downImages;