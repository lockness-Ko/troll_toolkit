const {
    Console
} = require("console");
const Eris = require("eris");
var fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const express = require('express');
const bodyParser = require('body-parser')
const {
    join
} = require("path");
const cors = require('cors');
const open = require('open');
open('http://localhost:6942');
const app = express()
const port = 6942

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

let nukeInterval;

var bots = [];
var botw = [];

let addBot = (e) => {
    bots.push(new Eris(e));
    bots[bots.length - 1].on("ready", () => { // When the bot is ready
        console.log("Ready!"); // Log "Ready!"
    });
    bots[bots.length - 1].connect();
}

let loadBots = () => {
    activeBots = [];
    bots = [], botw = [];
    console.log("Reading from ./config.troll");
    fs.readFile(__dirname + '/config.troll', function (err, data) {
        if (err) {
            throw err;
        }
        console.log("Parsing data");
        lines = data.toString().split('\n');
        botw = lines[0].split('[')[1].split(']')[0].split(','); // This is where all the tokens are loaded
        // console.log(botw.length);
        botw.forEach((z) => {
            bots.push(new Eris(z));
        });

        console.log("Logging in bots");
        bots.forEach((z) => {
            z.on("ready", () => { // When the bot is ready
                console.log("Ready!"); // Log "Ready!"
            });
            console.log("Loaded");
            z.connect();
        });
        console.log("Done!");
        setTimeout(t, 100);
    });
}

let joinBots = () => {
    bots.forEach((z) => {

    });
}

let channels = [];
let users = [];
let activeBots = [];
let guild;

let scopeServer = (guid = "") => {
    channels = [];
    users = [];
    // guid = "553713100067569664"
    console.log(guid);
    if (guid == "") {
        let gid = "";
        readline.question('Guild ID? ', (o) => {
            gid = o;
            bots.forEach((z) => {
                nomap = [];
                z.guilds.forEach((x) => {
                    nomap.push(x.id);
                });
                activeBots.push(nomap.indexOf(o) != -1);
            });

            for (let i = 0; i < bots.length; i++) {
                if (!activeBots[i]) {
                    continue;
                } else {
                    guild = bots[i].guilds.find((x) => {
                        return x.id.toString() == gid
                    })
                    channels = bots[i].guilds.find((x) => {
                        return x.id.toString() == gid
                    }).channels.map((q) => {
                        return {
                            "name": q.name,
                            "id": q.id
                        }
                    });
                    users = bots[i].guilds.find((x) => {
                        return x.id.toString() == gid
                    }).members.map((q) => {
                        return {
                            "name": q.username,
                            "id": q.id
                        }
                    });
                    console.log("Channels ");
                    console.log(channels);
                    // fs.writeFileSync('./channels.txt', channels);
                    console.log("Users ");
                    console.log(users);
                    // return [channels, users];
                    break;
                }
            }

            setTimeout(t, 100);
        });
    } else {
        let gid = guid;
        bots.forEach((z) => {
            nomap = [];
            z.guilds.forEach((x) => {
                nomap.push(x.id);
            });
            activeBots.push(nomap.indexOf(gid) != -1);
        });

        for (let i = 0; i < bots.length; i++) {
            if (!activeBots[i]) {
                continue;
            } else {
                guild = bots[i].guilds.find((x) => {
                    return x.id.toString() == gid
                })
                channels = bots[i].guilds.find((x) => {
                    return x.id.toString() == gid
                }).channels.map((q) => {
                    return {
                        "name": q.name,
                        "id": q.id
                    }
                });
                users = bots[i].guilds.find((x) => {
                    return x.id.toString() == gid
                }).members.map((q) => {
                    return {
                        "name": q.username,
                        "id": q.id
                    }
                });
                console.log("Channels ");
                console.log(channels);
                // fs.writeFileSync('./channels.txt', channels);
                console.log("Users ");
                console.log(users);
                // return "test";
                break;
            }
        }

    }

}

let sayMessage = (chan = "", msg = "") => {
    if (chan == "" || msg == "") {

        if (channels == []) {
            console.log("BRUH YOU NEED TO RUN SERVER SCOPE FIRST!");
            setTimeout(t, 100);
        } else {
            console.log("Which channel?");
            channels.forEach((x, d) => {
                console.log(`${d}) ${x.name} | ${x.id}`);
            });
            readline.question('> ', (o) => {
                for (let i = 0; i < bots.length; i++) {
                    if (!activeBots[i]) {
                        continue;
                    } else {
                        readline.question('Message? ', (q) => {
                            bots[i].createMessage(channels[parseInt(o)].id, q).then(() => {
                                setTimeout(t, 100);
                            }).catch((e, ex) => {
                                console.log("Error bruh. Trolls got blockd");
                            });
                        });
                        break;
                    }
                }
            });
        }
    } else {
        for (let i = 0; i < bots.length; i++) {
            if (!activeBots[i]) {
                continue;
            } else {
                bots[i].createMessage(chan, msg).catch((e, ex) => {
                    console.log("Error bruh. Trolls got blockd");
                });
                break;
            }
        }
    }
}

let massPing = () => {
    if (channels == []) {
        console.log("BRUH YOU NEED TO RUN SERVER SCOPE FIRST!");
        setTimeout(t, 100);
    } else {
        console.log("Which channel?");
        channels.forEach((x, d) => {
            console.log(`${d}) ${x.name} | ${x.id}`);
        });
        readline.question('> ', (o) => {
            for (let i = 0; i < bots.length; i++) {
                if (!activeBots[i]) {
                    continue;
                } else {
                    console.log("<@!" + users.map((xd) => {
                        return xd.id
                    }).join("> <@!"));
                    bots[i].createMessage(channels[parseInt(o)].id, "<@!" + users.map((xd) => {
                        return xd.id
                    }).join("> <@!") + ">").then(() => {
                        setTimeout(t, 100);
                    }).catch((e, ex) => {
                        console.log("Error bruh. Trolls got blockd");
                    });
                    break;
                }
            }
        });
    }
}

let stopNuker = () => {
    clearInterval(nukeInterval);
}

let nuke = (chan = "", msg = "") => {
    if (chan == "" || msg == "") {
        if (channels == []) {
            console.log("BRUH YOU NEED TO RUN SERVER SCOPE FIRST!");
            setTimeout(t, 100);
        } else {
            console.log("Which channels? (separated by comma)");
            channels.forEach((x, d) => {
                console.log(`${d}) ${x.name} | ${x.id}`);
            });
            readline.question('> ', (o) => {
                for (let i = 0; i < bots.length; i++) {
                    if (!activeBots[i]) {
                        continue;
                    } else {
                        readline.question('Message? ', (qd) => {
                            console.log("Press Ctrl+C to stop");
                            if (o == "all") {
                                o = Array.from(Array(channels.length).keys()).map((xsds) => {
                                    return xsds.toString();
                                }).join(",");
                            }
                            if (qd == "all") {
                                qd = "<@!" + users.map((xd) => {
                                    return xd.id
                                }).join("> <@!") + ">";
                            } else if (qd == "funny") {
                                qd = "we do a little aasdads trolling  ﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽ https://gfycat.com/flickeringdrearyborzoi";
                            }
                            nukeInterval = setInterval(() => {
                                for (i = 0; i < o.split(",").length; i++) {
                                    bots.forEach((z) => {
                                        z.createMessage(channels[parseInt(o.split(",")[i])].id, qd).catch((e, ex) => {});
                                    });
                                }
                            }, 500);
                            setTimeout(t, 100);
                        });
                        break;
                    }
                }
            });
        }
    } else {
        let o = chan;
        let qd = msg;
        console.log("Press Ctrl+C to stop");
        if (o == "all") {
            o = Array.from(Array(channels.length).keys()).map((xsds) => {
                return xsds.toString();
            }).join(",");
        }
        if (qd == "all") {
            qd = "<@!" + users.map((xd) => {
                return xd.id
            }).join("> <@!") + ">";
        } else if (qd == "funny") {
            qd = "we do a little aasdads trolling  ﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽ https://gfycat.com/flickeringdrearyborzoi";
        }
        nukeInterval = setInterval(() => {
            for (i = 0; i < o.split(",").length; i++) {
                bots.forEach((z) => {
                    z.createMessage(chan, qd).catch((e, ex) => {});
                });
            }
        }, 500);
    }

}

let autoReply = (msgx = "") => {
    // console.log(msgx);
    if (msgx == "") {
        if (channels == []) {
            console.log("BRUH YOU NEED TO RUN SERVER SCOPE FIRST!");
            setTimeout(t, 100);
        } else {
            for (let i = 0; i < bots.length; i++) {
                if (!activeBots[i]) {
                    continue;
                } else {
                    readline.question('Message? ', (q) => {
                        bots[i].on("messageCreate", (msg) => {
                            // console.log(bots[i].user.id,msg.author.id);
                            if (msg.author.id != bots[i].user.id) {
                                bots[i].createMessage(msg.channel.id, q).catch((e, ex) => {});
                            }
                        });
                        setTimeout(t, 100);
                    });

                    break;
                }
            }
        }
    } else {
        for (let i = 0; i < bots.length; i++) {
            if (!activeBots[i]) {
                continue;
            } else {
                bots[i].on("messageCreate", (msg) => {
                    if (msg.author.id != bots[i].user.id) {
                        bots[i].createMessage(msg.channel.id, msgx).catch((e, ex) => {});
                    }
                });

                break;
            }
        }
    }
}

let threadNuke = () => {
    if (channels == []) {
        console.log("BRUH YOU NEED TO RUN SERVER SCOPE FIRST!");
        setTimeout(t, 100);
    } else {
        console.log("Which channels? (separated by comma)");
        channels.forEach((x, d) => {
            console.log(`${d}) ${x.name} | ${x.id}`);
        });
        readline.question('> ', (o) => {
            for (let i = 0; i < bots.length; i++) {
                if (!activeBots[i]) {
                    continue;
                } else {
                    readline.question('Message? ', (qd) => {
                        console.log("Press Ctrl+C to stop");
                        if (o == "all") {
                            o = Array.from(Array(channels.length).keys()).map((xsds) => {
                                return xsds.toString();
                            }).join(",");
                        }
                        if (qd == "all") {
                            qd = "<@!" + users.map((xd) => {
                                return xd.id
                            }).join("> <@!") + ">";
                        } else if (qd == "funny") {
                            qd = "we do a little aasdads trolling  ﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽﷽﷽ ﷽﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽  ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽ ﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽ https://gfycat.com/flickeringdrearyborzoi";
                        }
                        setInterval(() => {
                            for (i = 0; i < o.split(",").length; i++) {
                                bots.forEach((z) => {
                                    let test = z.createMessage(channels[parseInt(o.split(",")[i])].id, qd).catch((e, ex) => {});
                                    test.then((x) => {
                                        console.log(x.channel.threads.create({
                                            name: 'THE J RUN',
                                            autoArchiveDuration: 60,
                                            reason: 'Reason deez nuts!',
                                        }));
                                    });
                                });
                            }
                        }, 500);
                        setTimeout(t, 100);
                    });
                    break;
                }
            }
        });
    }
}

let autoReact = (msg = "") => {
    if (msg == "") {
        if (channels == []) {
            console.log("BRUH YOU NEED TO RUN SERVER SCOPE FIRST!");
            setTimeout(t, 100);
        } else {
            for (let i = 0; i < bots.length; i++) {
                if (!activeBots[i]) {
                    continue;
                } else {
                    bots[i].on("messageCreate", (msg) => {
                        msg.addReaction("😳");
                    });
                    setTimeout(t, 100);
                    break;
                }
            }
        }
    } else {
        for (let i = 0; i < bots.length; i++) {
            if (!activeBots[i]) {
                continue;
            } else {
                bots[i].on("messageCreate", (msg) => {
                    msg.addReaction(msg);
                });
                break;
            }
        }
    }
}

let banner = `
 _______           _  _   _______             _  _     _  _           __     ___  
|__   __|         | || | |__   __|           | || |   (_)| |         /_ |   / _ \\ 
  | | _ __  ___  | || |    | |  ___    ___  | || | __ _ | |_  __   __| |  | | | |
  | || '__|/ _ \\ | || |    | | / _ \\  / _ \\ | || |/ /| || __| \\ \\ / /| |  | | | |
  | || |  | (_) || || |    | || (_) || (_) || ||   < | || |_   \\ V / | | _| |_| |
  |_||_|   \\___/ |_||_|    |_| \\___/  \\___/ |_||_|\\_\\|_| \\__|   \\_/  |_|(_)\\___/ 
  
Welcome to Troll Toolkit v1.0!
`

let banner2 = `
QQQQQQQQQQQQQQQQQQQWQQQQQWWWBBBHHHHHHHHHBWWWQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ
QQQQQQQQQQQQQQQD!'__ssaaaaaaaaaass_ass_s____.  -~""??9VWQQQQQQQQQQQQQQQQQQQ
QQQQQQQQQQQQQP'_wmQQQWWBWV?GwwwmmWQmwwwwwgmZUVVHAqwaaaac,"?9$QQQQQQQQQQQQQQ
QQQQQQQQQQQW! aQWQQQQW?qw#TTSgwawwggywawwpY?T?TYTYTXmwwgZ$ma/-?4QQQQQQQQQQQ
QQQQQQQQQQW' jQQQQWTqwDYauT9mmwwawww?WWWWQQQQQ@TT?TVTT9HQQQQQQw,-4QQQQQQQQQ
QQQQQQQQQQ[ jQQQQQyWVw2$wWWQQQWWQWWWW7WQQQQQQQQPWWQQQWQQw7WQQQWWc)WWQQQQQQQ
QQQQQQQQQf jQQQQQWWmWmmQWU???????9WWQmWQQQQQQQWjWQQQQQQQWQmQQQQWL 4QQQQQQQQ
QQQQQQQP'.yQQQQQQQQQQQP"       <wa,.!4WQQQQQQQWdWP??!"??4WWQQQWQQc ?QWQQQQQ
QQQQQP'_a.<aamQQQW!<yF "!' ..  "??$Qa "WQQQWTVP'    "??' =QQmWWV?46/ ?QQQQQ
QQQP'sdyWQP?!'.-"?46mQQQQQQT!mQQgaa. <wWQQWQaa _aawmWWQQQQQQQQQWP4a7g -WWQQ
QQ[ j@mQP'adQQP4ga, -????" <jQQQQQWQQQQQQQQQWW;)WQWWWW9QQP?"'  -?QzQ7L ]QQQ
QW jQkQ@ jWQQD'-?$QQQQQQQQQQQQQQQQQWWQWQQQWQQQc "4QQQQa   .QP4QQQQfWkl jQQQ
QE ]QkQk $D?'  waa "?9WWQQQP??T?47'_aamQQQQQQWWQw,-?QWWQQQQQ'"QQQD\\Qf(.QWQQ
QQ,-Qm4Q/-QmQ6 "WWQma/  "??QQQQQQL 4W"- -?$QQQQWP's,awT$QQQ@  "QW@?$:.yQQQQ
QQm/-4wTQgQWQQ,  ?4WWk 4waac -???$waQQQQQQQQF??'<mWWWWWQW?^  ' ]6QQ' yQQQQQ
QQQQw,-?QmWQQQQw  a,    ?QWWQQQw _.  "????9VWaamQWV???"  a j/  ]QQf jQQQQQQ
QQQQQQw,"4QQQQQQm,-$Qa     ???4F jQQQQQwc <aaas _aaaaa 4QW ]E  )WQ'=QQQQQQQ
QQQQQQWQ/ $QQQQQQQa ?H ]Wwa,     ???9WWWh dQWWW,=QWWU?  ?!     )WQ ]QQQQQQQ
QQQQQQQQQc-QWQQQQQW6,  QWQWQQQk <c                             jWQ ]QQQQQQQ
QQQQQQQQQQ,"$WQQWQQQQg,."?QQQQ'.mQQQmaa,.,                . .; QWQ.]QQQQQQQ
QQQQQQQQQWQa ?$WQQWQQQQQa,."?( mQQQQQQW[:QQQQm[ ammF jy! j( } jQQQ(:QQQQQQQ
QQQQQQQQQQWWma "9gw?9gdB?QQwa, -??T$WQQ;:QQQWQ ]WWD _Qf +?! _jQQQWf QQQQQQQ
QQQQQQQQQQQQQQQws "Tqau?9maZ?WQmaas,,    --~-- ---  . _ssawmQQQQQQk 3QQQQWQ
QQQQQQQQQQQQQQQQWQga,-?9mwad?1wdT9WQQQQQWVVTTYY?YTVWQQQQWWD5mQQPQQQ ]QQQQQQ
QQQQQQQWQQQQQQQQQQQWQQwa,-??$QwadV}<wBHHVHWWBHHUWWBVTTTV5awBQQD6QQQ ]QQQQQQ
QQQQQQQQQQQQQQQQQQQQQQWWQQga,-"9$WQQmmwwmBUUHTTVWBWQQQQWVT?96aQWQQQ ]QQQQQQ
QQQQQQQQQQWQQQQWQQQQQQQQQQQWQQma,-?9$QQWWQQQQQQQWmQmmmmmQWQQQQWQQW(.yQQQQQW
QQQQQQQQQQQQQWQQQQQQWQQQQQQQQQQQQQga%,.  -??9$QQQQQQQQQQQWQQWQQV? sWQQQQQQQ
QQQQQQQQQWQQQQQQQQQQQQQQWQQQQQQQQQQQWQQQQmywaa,;~^"!???????!^'_saQWWQQQQQQQ
QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQWWWWQQQQQmwywwwwwwmQQWQQQQQQQQQQQ

================================================================

1) Load bots    - PUT TOKENS IN config.troll
2) Join server  - Self explanitory
3) Server-scope - Get list of all channels with send message perms and/or embed perms
4) Say message  - Self explanitory
5) Nuke         - Choose channels to nuke, a message to troll with and start trolling!
6) Auto-reply   - Automatically replies to all messages sent with your custom message!
7) Auto-react   - Above but reactions
8) Mass Ping    - Pings everyone in the server (only does all friends in server)
9) Thread Nuke  - This is incredibly funny, it only works on servers with threads enabled. It spams creating threads (NOT IMPLEMENTED)
`;

function t() {
    console.log(banner);
    console.log(`${bots.length} bots logged in`);
    console.log(banner2);
    readline.question('> ', input => {
        switch (input) {
            case "1":
                console.clear();
                loadBots();
                break;
            case "2":
                console.clear();
                joinBots();
                break;
            case "3":
                console.clear();
                scopeServer();
                break;
            case "4":
                console.clear();
                sayMessage();
                break;
            case "5":
                console.clear();
                nuke();
                break;
            case "6":
                console.clear();
                autoReply()
                break;
            case "7":
                console.clear();
                autoReact()
                break;
            case "8":
                console.clear();
                massPing();
                break;
            case "9":
                console.clear();
                threadNuke();
                break;

            default:
                console.log("YOU BROKE THE RULES!");
                setTimeout(t, 100);

                break;
        }
    });
}

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/loadbots', (req, res) => {
    if (botw = []) {
        loadBots();
    }
    if (req.query.id.toString() != "j") {
        addBot(req.query.id);
    }
    setTimeout(x => {
        res.send(botw);
    }, 500);
});

app.get('/joinserver', (req, res) => {
    joinBots();
});

app.get('/serverscope', (req, res) => {
    scopeServer(req.query.guid);
    setTimeout(() => {
        res.send([channels, users]);
    }, 200);
});

app.get('/saymessage', (req, res) => {
    sayMessage(req.query.channel, req.query.msg);
    res.send("Message Sent");
});

app.get('/nuke', (req, res) => {
    nuke(req.query.channel, req.query.msg);
    res.send("Nuking started");
});

app.get('/unnuke', (req, res) => {
    stopNuker();
    res.send("Nuking stopped");
    console.log(nukeInterval);
});

app.get('/threadnuke', (req, res) => {
    threadNuke();
});

app.get('/autoreply', (req, res) => {
    autoReply(req.query.msg);
    res.send("Replying");
});

app.get('/massping', (req, res) => {
    massPing();
});

t();