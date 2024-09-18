"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_router_1 = require("./routers/user.router");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/users", user_router_1.userRouter);
// app.put(
//   "/users/:userId",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userId = Number(req.params.userId);
//       const { name, email, password } = req.body;
//
//       if (!name || name.length < 3) {
//         throw new ApiError(
//           "Name is required and should be at least 3 characters long",
//           400,
//         );
//       }
//       if (!email || !email.includes("@")) {
//         throw new ApiError("Email is required and should be valid", 400);
//       }
//       if (!password || password.length < 6) {
//         throw new ApiError(
//           "Password is required and should be at least 6 characters long",
//           400,
//         );
//       }
//       const users = await read();
//
//       const userIndex = users.findIndex((user) => user.id === userId);
//       if (userIndex === -1) {
//         throw new ApiError("User not found", 404);
//       }
//
//       users[userIndex].name = name;
//       users[userIndex].email = email;
//       users[userIndex].password = password;
//
//       await write(users);
//       res.status(201).send(users[userIndex]);
//     } catch (e) {
//       next(e);
//     }
//   },
// );
//
// app.delete(
//   "/users/:userId",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userId = Number(req.params.userId);
//       const users = await read();
//
//       const userIndex = users.findIndex((user) => user.id === userId);
//       if (userIndex === -1) {
//         throw new ApiError("User not found", 404);
//       }
//       users.splice(userIndex, 1);
//
//       await write(users);
//       res.sendStatus(204);
//     } catch (e) {
//       next(e);
//     }
//   },
// );
app.use("*", function (error, req, res, next) {
    res.status(error.status || 500).send(error.message);
});
process.on("uncaughtException", function (error) {
    console.error("uncaughtException", error.message, error.stack);
    process.exit(1);
});
app.listen(3000, function () {
    console.log("Server is running on http://localhost:3000");
});