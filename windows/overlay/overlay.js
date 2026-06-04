overwolf.windows.onMessageReceived
    .addListener(message => {

        if (
            message.id !==
            "stats-update"
        ) {
            return;
        }

        const data =
            message.content;

        document
            .getElementById("kda")
            .innerText =
            `KDA: ${data.k} / ${data.d} / ${data.a}`;

        document
            .getElementById("map")
            .innerText =
            `MAP: ${data.map}`;

        document
            .getElementById("round")
            .innerText =
            `ROUND: ${data.r}`;

        document
            .getElementById("score")
            .innerText =
            `SCORE: ${data.w} - ${data.l}`;

        document
            .getElementById("team")
            .innerText =
            `TEAM: ${data.t}`;

        document
            .getElementById("status")
            .innerText =
            `STATUS: ${data.status}`;
    });