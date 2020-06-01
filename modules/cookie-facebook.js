const rq = require('request-promise');

class Facebook{
    run(){
        return rq(this.config);
    }

    config(data = { uri, form: '', cookie: ''}){
        this.config = {
            uri: data.uri,
            method: (typeof data.form === "object") ? 'post' : 'get',
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-language': 'vi,en;q=0.9',
                'cache-control': 'max-age=0',
                'cookie': data.cookie,
                'dnt': '1',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36'
            },
            form: data.form
        };
    }
    
    setUserAgent(userAgent){
        this.config.headers['user-agent'] = userAgent;
    }

    setCookie(cookie){
        this.config.headers['cookie'] = cookie;
    }

}

module.exports = Facebook;