"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
const index_js_1 = require("../index.js");
const getProducts = async (request, reply) => {
    try {
        const [data] = await index_js_1.fastify.pg.query('SELECT * FROM products');
        reply.code(200).send(data.rows);
    }
    catch (error) {
        console.error(error);
        reply.code(500).send(error);
    }
};
exports.getProducts = getProducts;
