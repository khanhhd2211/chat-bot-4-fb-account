const Fb = require('./modules/cookie-facebook');
const fs = require('fs');

async function getPhoto(ID_ALBUM, LIMIT = 500) {
    return new Promise(async (resolve, reject) => {
        const sHandle = {
            cookie: 'dpr=1.25; sb=y826Xsq-lQNhdEgJ5COtzuXR; datr=y826XmKXFYArMzXjwa_9GIhf; locale=vi_VN; c_user=100022462591456; xs=35%3AkEozr3jE8O0a1A%3A2%3A1591007115%3A10485%3A6200; spin=r.1002186940_b.trunk_t.1591007115_s.1_v.2_; act=1591026132811%2F0; fr=15XBf2xA4oWtLoTaN.AWVOtsleH1DjS-xjrF1LDK0AfbM.Beus3K.WA.AAA.0.0.Be1Tqr.AWWfi5eO; wd=1536x179; presence=EDvF3EtimeF1591032595EuserFA21B22462591456A2EstateFDsb2F1591032565780EatF1591032595283Et3F_5bDiFA2thread_3a2576367552395263A2EoF1EfF1CAcDiFA2thread_3a2295650313890971A2EoF2EfF2CAcDiFA2user_3a1B07247612769A2ErF1EoF3EfF3C_5dEutc3F1591032566109G591032595683CEchF_7bCC',
            fb_dtsg: 'AQG8jgolADkl:AQFw5AY1f6j6'
        };
    
        let variables = {
            count: LIMIT,
            cursor: '',
            scale: 1,
            id: ID_ALBUM
        };
    
        let form = {
            __a: 1,
            fb_dtsg: sHandle.fb_dtsg,
            fb_api_caller_class: 'RelayModern',
            fb_api_req_friendly_name: 'CometPagePhotosTabAlbumPermalinkViewPaginationQuery',
            variables: JSON.stringify(variables),
            doc_id: 3368531986514812
        };
        let task = new Fb();
        task.config({
            uri: 'https://www.facebook.com/api/graphql/',
            form,
            cookie: sHandle.cookie
        });
    
        try {
            let resuft = [];
            let data = await task.run();
            let jsonParse = JSON.parse(data);
            jsonParse.data.node.pageMedia.edges.map(item => {
                resuft.push(item.node.image.uri);
            });
            resolve(resuft);
        } catch (error) {
            reject(error);
        }  
    })
}

module.exports = getPhoto;

