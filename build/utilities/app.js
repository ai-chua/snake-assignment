import cors from 'cors';
import express, { urlencoded } from 'express';
import { json } from 'body-parser';
export var appFactory = function () {
    var app = express();
    app.use(cors());
    app.options('*', cors());
    app.use(urlencoded({ extended: true }));
    app.use(json());
    return app;
};
