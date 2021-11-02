class ChatBandManager {

    baseDir = "resources";

    bassFiles = [
        "Battletoads/Intro (Bass).mp3",
        "Castlevania 3/Demon Seed (Bass, Clipped).mp3",
        "Gimmick!/No Limits (Bass, Clipped).mp3",
        "Gimmick!/Untitled (Bass).mp3",
        "Street Fighter 2/Bass 1.mp3",
        "Super Mario Bros 3/Bass 1 (Super Hacked).mp3",
        "Super Mario World/Boss Battle (Bass, Boosted).mp3",
        "Super Mario World/Invincible (Bass).mp3",
        "ToeJam & Earl Panic on Funkotron/Rocket Rap (Bass, Amplified).mp3",
        "Zelda 3/Bass.mp3"
    ];

    drumFiles = [
        "Batman - The Video Game/Drums (Clipped).mp3",
        "Contra/Untitled (Drums, Clipped).mp3",
        "Ninja Gaiden/Depth of Wickedness (Drums 2, Clipped).mp3",
        "Super Mario Bros 3/Drums 1.mp3",
        "Teenage Mutant Ninja Turtles/Introduction (Drums, Clipped).mp3"
    ];

    guitarFiles = [
        "Battletoads/Guitar 1.mp3",
        "Blaster Master/Guitar 1.mp3",
        "Mega Man 2/Guitar 1.mp3",
        "Undertale/Guitar 1.mp3"
    ];

    magicFiles = [
        "Ninja Gaiden II/Thunder.mp3",
        "StarTropics/Track 34 (Magic).mp3"
    ];

    pianoFiles = [
        "Chrono Trigger/Piano 1.mp3",
        "Pokémon Red/Celadon City (Piano).mp3",
        "Pokémon Red/Pkmn Center (Piano).mp3",
        "StarTropics/In Search of the Cubes (Piano).mp3",
        "StarTropics/New Chapter (Piano).mp3",
        "StarTropics/The Sub-C (Piano).mp3",
        "StarTropics/Title (Piano).mp3"
    ];

    synthFiles = [
        "Ghosts n Goblins/Synth 1.mp3",
        "Legend of Zelda, The/Synth 1.mp3",
        "Marble Madness/Synth 1.mp3",
        "Pokémon Red/Lavender Town (Synth).mp3",
        "Super Mario Bros 3/Synth 1.mp3"
    ];

    trumpetFiles = [
        "Street Fighter 2/Trumpet 1.mp3",
        "Super Mario World/Star Road (Trumpet).mp3",
        "Zelda 3/Trumpet.mp3"
    ];

    violinFiles = [
        "Duck Tales/Violin 1.mp3",
        "Ninja Gaiden/Violin 1.mp3",
        "Ninja Gaiden/Vow of Revenge (Violin).mp3",
        "Solstice/Violin 1.mp3"
    ];

    whistleFiles = [
        "Chrono Trigger/Whistle 1.mp3",
        "Super Mario Bros 3/Whistle 1.wav",
        "Super Mario World/Staff Roll (Whistle).mp3"
    ];

    constructor() {
        // intentionally empty
    }

    handleEvent(jsonResponse) {
        if (jsonResponse.eventType !== 'chatBand') {
            return false;
        }

        switch (jsonResponse.eventData.instrument) {
            case "bass":
                this.play(this.bassFiles);
                return true;

            case "drums":
                this.play(this.drumFiles);
                return true;

            case "guitar":
                this.play(this.guitarFiles);
                return true;

            case "magic":
                this.play(this.magicFiles);
                return true;

            case "piano":
                this.play(this.pianoFiles);
                return true;

            case "synth":
                this.play(this.synthFiles);
                return true;

            case "trumpet":
                this.play(this.trumpetFiles);
                return true;

            case "violin":
                this.play(this.violinFiles);
                return true;

            case "whistle":
                this.play(this.whistleFiles);
                return true;

            default:
                return false;
        }
    }

    play(instrumentFiles) {
        var randomNumber = Math.floor(Math.random() * instrumentFiles.length);
        var instrumentFile = this.baseDir + "/" + instrumentFiles[randomNumber];

        const audio = new Audio(instrumentFile);
        audio.loop = false;

        audio.addEventListener("canplaythrough", event => {
            try {
                audio.play();
            } catch (error) {
                console.log("error playing " + instrumentFile + ":" + error);
            }
        });
    }

}


const delay = ms => new Promise(res => setTimeout(res, ms));
const chatBandManager = new ChatBandManager();

const websocketFunction = async () => {
    while (true) {
        try {
            var webSocket = new WebSocket("ws://192.168.1.2:8765");

            webSocket.onmessage = function (event) {
                const jsonResponse = JSON.parse(event.data);

                if (chatBandManager.handleEvent(jsonResponse)) {
                    console.log("chatBandManager handled event: " + event)
                } else {
                    console.log("unhandled event: " + event)
                }
            };
        } catch (error) {
            console.error(error);
        }

        await delay(30000);
    }
}

websocketFunction()
