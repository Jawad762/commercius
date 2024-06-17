"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastify = void 0;
const fastify_1 = __importDefault(require("fastify"));
const postgres_1 = __importDefault(require("@fastify/postgres"));
const fs_1 = __importDefault(require("fs"));
const products_js_1 = __importDefault(require("./routes/products.js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.fastify = (0, fastify_1.default)({ logger: true });
exports.fastify.register(postgres_1.default, {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true,
        ca: fs_1.default.readFileSync('./src/ca.pem').toString()
    }
});
exports.fastify.register(products_js_1.default);
exports.fastify.listen({ port: 8000 }, (err, address) => {
    if (err) {
        exports.fastify.log.error(err);
        process.exit(1);
    }
    else
        console.log('Server listening on port 8000');
});
