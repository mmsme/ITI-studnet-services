let express = require("express");
(morgan = require("morgan")),
  (StudentRouter = require("./Routers/StudentsRouter")),
  (DepartmentRouter = require("./Routers/DepartmentsRouter")),
  (path = require("path")),
  (bodyParser = require("body-parser")),
  (express_session = require("express-session")),
  (connect_flash = require("connect-flash")),
  (cookie_parser = require("cookie-parser")),
  (mongoose = require("mongoose"));
const CourseRouter = require("./Routers/CoursesRouter");

// express_ejs_layouts=require("express-ejs-layouts");
mongoose.connect(
  "mongodb://localhost:27017/itiDB",
  { useFindAndModify: false },
  { useNewUrlParser: true },
  { useUnifiedTopology: true }
);
//open server
let server = express();

server.use(express.json());

/********************* Routings */
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));
server.use(express.static(path.join(__dirname, "publics")));
// server.use(bodyParser.urlencoded());

server.use(bodyParser.json());

server.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  next();
});

server.use(/\//, (request, response) => {
  // response.send("HOME");
  // response.sendFile(path.join(__dirname,"views","home.html"));
  response.render("home");
});

server.use("/Students", StudentRouter);
server.use("/Departments", DepartmentRouter);
server.use("/Courses", CourseRouter);
server.use((request, response) => {
  response.send("Not Found");
});

server.use((err, req, res, next) => {
  // Map the error and send it to user
  // instanceof
  // Check if this err is a mongoose err using instanceof

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(422).json(err.errors);
  }
  if (err.code === 11000) {
    res
      .status(422)
      .json({ statusCode: "ValidationError", property: err.keyValue });
  }
  if (err.message === "UN_AUTHENTICATED") {
    res.status(401).json({ statusCode: "UN_AUTHENTICATED" });
  }
  res.status(503).end();
});

server.listen(5600, () => {
  console.log("I am Listening ......");
});
