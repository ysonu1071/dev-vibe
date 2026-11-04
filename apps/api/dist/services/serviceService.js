"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.createService = exports.getServiceById = exports.listServices = void 0;
const seed_1 = require("../utils/seed");
const services = [...seed_1.seedData.services];
const listServices = () => services;
exports.listServices = listServices;
const getServiceById = (id) => services.find((item) => item.id === id);
exports.getServiceById = getServiceById;
const createService = (input) => {
    const item = {
        id: `svc-${Date.now()}`,
        name: input.name,
        duration: Number(input.duration),
        price: Number(input.price),
    };
    services.push(item);
    return item;
};
exports.createService = createService;
const updateService = (id, input) => {
    const index = services.findIndex((item) => item.id === id);
    if (index === -1) {
        return null;
    }
    services[index] = {
        ...services[index],
        ...input,
        duration: input.duration !== undefined ? Number(input.duration) : services[index].duration,
        price: input.price !== undefined ? Number(input.price) : services[index].price,
    };
    return services[index];
};
exports.updateService = updateService;
const deleteService = (id) => {
    const index = services.findIndex((item) => item.id === id);
    if (index === -1) {
        return false;
    }
    services.splice(index, 1);
    return true;
};
exports.deleteService = deleteService;
