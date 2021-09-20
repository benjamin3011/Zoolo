import { PermissionLevels } from "../types/commands.ts";
import { createCommand } from "../utils/helpers.ts";

createCommand({
  name: "floor",
  aliases: [],
  dmOnly: false,
  guildOnly: false,
  nsfw: false,
  permissionLevels: [PermissionLevels.MEMBER],
  botServerPermissions: [],
  botChannelPermissions: [],
  userServerPermissions: [],
  userChannelPermissions: [],
  description: "description",
  cooldown: {
    seconds: 0,
    allowedUses: 0,
  },
  arguments: [
    {
      name: "collection",
      type: "string",
      required: false,
      missing: (message) => {
        message.reply(`Test`);
      },
    },
  ],
  execute: function (message, args, guild) {
    // Get zoo ETH portfolio
    const url =
      "https://api.opensea.io/api/v1/collections?asset_owner=0x2756a1ded9142fda52445C733f45B9B8Df27B8bb&offset=0&limit=300";
    const json = fetch(url);

    const collection = args.collection;

    json
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        console.log(jsonData);

        var collectionJson;
        var floor;

        if (args.collection.toLowerCase() == "voxies") {
          collectionJson = jsonData.filter(function (jsonData) {
            return jsonData.primary_asset_contracts[0].name == "Voxies";
          });

          floor = collectionJson[0].stats.floor_price;

          message.reply(`Voxies floor: ${floor}`);
        } else if (args.collection.toLowerCase() == "ec") {
          collectionJson = jsonData.filter(function (jsonData) {
            return jsonData.primary_asset_contracts[0].name == "Ether Cards Founder";
          });

          floor = collectionJson[0].stats.floor_price;

          message.reply(`Ether Cards floor: ${floor}`);
        }
      });
  },
});
