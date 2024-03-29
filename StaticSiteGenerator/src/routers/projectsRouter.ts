import express from "express";

export const projectRouter = express.Router();

projectRouter.get('/', async (req, res) => {
    // Body contains token and project name
    throw new Error("Not Implemented");
});

projectRouter.post('/', async (req, res) => {
    // Body contatins user token and project Name
    throw new Error("Not Implemented");
});

projectRouter.put('/', async (req, res) => {
    // Body contatins user token and project Name
    throw new Error("Not Implemented");
});

projectRouter.delete('/', async (req, res) => {
    // Body contatins user token and project Name
    throw new Error("Not Implemented");
});