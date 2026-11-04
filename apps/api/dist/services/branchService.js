"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBranch = exports.updateBranch = exports.createBranch = exports.getBranchById = exports.listBranches = void 0;
const seed_1 = require("../utils/seed");
const branches = [...seed_1.seedData.branches];
const listBranches = () => branches;
exports.listBranches = listBranches;
const getBranchById = (id) => branches.find((item) => item.id === id);
exports.getBranchById = getBranchById;
const createBranch = (input) => {
    const branch = {
        id: `branch-${Date.now()}`,
        salonId: input.salonId ?? 'salon-1',
        name: input.name,
        city: input.city,
        address: input.address,
        status: 'active',
    };
    branches.push(branch);
    return branch;
};
exports.createBranch = createBranch;
const updateBranch = (id, input) => {
    const index = branches.findIndex((item) => item.id === id);
    if (index === -1) {
        return null;
    }
    branches[index] = {
        ...branches[index],
        ...input,
    };
    return branches[index];
};
exports.updateBranch = updateBranch;
const deleteBranch = (id) => {
    const index = branches.findIndex((item) => item.id === id);
    if (index === -1) {
        return false;
    }
    branches.splice(index, 1);
    return true;
};
exports.deleteBranch = deleteBranch;
