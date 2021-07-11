import { botId } from "../../deps.ts";
import { createCommand } from "../utils/helpers.ts";

createCommand({
  name: `invite`,
  description: "Like the bot? Use this link to add it to your server!",
  execute: function (message) {
    // Replace the permission number at the end to request the permissions you wish to request. By default, this will request Admin perms.
    message.reply(`https://discordapp.com/oauth2/authorize?client_id=${botId}&scope=bot&permissions=8`);
  },
});
