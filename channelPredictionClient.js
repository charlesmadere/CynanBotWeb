function areOutcomesDayAtTheRaces(outcomeIdToOutcome) {
    if (outcomeIdToOutcome.size != 4) {
        return false;
    }

    var foundBobOmb = false;
    var foundBoo = false;
    var foundThwomp = false;
    var foundWhomp = false;

    outcomeIdToOutcome.forEach((value, key, map) => {
        const title = value.title.toLowerCase();

        if (title.includes("bob-omb") || title.includes("bobomb")) {
            foundBobOmb = true;
        } else if (title.includes("boo")) {
            foundBoo = true;
        } else if (title.includes("thwomp")) {
            foundThwomp = true;
        } else if (title.includes("whomp")) {
            foundWhomp = true;
        }
    });

    return foundBobOmb && foundBoo && foundThwomp && foundWhomp;
}

function randomInt() {
    let max = 100;
    let min = 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class OutcomeColor {

    #blue = null;
    #green = null;
    #red = null;

    constructor(red, green, blue) {
        this.#red = red;
        this.#green = green;
        this.#blue = blue;
    }

    getRgbString() {
        return "rgb(" + this.#red + ", " + this.#green + ", " + this.#blue + ")";
    }

}

class PredictionOutcome {

    constructor(color, outcomeId, title) {
        this.color = color;
        this.outcomeId = outcomeId;
        this.title = title;
        this.channelPoints = 0;
        this.users = 0;
    }

    setColor(color) {
        this.color = color;
    }

    update(channelPoints, users) {
        this.channelPoints = channelPoints;
        this.users = users;
    }

}

class PredictionData {

    #outcomeIdToOutcome = new Map();

    constructor(eventId, title) {
        this.eventId = eventId;
        this.title = title;
    }

    getFullChartDataStructure() {
        const outcomes = this.#getSortedOutcomes()
        const data = [];
        const backgroundColor = [];
        const labels = [];

        outcomes.forEach(outcome => {
            data.push(outcome.channelPoints);
            backgroundColor.push(outcome.color.getRgbString());
            labels.push(outcome.title);
        });

        return {
            "type": "doughnut",
            "options": {
                "animation": {
                    "duration": 2000,
                    "easing": "easeInOutBounce"
                },
                "borderColor": "rgba(0, 0, 0, 0)",
                "events": [],
                "layout": {
                    "autoPadding": true
                },
                "legend": {
                    "display": false
                },
                "plugins": {
                    "subtitle": {
                        "display": false
                    },
                    "title": {
                        "display": false
                    },
                    "tooltip": {
                        "enabled": false
                    }
                },
                "responsive": true
            },
            "data": {
                "datasets": [{
                    "data": data,
                    "backgroundColor": backgroundColor
                }]
            }
        };
    }

    #getSortedOutcomes() {
        const outcomes = [];

        this.#outcomeIdToOutcome.forEach((value, key, map) => {
            outcomes.push(value);
        });

        outcomes.sort((a, b) => {
            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        });

        return outcomes
    }

    getUpdatedChartDataStructure() {
        const outcomes = this.#getSortedOutcomes()
        const updatedData = [];

        outcomes.forEach(outcome => {
            updatedData.push(outcome.channelPoints);
        });

        return updatedData;
    }

    setOutcomes(outcomes) {
        outcomes.forEach(outcome => {
            const predictionOutcome = new PredictionOutcome(
                new OutcomeColor(
                    outcome.color.red,
                    outcome.color.green,
                    outcome.color.blue
                ),
                outcome.outcomeId,
                outcome.title
            );

            this.#outcomeIdToOutcome.set(predictionOutcome.outcomeId, predictionOutcome);
        });

        if (areOutcomesDayAtTheRaces(this.#outcomeIdToOutcome)) {
            this.#updateOutcomeColorsToDayAtTheRaces();
        }
    }

    #updateOutcomeColorsToDayAtTheRaces() {
        this.#outcomeIdToOutcome.forEach((value, key, map) => {
            const title = value.title.toLowerCase();

            if (title.includes("bob-omb") || title.includes("bobomb")) {
                value.setColor(new OutcomeColor(193, 107, 2));
            } else if (title.includes("boo")) {
                value.setColor(new OutcomeColor(230, 230, 230));
            } else if (title.includes("thwomp")) {
                value.setColor(new OutcomeColor(64, 178, 255));
            } else if (title.includes("whomp")) {
                value.setColor(new OutcomeColor(85, 94, 103));
            }
        });
    }

    updateOutcomes(outcomes) {
        outcomes.forEach(outcome => {
            const predictionOutcome = this.#outcomeIdToOutcome.get(outcome.outcomeId);

            if (predictionOutcome != null) {
                predictionOutcome.update(outcome.channelPoints, outcome.users)
            }
        });
    }

}

class ChannelPredictionClient {

    ongoingPrediction = null;

    constructor() {
        // intentionally empty
    }

    handleEvent(jsonResponse) {
        if (jsonResponse.eventType !== "channelPrediction") {
            return false;
        }

        const eventData = jsonResponse.eventData;

        switch (eventData.predictionType) {
            case "prediction_begin":
                this.#handlePredictionBegin(eventData);
                return true;

            case "prediction_end":
                this.#handlePredictionEnd(eventData);
                return true;

            case "prediction_lock":
                this.#handlePredictionLock(eventData);
                return true;

            case "prediction_progress":
                this.#handlePredictionProgress(eventData);
                return true;

            default:
                return false;
        }
    }

    #handlePredictionBegin(eventData) {
        const ongoingPrediction = new PredictionData(
            eventData.eventId,
            eventData.title
        );

        ongoingPrediction.setOutcomes(eventData.outcomes);
        this.ongoingPrediction = ongoingPrediction;
    }

    #handlePredictionEnd(eventData) {
        this.ongoingPrediction = null;
    }

    #handlePredictionLock(eventData) {
        // intentionally empty
    }

    #handlePredictionProgress(eventData) {
        const ongoingPrediction = this.ongoingPrediction;

        if (ongoingPrediction != null) {
            ongoingPrediction.updateOutcomes(eventData.outcomes);
        }
    }

}

const delay = ms => new Promise(res => setTimeout(res, ms));
const channelPredictionClient = new ChannelPredictionClient();
const ctx = document.getElementById("channelPredictionChart");
var chart = null;

function updateChart(ongoingPrediction) {
    if (ongoingPrediction == null) {
        if (chart != null) {
            chart.destroy();
            chart = null;
        }
    } else if (chart == null) {
        const fullDataStructure = ongoingPrediction.getFullChartDataStructure()
        chart = new Chart(ctx, fullDataStructure);
    } else {
        const updatedDataStructure = ongoingPrediction.getUpdatedChartDataStructure()

        updatedDataStructure.forEach((value, index) => {
            chart.data.datasets[0].data[index] = value;
        });

        chart.update();
    }
}

const websocketFunction = async () => {
    var webSocket = new WebSocket("ws://localhost:8765");

    webSocket.onerror = function (event) {
        console.error("WebSocket error occurred:", event);
    }

    webSocket.onmessage = function (event) {
        const jsonResponse = JSON.parse(event.data);

        if (channelPredictionClient.handleEvent(jsonResponse)) {
            console.log("channelPredictionClient handled event:", jsonResponse);
            updateChart(channelPredictionClient.ongoingPrediction);
        } else {
            console.log("Unhandled event:", jsonResponse);
        }
    };
};

websocketFunction();
