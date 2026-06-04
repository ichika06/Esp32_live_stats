const WORKER_URL =
    "https://worker.jmestareja05.workers.dev/update";

const VALORANT_ID = 21640;

let overlayWindowId = null;

const state = {
    k: 0,
    d: 0,
    a: 0,

    r: 0,

    w: 0,
    l: 0,

    t: "UNK",

    map: "Unknown",

    status: "Waiting",

    scene: ""
};

function sendState() {

    fetch(WORKER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(state)
    }).catch(console.error);
}

function updateOverlay() {

    if (!overlayWindowId) {
        return;
    }

    overwolf.windows.sendMessage(
        overlayWindowId,
        "stats-update",
        state,
        () => {}
    );
}

function resetStats() {

    state.k = 0;
    state.d = 0;
    state.a = 0;

    state.r = 0;

    state.w = 0;
    state.l = 0;

    state.t = "UNK";

    state.map = "Unknown";

    state.status = "Waiting";

    state.scene = "";
}

function showOverlay() {

    overwolf.windows.obtainDeclaredWindow(
        "overlay",
        result => {

            if (result.status !== "success") {
                return;
            }

            overlayWindowId =
                result.window.id;

            overwolf.windows.restore(
                overlayWindowId
            );
        }
    );
}

function hideOverlay() {

    if (!overlayWindowId) {
        return;
    }

    overwolf.windows.hide(
        overlayWindowId
    );
}

function enableFeatures() {

    overwolf.games.events.setRequiredFeatures(
        [
            "me",
            "match_info",
            "game_info"
        ],
        result => {
            console.log(
                "Features:",
                result
            );
        }
    );
}

function handleInfoUpdate(event) {

    if (!event.info) {
        return;
    }

    const info = event.info;

    if (info.me) {

        state.k =
            Number(info.me.kills || 0);

        state.d =
            Number(info.me.deaths || 0);

        state.a =
            Number(info.me.assists || 0);
    }

    if (info.match_info) {

        const match =
            info.match_info;

        if (match.round_number != null) {

            state.r =
                Number(match.round_number);
        }

        if (match.map) {

            state.map =
                match.map;
        }

        if (match.team) {

            state.t =
                match.team;
        }

        if (match.score) {

            state.w =
                Number(
                    match.score.won || 0
                );

            state.l =
                Number(
                    match.score.lost || 0
                );
        }
    }

    if (info.game_info) {

        const game =
            info.game_info;

        if (game.state) {

            state.status =
                game.state;
        }

        if (game.scene) {

            state.scene =
                game.scene;
        }
    }

    updateOverlay();

    sendState();
}

function handleNewEvents(data) {

    console.log(
        "EVENT:",
        data
    );

    updateOverlay();

    sendState();
}

overwolf.games.events
    .onInfoUpdates2
    .addListener(
        handleInfoUpdate
    );

overwolf.games.events
    .onNewEvents
    .addListener(
        handleNewEvents
    );

overwolf.games.onGameInfoUpdated
    .addListener(info => {

        if (
            !info.gameInfo ||
            info.gameInfo.id !== VALORANT_ID
        ) {
            return;
        }

        if (
            info.runningChanged &&
            info.gameInfo.isRunning
        ) {

            console.log(
                "Valorant Started"
            );

            showOverlay();

            enableFeatures();
        }

        if (
            info.runningChanged &&
            !info.gameInfo.isRunning
        ) {

            console.log(
                "Valorant Closed"
            );

            resetStats();

            hideOverlay();

            updateOverlay();

            sendState();
        }
    });

overwolf.games.getRunningGameInfo(
    game => {

        if (
            game &&
            game.id === VALORANT_ID
        ) {

            showOverlay();

            enableFeatures();
        }
    }
);

console.log(
    "Background Loaded"
);