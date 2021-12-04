class ChatBandManager {

    baseDir = "resources";

    bassFiles = [
        "Actraiser/Bass.mp3",
        "Battletoads/Intro (Bass).mp3",
        "Castlevania 3/Demon Seed (Bass, Clipped).mp3",
        "Contra 3/Bass.mp3",
        "Earthbound/Bass.mp3",
        "F-Zero/Bass.mp3",
        "Gimmick!/No Limits (Bass, Clipped).mp3",
        "Gimmick!/Untitled (Bass).mp3",
        "Journey to Silius/Bass.mp3",
        "Neo Turf Masters/Bass.mp3",
        "Secret of Mana/Bass.mp3",
        "Street Fighter 2/Bass 1.mp3",
        "Streets of Rage 2/Slow moon (Bass).mp3",
        "Streets of Rage 2/Wave 131 (Bass).mp3",
        "Super Mario Bros 3/Bass 1 (Super Hacked).mp3",
        "Super Mario World/Boss Battle (Bass, Boosted).mp3",
        "Super Mario World/Invincible (Bass).mp3",
        "Tetris Attack/Bass.mp3",
        "Tetris Attack/Bass 2.mp3",
        "ToeJam & Earl Panic on Funkotron/Rocket Rap (Bass, Amplified).mp3",
        "Zelda 3/Bass.mp3"
    ];

    drumFiles = [
        "Batman - The Video Game/Streets of Gotham (Drums) (Clipped).mp3",
        "Contra/Untitled (Drums, Clipped).mp3",
        "Mega Man X 2/Drums.mp3",
        "Ninja Gaiden/Depth of Wickedness (Drums 2, Clipped).mp3",
        "Ninja Gaiden/Evading the Enemy (Drums).mp3",
        "Ninja Gaiden/Nowhere to Run (Drums 1).mp3",
        "Ninja Gaiden/Nowhere to Run (Drums 2).mp3",
        "Secret of Mana/Drums.mp3",
        "Secret of Mana/Drums 2.mp3",
        "Streets of Rage 2/Dreamer (Drums).mp3",
        "Streets of Rage 2/Wave 131 (Drums).mp3",
        "Super Castlevania IV/Drums.mp3",
        "Super Mario Bros 3/Drums 1.mp3",
        "Teenage Mutant Ninja Turtles/Introduction (Drums, Clipped).mp3"
    ];

    guitarFiles = [
        "Batman - The Video Game/Plot Thickens (Guitar).mp3",
        "Battletoads/Guitar 1.mp3",
        "Blaster Master/Guitar 1.mp3",
        "Contra/Bases I and II (Guitar).mp3",
        "Castlevania Dracula X/Guitar.mp3",
        "FF Mystic Quest/Guitar.mp3",
        "Mega Man 2/Guitar 1.mp3",
        "Mega Man 4/Skull Man v1 (Guitar).mp3",
        "Mega Man 4/Skull Man v2 (Guitar).mp3",
        "Mega Man X/Guitar.mp3",
        "Mega Man X/Guitar 2.mp3",
        "Ninja Gaiden/SFX (Next Act) (Guitar).mp3",
        "Ninja Gaiden II/Domination of Darkness (Guitar 2).mp3",
        "Ninja Gaiden II/Domination of Darkness (Guitar 3).mp3",
        "SimCity/Guitar.mp3",
        "Teenage Mutant Ninja Turtles/Introduction (Guitar 3).mp3",
        "Teenage Mutant Ninja Turtles/Introduction (Guitar 5).mp3",
        "Teenage Mutant Ninja Turtles/Overworld (Guitar 1).mp3",
        "Teenage Mutant Ninja Turtles/Overworld (Guitar 2).mp3",
        "Undertale/Guitar 1.mp3",
        "Yoshi's Island/Guitar.mp3"
    ];

    magicFiles = [
        "Ninja Gaiden II/Thunder.mp3",
        "StarTropics/Track 34 (Magic).mp3",
        "Super Mario World/Fireballs.mp3"
    ];

    pianoFiles = [
        "Battle Garegga/Piano.mp3",
        "Chrono Trigger/Piano 1.mp3",
        "Ninja Gaiden/Unbreakable Determination (Piano 1).mp3",
        "Ninja Gaiden/Unbreakable Determination (Piano 2).mp3",
        "Ninja Gaiden II/Deep Within the Heart (Piano).mp3",
        "Pokémon Red/Celadon City (Piano).mp3",
        "Pokémon Red/Pkmn Center (Piano).mp3",
        "Secret of Mana/Piano.mp3",
        "StarTropics/In Search of the Cubes (Piano).mp3",
        "StarTropics/New Chapter (Piano).mp3",
        "StarTropics/Overworld (Piano 1).mp3",
        "StarTropics/Overworld (Piano 2).mp3",
        "StarTropics/The Sub-C (Piano).mp3",
        "StarTropics/Title (Piano).mp3"
    ];

    synthFiles = [
        "Contra/Title Screen (Synth).mp3",
        "Ghosts n Goblins/Synth 1.mp3",
        "Legend of Zelda, The/Synth 1.mp3",
        "Marble Madness/Synth 1.mp3",
        "Metroid/Mission Completed Successfully (Synth).mp3",
        "Ninja Gaiden/Unbreakable Determination (Synth).mp3",
        "Pokémon Red/Lavender Town (Synth).mp3",
        "Super Mario Bros 3/Synth 1.mp3"
    ];

    trumpetFiles = [
        "SimCity/Trumpet.mp3",
        "Street Fighter 2/Trumpet 1.mp3",
        "Super Mario World/Star Road (Trumpet).mp3",
        "Terranigma/Trumpet.mp3",
        "Tetris Attack/Trumpet.mp3",
        "Zelda 3/Trumpet.mp3"
    ];

    violinFiles = [
        "Duck Tales/Violin 1.mp3",
        "Ninja Gaiden/A Hero's End (Ending 1) (Violin).mp3",
        "Ninja Gaiden/For Your Love (Ending III) (Violin).mp3",
        "Ninja Gaiden/Vow of Revenge (Violin).mp3",
        "Ninja Gaiden II/Approaching Evil (Opening) (Violin 2).mp3",
        "Ninja Gaiden II/Deep Within the Heart (Violin 2).mp3",
        "Solstice/Violin 1.mp3"
    ];

    whistleFiles = [
        "Chrono Trigger/Whistle 1.mp3",
        "Kirby's Adventure/Flute.mp3",
        "Neutopia II/Flute.mp3",
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
    var webSocket = new WebSocket("ws://192.168.1.2:8765");

    webSocket.onerror = function (event) {
        console.error("WebSocket error occurred:", event);
    }

    webSocket.onmessage = function (event) {
        const jsonResponse = JSON.parse(event.data);

        if (chatBandManager.handleEvent(jsonResponse)) {
            console.log("chatBandManager handled event: " + event);
        } else {
            console.log("unhandled event: " + event);
        }
    };
}

websocketFunction()
