let express = require("express"),
  DepartmentRouter = express.Router(),
  path = require("path"),
  mongoose = require("mongoose");

DepartmentRouter.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

require("../Models/DepartmentModel");
require("../Models/StudentModel");

let departmentSchema = mongoose.model("Departments");
let studentSchema = mongoose.model("Students");

DepartmentRouter.get("/add", (request, response) => {
  departmentSchema.find({}, (error, result) => {
    response.render("departments/adddepertment");
    //response.send(result);
  });
});
DepartmentRouter.get("/edit/:id", (request, response) => {
  departmentSchema.findOne({ _id: request.params.id }, (error, result) => {
    response.render("departments/editDepartment", { dept: result });
  });
});

DepartmentRouter.get("/delete/:id", (request, response) => {
  departmentSchema.deleteOne({ _id: request.params.id }, (error) => {
    if (!error) response.send({ data: "deleted" });
    else response.send(error);
    // response.redirect("/departments/list");
  });
});

// DepartmentRouter.post("/edit/:id", (request, response) => {
//   departmentSchema.update(
//     { _id: request.params.id },
//     {
//       $set: {
//         Name: request.body.Name,
//       },
//     },
//     (error) => {
//       if (!error) {
//         departmentSchema.findOne({ _id: request.params.id }, (err, result) => {
//           if (!err) response.send(result);
//           else response.send(err);
//         });
//         // response.redirect("/departments/list");
//       } else {
//         response.send(error);
//       }
//     }
//   );
// });
DepartmentRouter.post("/add", (request, response) => {
  let dept = new departmentSchema(request.body);

  dept.save((err) => {
    if (!err) {
      departmentSchema.findOne({ _id: request.body._id }, (error, result) => {
        if (!error) response.send(result);
        else response.send(error);
      });
      // response.send("DONE")
      //response.redirect("/students/list");
    } else {
      response.send(err);
    }
  });
});
DepartmentRouter.get("/list", (request, response) => {
  // eventSchema.find({},(error,result)=>{
  //     response.render("events/eventslist",{events:result});

  departmentSchema
    .find({}, (error, result) => {
      response.send(result);
      //response.render("Departments/departmentList",{depts:result});
    })
    .populate("Departments")
    .exec();
});

DepartmentRouter.get("/details/:id", (request, response) => {
  departmentSchema.findOne({ _id: request.params.id }, (error, result) => {
    if (!error) response.send(result);
    else response.send(error);
    // departmentSchema.find({},(error,result2)=>{
    //     response.send(result2);
    //     //response.render("students/editStudent",{student:result,depts:result2})
    // })
  });
});

DepartmentRouter.post("/edit/:id", (request, response) => {
  try {
    const res = departmentSchema
      .findByIdAndUpdate(request.params.id, request.body, { new: true })
      .exec();

    response.send(res);
  } catch (e) {
    throw Error(e);
  }
});

// get Department by id
DepartmentRouter.get("/details/:id", async (request, response) => {
  try {
    const department = await departmentSchema
      .findById(request.params.id)
      .exec();

    if (!department) {
      response.send("Department Not Founded");
      return;
    }

    response.json(department);
  } catch (error) {
    response.send(error);
  }
});

module.exports = DepartmentRouter;
