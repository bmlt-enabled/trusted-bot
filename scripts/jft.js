// Description:
//   jft
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot jft

module.exports = function(robot) {

  robot.respond(/jft/i, (msg) => {
    robot.http("https://www.jftna.org/jft/").get()((err, res, body) => {
      msg.send("```" + strip_html_tags(body) + "```");
    })
  });

  function strip_html_tags(str) {
    if ((str===null) || (str==='')) {
      return false;
    } else {
      str = str.toString();
    }

    return str.replace(/<[^>]*>/g, '');
  }

};
