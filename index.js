const login = require('facebook-chat-api')
const request = require('request')
const express = require('express')
const app = express();
app.listen(process.env.PORT, () => {
  console.log(`Runnning on port ${process.env.PORT}`);
})
app.get('/', (req, res) => res.send('Hello World!'))
// Create simple echo bot
login({email: "hoangdangkhanh12c1@gmail.com", password: "Khanh2001"}, (err, api) => {
    if(err) return console.error(err);
    api.listenMqtt((err, message) => {
        // api.sendMessage(message.body + 'haha', message.threadID);
        if (message.body) {
            text = message.body
            if (text === '/help') {
              api.sendMessage('/hello\n/weather-location,country\n/bye', message.threadID)
            } else if (text === '/hello') {
              api.sendMessage( 'Chào cậu! tớ là bé bot cute\nhân hạn được làm quen với c 😍', message.threadID)
            } else if (text === '/goodbye') {
              api.sendMessage( 'Bye c 😞', message.threadID)
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
    setInterval(() => {
      request('http://hoangdangkhanhchatbot.herokuapp.com/',
        null,
        function(err, res, body) {
          console.log(body)
      })
    }, 1000*25*60)
});