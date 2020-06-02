let getPhotos = require('./getPhotos');
async function run() {
    try {
        let photos = await getPhotos('1297848546895281', 15);
        console.log(photos);
    } catch (err) {
        console.log(err);
    }
}
run()