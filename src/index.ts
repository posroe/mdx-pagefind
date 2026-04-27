#!/usr/bin/env node

import path from "node:path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { build } from "./build.js";

const argv = await yargs(hideBin(process.argv))
    .option("source", {
        type: "string",
        alias: "s",
        default: "src/contents"
    })
    .option("public", {
        type: "string",
        alias: "p",
        default: "public"
    })
    .parse();

build(path.resolve(argv.source), path.resolve(argv.public))
    .then(() => console.log("Build complete."))
    .catch(e => { console.error(e); process.exit(1); });