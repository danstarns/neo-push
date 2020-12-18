import express from "express";
import * as config from "../config";
import * as path from "path";
import createDebug from "./debug";
import * as graphql from "./graphql";

export const app = express();
graphql.server.applyMiddleware({ app });

const debug = createDebug("HTTP");

if (config.NODE_ENV === "production") {
    debug("Production serving statics");

    app.use("/", express.static(path.join(__dirname, "../../web-dist")));

    app.use("/index.html", (_req, res) => {
        res.sendFile(path.join(__dirname, "../../web-dist/index.html"));
    });
}

export function start(): Promise<void> {
    debug("Starting on PORT " + config.HTTP_PORT);

    return new Promise((resolve, reject) => {
        try {
            app.listen(config.HTTP_PORT, () => {
                debug("Started");

                return resolve();
            });
        } catch (error) {
            return reject(error);
        }
    });
};

