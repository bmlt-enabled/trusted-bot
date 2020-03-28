// Description:
//   calculates clean time
//
// Dependencies:
//   xml2js
//
// Configuration:
//   GOOGLE_API_TOKEN
//   VIRTUAL_YAP_SERVER
//
// Commands:
//   hubot ct <date> - Returns time clean. (example: %ct 09/22/11)
//
// Author:
//   radius314

var moment = require("moment");
var monthDay = [ 31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

module.exports = function(robot) {
  var calculate = function(year, month, day) {
    // calculate the time
    var fromDate, toDate, daysBetween, monthsBetween, yearsBetween;
    var startDate = moment([year, (month - 1), day]);
    var endDate = moment();

    if (startDate > endDate) {
      fromDate = endDate;
      toDate = startDate;
    } else {
      fromDate = startDate;
      toDate = endDate;
    }

    var increment = 0;

    if (fromDate.date() > toDate.date()) {
      increment = monthDay[fromDate.month()];
    }

    if (increment == -1) {
      increment = fromDate.isLeapYear() ? 29 : 28;
    }

    if (increment !== 0) {
      daysBetween = (toDate.date() + increment) - fromDate.date();
      increment = 1;
    } else {
      daysBetween = toDate.date() - fromDate.date();
    }

    if ((fromDate.month() + increment) > toDate.month()) {
      monthsBetween = (toDate.month() + 12) - (fromDate.month() + increment);
      increment = 1;
    } else {
      monthsBetween = (toDate.month() - (fromDate.month() + increment));
      increment = 0;
    }

    yearsBetween = toDate.year() - (fromDate.year() + increment);

    var totaldaysDiff = endDate.diff(startDate, 'days');

    return {
      "years" : yearsBetween,
      "months" : monthsBetween,
      "days" : daysBetween,
      "totalDays" : totaldaysDiff
    };
  };

  robot.respond(/ct (.*)/i, (msg) => {
    let parsed = moment(Date.parse(msg.match[1]));
    let calculated = calculate(parsed.year(), parsed.month() + 1, parsed.date());
    if (isNaN(calculated.totalDays)) {
      msg.send("Clean Date entered incorrectly.  Check your entry, here is a example: `%ct 09-22-2011`.");
    } else {
      msg.send(`You have ${calculated.years} years, ${calculated.months} months, ${calculated.days} days, or ${calculated.totalDays} total days.`);
      let milestoneBuffer = 7;

      // Milestones
      // https://www.reddit.com/r/discordapp/comments/58t9x8/how_do_i_make_a_bot_type_an_emojiserver_emoji/
      if (calculated.years === 0 && calculated.months === 0 && calculated.days < milestoneBuffer) {
        msg.send("Welcome, keep coming back! <:keymoji_white:692750697225125889>");
      } else if (calculated.years === 0 && calculated.months === 0 && calculated.days < 30 + milestoneBuffer) {
        msg.send("Congratulations on 30 days clean! <:keymoji_30:692750696826535997>");
      } else if (calculated.years === 0 && calculated.months === 0 && calculated.days < 60 + milestoneBuffer) {
        msg.send("Congratulations on 60 days clean! <:keymoji_60:692750697166274570>");
      } else if (calculated.years === 0 && calculated.months === 0 && calculated.days < 90 + milestoneBuffer) {
        msg.send("Congratulations on 90 days clean! <:keymoji_90:692750697451618325>");
      } else if (calculated.years === 0 && calculated.months === 6 && calculated.days < milestoneBuffer) {
        msg.send("Congratulations on 6 months clean! <:keymoji_6m:692750697242034237>");
      } else if (calculated.years === 0 && calculated.months === 9 && calculated.days < milestoneBuffer) {
        msg.send("Congratulations on 9 months clean! <:keymoji_9m:692750697351086110>");
      } else if (calculated.years === 1 && calculated.months === 0 && calculated.days < milestoneBuffer) {
        msg.send("Congratulations on 1 year clean! <:keymoji_1y:692750696944107591>");
      } else if (calculated.years === 1 && calculated.months === 6 && calculated.days < milestoneBuffer) {
        msg.send("Congratulations on 18 months clean! <:keymoji_18m:692750697199829033>");
      } else if (calculated.years > 1 && calculated.months === 0 && calculated.days < milestoneBuffer) {
        msg.send("Congratulations on " + calculated.years + " years clean! <:keymoji_my:692750697288040498>");
      }
    }
  });
};

