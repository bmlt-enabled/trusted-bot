// Description:
//   gratitude
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot gratitude
//
// Author:
//   radius314

let Conversation = require('hubot-conversation');

module.exports = robot => {
  let switchBoard = new Conversation(robot);

  robot.respond(/gratitude/i, msg => {
    let dialog = switchBoard.startDialog(msg);
    msg.reply(`Do you want share your gratitude today?`)

    dialog.addChoice(/yes/, yesMsg => {
      yesMsg.reply(`What are you grateful for?`)
      dialog.addChoice(/(.*)/, gratitudeMsg => {
        robot.messageRoom(process.env.GRATITUDE_ROOM, gratitudeMsg.match[1])
      });
    })
  })
}
