class OutcomeColor {

    constructor(color) {
        this.red = color.red;
        this.green = color.green;
        this.blue = color.blue;
    }

    toRgbString() {
        return "rgb(" + red + ", " + green + ", " + blue + ")";
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

    outcomeIdToOutcome = new Map();

    constructor(eventId, title) {
        this.eventId = eventId;
        this.title = title;
    }

    setPoints(outcomes) {
        outcomes.forEach(outcome => {
            if (!this.outcomeIdToOutcome.has(outcome.outcomeId)) {
                this.outcomeIdToOutcome[outcome.outcomeId] = new PredictionOutcome(
                    new OutcomeColor(outcome.color),
                    outcome.outcomeId,
                    outcome.title
                );
            }

            this.outcomeIdToOutcome[outcome.outcomeId].update(outcome.channelPoints, outcome.users)
        });
    }

    toChartDataStructure() {
        const outcomes = [];

        this.outcomeIdToOutcome.values.forEach(outcome => {
            outcomes.push(outcome);
        });

        outcomes.sort(a, b => {
            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        });

        const data = [];
        const backgroundColor = [];

        outcomes.forEach(outcome => {
            data.push(outcome.channelPoints);
            backgroundColor.push(outcome.color.toRgbString());
        });

        return {
            "type": "doughnut",
            "options": {
                "animation": true,
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

        switch (jsonResponse.predictionType) {
            case "prediction_begin":
                this.#handlePredictionBegin(jsonResponse);
                return true;

            case "prediction_end":
                this.#handlePredictionEnd(jsonResponse);
                return true;

            case "prediction_lock":
                this.#handlePredictionLock(jsonResponse);
                return true;

            case "prediction_progress":
                this.#handlePredictionProgress(jsonResponse);
                return true;

            default:
                return false;
        }
    }

    #handlePredictionBegin(jsonResponse) {
        this.ongoingPrediction = new PredictionData(
            jsonResponse.eventId,
            jsonResponse.title
        );

        this.ongoingPrediction.setPoints(jsonResponse.outcomes);
    }

    #handlePredictionEnd(jsonResponse) {
        this.ongoingPrediction = null;
    }

    #handlePredictionLock(jsonResponse) {
        // intentionally empty
    }

    #handlePredictionProgress(jsonResponse) {
        this.ongoingPrediction.setPoints(jsonResponse.outcomes);
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
        chart = new Chart(ctx);
    } else {
        chart.data.datasets = ongoingPrediction.data.datasets;
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
