// Description:
//   jft
//
// Dependencies:
//   None
//
// Configuration:
//   JFT_ROOM
//
// Commands:
//   hubot jft
//
// Author:
//   radius314

var CronJob = require('cron').CronJob;

module.exports = function(robot) {
  if (process.env.JFT_ROOM) {
    console.log(`Starting JFT timer for ${process.env.JFT_ROOM}.`);
    var job = new CronJob('0 0 6 * * *', function () {
      sendJft(function (err, res, body) {
        robot.messageRoom(process.env.JFT_ROOM, "```" + strip_html_tags(body) + "```");
      });
    }, null, true, 'America/New_York');
    job.start();
  }

  robot.respond(/jft/i, (msg) => {
    console.log(JSON.stringify(msg.message.room));
    sendJft(function(err, res, body) {
      msg.send("```" + remove_extra_spaces(strip_html_tags(body)) + "```");
    });
  });

  function sendJft(callback) {
    robot.http("https://www.jftna.org/jft/").get()((err, res, body) => {
      callback(err, res, body);
    })
  }

  function remove_extra_spaces(str) {
    return str.replace(/(\n\n\n\n)/gm, '');
  }

  function strip_html_tags(str) {
    if ((str===null) || (str==='')) {
      return false;
    } else {
      str = str.toString();
    }

    return str.replace(/<[^>]*>/g, '');
  }

};
