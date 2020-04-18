// Description:
//   meetings finder
//
// Dependencies:
//   xml2js
//
// Configuration:
//   GOOGLE_API_TOKEN
//   VIRTUAL_YAP_SERVER
//   VIRTUAL_YAP_SERVER_SERVICE_BODY_ID
//   ANNOUNCEMENT_GRACE_MINS
//   MEETING_SCHEDULE_ROOM
//   DEFAULT_SERVER_TIMEZONE
//   DEFAULT_SERVER_LATITUDE
//   DEFAULT_SERVER_LONGITUDE
//
// Commands:
//   hubot vm <location> - Returns a selection of upcoming virtual meetings with the timezone adjustment based of entered location.
//   hubot vmthis - Returns the meetings for the service body ID for this particular server from VIRTUAL_YAP_SERVER.
//
// Author:
//   radius314

var parseString = require('xml2js').parseString;
var moment = require('moment');
var CronJob = require('cron').CronJob;

module.exports = function(robot) {
  var api_token = process.env.GOOGLE_API_TOKEN;
  let virtualYapServer = process.env.VIRTUAL_YAP_SERVER;
  let announcementGraceMins = process.env.ANNOUNCEMENT_GRACE_MINS;

  if (process.env.MEETING_SCHEDULE_ROOM) {
    console.log(`Starting Meeting Schedule timer for ${process.env.MEETING_SCHEDULE_ROOM}.`);
    var job = new CronJob('30 * * * * *', function () {
      sendJft(function (err, res, body) {
        robot.messageRoom(process.env.MEETING_SCHEDULE_ROOM, "```" + strip_html_tags(body) + "```");
      });
    }, null, true, process.env.DEFAULT_SERVER_TIMEZONE);
    job.start();
  }

  function sendResults(query, callback) {
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
            callback(messageText);
            chunk = 0;
            messageText = "";
          }
        }
      });
    })
  }

  robot.respond(/thisvm/i, (msg) => {
    moment.tz.setDefault(process.env.DEFAULT_SERVER_TIMEZONE);
    let today = moment().isoWeekday();
    let serviceBodyId = process.env['VIRTUAL_YAP_SERVER_SERVICE_BODY_ID'];
    let query = `${process.env.VIRTUAL_YAP_SERVER}/api/getMeetings.php?results_count=5&suppress_voice_results=false&custom_query=%26services%3D${serviceBodyId}amp;{DAY}&latitude=${process.env.DEFAULT_SERVER_LATITUDE}&longitude=${process.env.DEFAULT_SERVER_LONGITUDE}`;
    robot.http(query).get()((err, res, body) => {
      for (let meeting of JSON.parse(body)['filteredList']) {
        let time = moment(meeting['start_time'], "HH:mm A");
        let day_id = meeting['weekday_tinyint'] - 1;
        let date_stamp = today <= day_id ? moment().isoWeekday(day_id) : moment().add(1, 'weeks').isoWeekday(day_id);
        date_stamp.set({
          hour: time.get('hour'),
          minute: time.get('minute')
        });
        if (date_stamp.diff(moment(), 'minutes') === announcementGraceMins) {
          robot.messageRoom(`TESTING!!! ${meeting['meeting_name']} meeting soon at ${date_stamp.format("hh:mm A z")}.  Click the HTTPS link to be brought into the voice channel.\n\nDon't forget to mute your mic.\n\n${meeting['comments']}`)
        }
      }
    });
  });

  robot.respond(/vm (.*)/i, (msg) => {
    var address = encodeURIComponent(msg.match[1]);
    robot.http(`https://maps.googleapis.com/maps/api/geocode/json?key=${api_token}&address=${address}&components=country:us`).get()((err, res, body) => {
      let result = JSON.parse(body)['results'][0];
      let latitude = result['geometry']['location']['lat'];
      let longitude = result['geometry']['location']['lng'];
      sendResults(`${virtualYapServer}/meeting-search.php?Latitude=${latitude}&Longitude=${longitude}&result_count_max=10&suppress_voice_results=false`, results => {
        msg.send(results)
      });
    });
  });
};
