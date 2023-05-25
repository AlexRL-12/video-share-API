import app from "./app";
import { PORT } from "./config";

import "./config/mongoose";
app.listen(PORT);
console.log("Server on port: ", PORT);
