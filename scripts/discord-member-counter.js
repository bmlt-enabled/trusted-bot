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
    let membersCount = msg.robot.adapter.rooms[msg.message.room].guild['memberCount']
    msg.send(`There are ${membersCount} members in this server.`)
  })
};
