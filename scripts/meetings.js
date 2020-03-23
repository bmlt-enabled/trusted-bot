// Description:
//   meetings finder
//
// Dependencies:
//   xml2js
//
// Configuration:
//   GOOGLE_API_TOKEN
//   VIRTUAL_YAP_SERVER
//
// Commands:
//   hubot vm <location> - Returns a selection of upcoming virtual meetings with the timezone adjustment based of entered location.
//
// Author:
//   radius314

var parseString = require('xml2js').parseString;

module.exports = function(robot) {
  var api_token = process.env.GOOGLE_API_TOKEN;
  let virtualYapServer = process.env.VIRTUAL_YAP_SERVER;

  robot.respond(/vm (.*)/i, (msg) => {
    var address = encodeURIComponent(msg.match[1]);
    robot.http(`https://maps.googleapis.com/maps/api/geocode/json?key=${api_token}&address=${address}&components=country:us`).get()((err, res, body) => {
      let result = JSON.parse(body)['results'][0];
      let latitude = result['geometry']['location']['lat'];
      let longitude = result['geometry']['location']['lng'];
      let query = `${virtualYapServer}/meeting-search.php?Latitude=${latitude}&Longitude=${longitude}`;
      console.log(query);
      robot.http(query).get()((err, res, body) => {
        parseString(body, function (err, result) {
          let data = result["Response"]["Say"];
          let chunk = 0;
          let messageText = "";
          for (let i = 1; i < data.length - 1; i++) {
            if (chunk === 0) {
              chunk++;
              continue;
            }

            chunk++;
            messageText += data[i]["_"] + " ";
            if (chunk === 4) {
              msg.send(messageText);
              chunk = 0;
              messageText = "";
            }
          }
        });
      })
    });
  });
};
