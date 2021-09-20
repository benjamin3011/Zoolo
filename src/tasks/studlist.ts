import { bot } from "../../cache.ts";
import { configs } from "../../configs.ts";
import { botId, cache, sendMessage } from "../../deps.ts";
import { Milliseconds } from "../utils/constants/time.ts";
import { Embed } from "../utils/Embed.ts";
import { sendEmbed } from "../utils/helpers.ts";

bot.tasks.set(`studlists`, {
  name: `studlists`,
  // Runs this function every 5 seconds
  interval: Milliseconds.SECOND * 10,
  execute: async function () {
    // Only run when the bot is fully ready. In case guilds are still loading dont want to send wrong stats.
    if (!cache.isReady) return;

    const json = fetch(
      "https://api.zed.run/api/v1/stud/horses?offset=0&bloodline[]=Nakamoto&breed_type[]=genesis&gen[]=1&gen[]=2&horse_name=&sort_by=inserted_at_stud"
    );

    json
      .then((response) => {
        return response.json();
      })
      .then(async (jsonData) => {
        //get the last saved horse in cache.
        const lastStudHorseId = bot.lastStudHorse.get(botId);

        //get first horse from api, api is already sorted.
        const firstHorse = jsonData[0];
        console.log(firstHorse);
        const price = parseInt(firstHorse.mating_price, 10);

        //price greater than 0.05ETH
        if (parseInt(firstHorse.mating_price, 10) > 200000000000000000) return;

        const studHorse = firstHorse;
        //const studHorse = jsonData.find((horse: { mating_price: string; }) => horse.mating_price <= "160000000000000000");

        // If the horse is the same as last cycle, do nothing.
        if (lastStudHorseId == firstHorse.horse_id) return;

        console.log("studHorse", studHorse);
        const horseUrl = `https://zed.run/${studHorse.horse_id}/select-mate/`;
        const horseColor = `#${studHorse.hash_info.hex_code}`;
        const horsePrice = parseInt(studHorse.mating_price, 10) / 1000000000000000000;
        const embedTitle = `${studHorse.hash_info.name} ist im Stud-Service verfügbar`;
        const embed = new Embed()
          .setColor(horseColor)
          .setTitle(embedTitle, horseUrl)
          .setImage(studHorse.img_url)
          .setDescription(
            [
              `Stud-Service-Preis: ${horsePrice} ETH`,
              `Bloodline: ${studHorse.bloodline}`,
              `Genotype: ${studHorse.genotype}`,
              `<@&863767339405410334>`,
            ].join("\n")
          )
          .setTimestamp();

        //so we found a new horse, delete old one from cache and add new one.
        bot.lastStudHorse.delete(botId);
        bot.lastStudHorse.set(botId, studHorse.horse_id);

        // If the channel is not found cancel out
        if (!configs.channelIDs.studDealsChannelID) return;

        await sendMessage(configs.channelIDs.studDealsChannelID, "<@&863767339405410334>");
        //send embed in stud deal channel
        return await sendEmbed(configs.channelIDs.studDealsChannelID, embed);
      })
      .catch((error) => console.log(error.message));
  },
});
