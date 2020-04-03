// Description:
//   discord member counter
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot count
//
// Author:
//   radius314

module.exports = function(robot) {
  robot.respond(/count/i, (msg) => {
    msg.send(msg.robot.adapter.rooms[msg.message.room].guild['memberCount'])
  })
};
