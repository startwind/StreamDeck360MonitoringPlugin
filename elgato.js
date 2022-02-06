function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
    pluginUUID = inPluginUUID

    // Open the web socket
    websocket = new WebSocket("ws://127.0.0.1:" + inPort);

    function registerPlugin(inPluginUUID) {
        var json = {
            "event": inRegisterEvent,
            "uuid": inPluginUUID
        };

        websocket.send(JSON.stringify(json));
    }

    websocket.onopen = function () {
        // WebSocket is connected, send message
        registerPlugin(pluginUUID);
    };

    websocket.onmessage = function (evt) {
        // Received message from Stream Deck
        var jsonObj = JSON.parse(evt.data);
        var event = jsonObj['event'];
        var context = jsonObj['context'];

        if (event == "keyDown") {
            var jsonPayload = jsonObj['payload'];
            var settings = jsonPayload['settings'];
            var coordinates = jsonPayload['coordinates'];
            var userDesiredState = jsonPayload['userDesiredState'];
            twitterAction.onKeyDown(context, settings, coordinates, userDesiredState);
        } else if (event == "willAppear") {
            var jsonPayload = jsonObj['payload'];
            var settings = jsonPayload['settings'];
            var coordinates = jsonPayload['coordinates'];
            twitterAction.onWillAppear(context, settings, coordinates);
        }
    };
}