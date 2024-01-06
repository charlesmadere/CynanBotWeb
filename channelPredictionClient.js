class ChannelPredictionClient {

    constructor() {
        // intentionally empty
    }

    handleEvent(jsonResponse) {
        if (jsonResponse.eventType !== 'channelPrediction') {
            return false;
        }

        // TODO
        return false;
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
