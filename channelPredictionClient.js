class ChannelPredictionClient {

    #ongoingPrediction = null;

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
        // TODO
    }

    #handlePredictionEnd(jsonResponse) {
        this.#ongoingPrediction = null;
    }

    #handlePredictionLock(jsonResponse) {
        // intentionally empty
    }

    #handlePredictionProgress(jsonResponse) {
        // TODO
    }

}

const delay = ms => new Promise(res => setTimeout(res, ms));
const channelPredictionClient = new ChannelPredictionClient();

const websocketFunction = async () => {
    var webSocket = new WebSocket("ws://localhost:8765");

    webSocket.onerror = function (event) {
        console.error("WebSocket error occurred:", event);
    }

    webSocket.onmessage = function (event) {
        const jsonResponse = JSON.parse(event.data);

        if (channelPredictionClient.handleEvent(jsonResponse)) {
            console.log("channelPredictionClient handled event:", jsonResponse);
        } else {
            console.log("Unhandled event:", jsonResponse);
        }
    };
}

websocketFunction()
