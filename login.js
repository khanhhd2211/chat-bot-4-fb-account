const fs = require("fs");
const login = require("facebook-chat-api");

var credentials = {email: "khanhhd.enactusneu@gmail.com", password: "Khanh2001"};

login(credentials, (err, api) => {
    if(err) return console.error(err);

    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
});
