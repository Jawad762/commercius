"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const products_js_1 = require("../controllers/products.js");
const routes = async (fastify, _options) => {
    fastify.get('/products', products_js_1.getProducts);
};
exports.default = routes;
