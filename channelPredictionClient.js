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

    setPoints(outcomes) {
        outcomes.forEach(outcome => {
            if (!this.#outcomeIdToOutcome.has(outcome.outcomeId)) {
                this.#outcomeIdToOutcome.set(
                    outcome.outcomeId,
                    new PredictionOutcome(
                        new OutcomeColor(
                            outcome.color.red,
                            outcome.color.green,
                            outcome.color.blue
                        ),
                        outcome.outcomeId,
                        outcome.title
                    )
                );
            }

            this.#outcomeIdToOutcome.get(outcome.outcomeId).update(outcome.channelPoints, outcome.users)
        });
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
                    "duration": 1000,
                    "easing": "easeInOutBack"
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

        ongoingPrediction.setPoints(eventData.outcomes);
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
            ongoingPrediction.setPoints(eventData.outcomes);
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
