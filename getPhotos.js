const Fb = require('./modules/cookie-facebook');
const fs = require('fs');

async function getPhoto(ID_ALBUM, LIMIT = 500) {
    return new Promise(async (resolve, reject) => {
        const sHandle = {
            cookie: 'dpr=1.25; sb=y826Xsq-lQNhdEgJ5COtzuXR; datr=y826XmKXFYArMzXjwa_9GIhf; locale=vi_VN; c_user=100022462591456; xs=8%3AWf1JPq05E-PTGA%3A2%3A1591037359%3A10485%3A6200; spin=r.1002188103_b.trunk_t.1591037360_s.1_v.2_; act=1591066609415%2F3; wd=1536x150; presence=EDvF3EtimeF1591067541EuserFA21B22462591456A2EstateFDsb2F1591066704576EatF1591066701623Et3F_5bDiFA2thread_3a2576367552395263A2EoF1EfF1CAcDiFA2user_3a1B52105054905A2EoF2EfF2CAcDiFA2user_3a1B07247612769A2EoF3EfF3C_5dEutc3F1591066725925G591066725955Elm3FnullCEchF_7bCC; fr=15XBf2xA4oWtLoTaN.AWXynm4mdkteeowGfcMmucMc2nw.Beus3K.WA.F7V.0.0.Be1cOV.AWUFir51',
            fb_dtsg: 'AQFfwDZCZKzi:AQGxP-6BHSKn'
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

