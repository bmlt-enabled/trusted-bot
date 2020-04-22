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
    msg.reply(`Do you want share your gratitude today with others?`)

    dialog.addChoice(/yes/, yesMsg => {
      yesMsg.reply(`What are you grateful for?  Keep everything to a single line, separating each item with a comma or a number.  (Example: I'm grateful for food, recovery, friends`)
      dialog.addChoice(/(.*)/, gratitudeMsg => {
        robot.messageRoom(process.env.GRATITUDE_ROOM, `@${gratitudeMsg['message']['user']['id']} has some gratitude to share: ${gratitudeMsg.match[1].replace("trusted-bot: ", "")}`)
        gratitudeMsg.reply(`Thanks for sharing!`)
      });
    })
  })
}
