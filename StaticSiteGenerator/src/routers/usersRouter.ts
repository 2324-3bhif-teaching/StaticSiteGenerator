import express from "express";

export const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    // Body contains name and password, we return token
    throw new Error("Not Implemented");
});


userRouter.post('/', async (req, res) => {
    // Body contains name and password
    throw new Error("Not Implemented");
});

userRouter.patch('/pass', async (req, res) => {
    // Body contains name and new Password
    throw new Error("Not Implemented");
});

userRouter.patch('/name', async (req, res) => {
    // Body contains name and new Name
    throw new Error("Not Implemented");
});

userRouter.delete('/:name', async (req, res) => {
    throw new Error("Not Implemented");
});