const login = require('facebook-chat-api')
const request = require('request')
const express = require('express')
const moment = require('moment')
const fs = require('fs')
const getPhotos = require('./getPhotos.js')
const downImages = require('./downImages.js')

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Runnning on port ${process.env.PORT}`);
})
app.get('/', (req, res) => res.send('Hello World!'))
// Create simple echo bot
login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);
    api.listenMqtt((err, message) => {
        // api.sendMessage(message.body + 'haha', message.threadID);
        if (message.body) {
            text = message.body
            if (text === '/help') {
              api.sendMessage('/hello\n/weather-location,country\n/girl\n/bye', message.threadID)
            } else if (text === '/hello') {
              api.sendMessage( 'Chào cậu! tớ là bé bot cute\nhân hạn được làm quen với c 😍', message.threadID)
            } else if (text === '/bye') {
              api.sendMessage( 'Bye c 😞', message.threadID)
            } else if (text === '/girl') {
              request('https://scontent.fhan9-1.fna.fbcdn.net/v/t1.0-9/97628734_3448353698511411_8342813993538158592_n.jpg?_nc_cat=109&_nc_sid=8024bb&_nc_ohc=NM7w01Sp-8QAX-jmYa-&_nc_ht=scontent.fhan9-1.fna&oh=863ba28b317c479cd9bb58742151ba89&oe=5EFC9BC5', async (err, res, body) => {
                  let photos = await getPhotos('1297848546895281', 200);
                  downImages(photos[Math.round(Math.random()*(photos.length - 1))], message.threadID)
                  api.sendMessage({
                    body: "Xinh hông 😊",
                    attachment: fs.createReadStream(`./image-${message.threadID}.png`)
                  }, message.threadID)
                  fs.unlinkSync(`image-${message.threadID}.png`)
              })
            } else if (text.split('-')[0] === '/weather') {
              if (!text.split('-')[1]) {
                api.sendMessage('Cậu chưa nhập vị trí ạ 😠', message.threadID)
              } else {
                forecasts(text.split('-')[1].replace(/\s/g, ''), message.threadID)
              }
            }
        }
        function forecasts(locat, sender) {
            request(`https://weather-ydn-yql.media.yahoo.com/forecastrss?location=${locat}&format=json&u=c`, {
                oauth:{
                consumer_key:'dj0yJmk9NG1PVnJsMXNCSW9rJmQ9WVdrOVNYZEVPVzVxTXpJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTdh',
                consumer_secret:'5e05f92696b1be097652989f0eed4f762151109f'
                },
                qs:{user_id:'IwD9nj32'} // or screen_name
            }, function (err, res, body) {
                let searchForecasts = JSON.parse(body);
                let { location, current_observation } = searchForecasts;
                let { condition, astronomy, pubDate } = current_observation;
                  if (!location.city) {
                    api.sendMessage('Tớ không tìm thấy thông tin gì về thời tiết chỗ c 😓', sender)
                    return;
                  }
                var date = new Date(pubDate*1000 + 7*3600000);
                api.sendMessage(`Đây c 👍\nVị Trí: ${location.city}, ${location.country}\nDate: ${date.toDateString()}\nTrạng thái: ${condition.text}\nNhiệt độ trung bình: ${condition.temperature}\nSunrise: ${astronomy.sunrise}\nSunset: ${astronomy.sunset}`, sender)
            })
        }
    });
    setInterval(function() {
      let now = moment().utcOffset(7*60).format('LTS');
      if (now === "11:00:00 PM") {
        api.sendMessage('11h r các c đi ngủ sớm đi, goodnight 😴', '2576367552395263')
      } else if (now === "6:00:00 AM") {
        api.sendMessage('Sáng rồi dậy đi nào các c, đêm qua ngủ ngon hông? 😚', '2576367552395263')
      }
    }, 1000)
    setInterval(() => {
      request('http://hoangdangkhanhchatbot.herokuapp.com/',
        null,
        function(err, res, body) {
          console.log(body)
      })
    }, 1000*25*60)
    fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
});