const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

const mysql = require("mysql2");

const { Count } = require("./count.js");
const { checkChars } = require("./func.js");

require("dotenv").config();

TOKEN = process.env.TOKEN;

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");

    // Create database if it does not exist
    con.query(
        "CREATE DATABASE IF NOT EXISTS count_bot",
        function (err, result) {
            if (err) throw err;
            console.log("Database count_bot checked/created!");

            // Use the database
            con.query("USE count_bot", function (err, result) {
                if (err) throw err;
                console.log("Using database count_bot!");

                // Create the channels table if it does not exist
                const createTableQuery = `
                CREATE TABLE IF NOT EXISTS channels (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    channel_id VARCHAR(255) NOT NULL UNIQUE,
                    count INT DEFAULT 0,
                    last_user VARCHAR(255)
                )
            `;
                con.query(createTableQuery, function (err, result) {
                    if (err) throw err;
                    console.log("Table channels checked/created!");
                });
            });
        }
    );
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
        }
    }
}

client.on(Events.Ready, () => {
    console.log("Ready as " + client.user.tag);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    console.log(`Command attempt: ${interaction.commandName}`);

    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`
        );
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
});

counter = new Count(0, "base-10");

client.on(Events.MessageCreate, async (message) => {
    let countingChannel = 1278189225275297845;

    if (message.channelId == countingChannel) {
        if (!checkChars(message.content)) {
            return;
        }

        if (message.content == counter.count + 1) {
            if (counter.lastUser == message.author.id) {
                message.react("❌");
                message.reply("You can't count twice in a row!");
                counter.count = 0;
                counter.lastUser = null;
            } else {
                message.react("✅");
                counter.increment();
                counter.lastUser = message.author.id;
            }
        } else {
            message.react("❌");
            message.reply("Sorry buddy, you messed it up! Start at one again!");
            counter.count = 0;
            counter.lastUser = null;
        }
    }
});

client.login(TOKEN);
