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
              api.sendMessage('/hello\n/weather-location,country-day\n/goodbye', message.threadID)
            } else if (text === '/hello') {
              api.sendMessage( 'Chào bạn! tôi là Kbot hân hạn được làm quen với bạn', message.threadID)
            } else if (text === '/goodbye') {
              api.sendMessage( 'Tạm biệt :3', message.threadID)
            } else if (text.split('-')[0] === '/weather') {
              if (!text.split('-')[2]) {
                forecasts( 0, text.split('-')[1].replace(/\s/g, ''), message.threadID)
              } else {
                forecasts(parseInt(text.split('-')[2]), text.split('-')[1].replace(/\s/g, ''), message.threadID)
              }
            }
        }
        function forecasts(day, locat, sender) {
            request(`https://weather-ydn-yql.media.yahoo.com/forecastrss?location=${locat}&format=json&u=c`, {
                oauth:{
                consumer_key:'dj0yJmk9NG1PVnJsMXNCSW9rJmQ9WVdrOVNYZEVPVzVxTXpJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTdh',
                consumer_secret:'5e05f92696b1be097652989f0eed4f762151109f'
                },
                qs:{user_id:'IwD9nj32'} // or screen_name
            }, function (err, res, body) {
                let searchForecasts = JSON.parse(body) 
                let data = searchForecasts.forecasts[day]
                  if (!data) {
                    api.sendMessage('Không có dữ liệu về vị trí của bạn', sender)
                    return;
                  }
                var date = new Date(data.date*1000 + 7*3600000);
                api.sendMessage(`Vị Trí: ${searchForecasts.location.city}, ${searchForecasts.location.country}\nDate: ${date.toDateString()}\nTrạng thái: ${data.text}\nNhiệt độ: ${data.low}-${data.high}`, sender)
            })
        }
    });
});
setInterval(() => {
  request('http://hoangdangkhanhchatbot.herokuapp.com/',
    null,
    function(err, res, body) {
      console.log(body)
  })
}, 1000*25*60)