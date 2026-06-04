let latest =
{
    k:0,
    d:0,
    a:0,
    r:0,
    w:0,
    l:0,
    t:"UNK"
};

export default {

    async fetch(req)
    {
        const url =
            new URL(req.url);

        if (
            req.method === "POST" &&
            url.pathname === "/update"
        )
        {
            latest =
                await req.json();

            return new Response(
                "OK"
            );
        }

        if (
            url.pathname === "/api"
        )
        {
            return Response.json(
                latest
            );
        }

        return new Response(
            "404",
            {status:404}
        );
    }
}