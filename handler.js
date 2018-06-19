const http =  require('http');
const querystring = require('querystring');

exports.getWeatherDataFn = (event, context, callback) => {
    console.log('Event! ', event);
    
    const city = querystring.escape(event.city);
    
    http.get({
      hostname: 'api.openweathermap.org',
      port: 80,
      path: '/data/2.5/forecast?q='+ city +'&appid=' + process.env.APPID + '&cnt=3&units=metric',
      agent: false  // create a new agent just for this one request
    }, (res) => {
       let body = '';

        res.on('data', (d) => {
            body += d;
        });
        
        res.on('end', () => {

            const parsed = JSON.parse(body);
            console.log(body);
            
            const current = parsed.list[0].main.temp;
            const maxTemp = parsed.list[0].main.temp_max;
            const minTemp = parsed.list[0].main.temp_min;
            const description = parsed.list[0].weather[0].main ;
            const descriptionText = parsed.list[0].weather[0].description ;
            
            callback(null, {
              description: description + ":" + descriptionText,
              current: current,
              maxTemp: maxTemp,
              minTemp: minTemp
            });
        });
    }); 
};