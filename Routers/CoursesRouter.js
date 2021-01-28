const express = require("express");
const CourseRouter = express.Router();
const courseModel = require("../Models/CourseModel");
require("../Models/CourseModel");
const studentModel = mongoose.model("Students");

// show List Of courses
CourseRouter.get("/list", async (request, response) => {
  try {
    const courses = await courseModel.find({}).populate("list.id").exec();
    response.json(courses);
  } catch (error) {
    throw error;
  }
});

// Add New Course Route
CourseRouter.post("/add", async (request, response) => {
  const course = {
    _id: request.body._id,
    Name: request.body.Name,
    Instructor: request.body.Instructor,
    list: [],
  };

  try {
    const res = await courseModel.create(course);
    response.json(res);
  } catch (error) {
    response.send(error);
  }
});

// get Course By id
CourseRouter.get("/details/:id", async (request, response) => {
  try {
    const course = await courseModel
      .findById(request.params.id)
      .populated("list.id")
      .exec();
    if (!course) {
      response.send("Course Not Founded");
      return;
    }
    response.json(course);
  } catch (error) {
    response.send(error);
  }
});

// Update course
CourseRouter.patch("/edit/:id", async (request, response) => {
  try {
    const res = await courseModel
      .findOneAndUpdate(request.params.id, request.body, { new: true })
      .exec();
    response.json(res);
  } catch (error) {
    response.send(error);
    return;
  }
});

// delete Course
CourseRouter.delete("/delete/:id", async (request, response) => {
  try {
    const res = await courseModel.findOneAndDelete(request.params.id).exec();
    response.json(res);
  } catch (error) {
    response.send(error);
  }
});

// add student to course
CourseRouter.post("/addStudent/:id", async (request, response) => {
  const courseID = request.params.id;
  try {
    const student = await studentModel.findById(request.body.id).exec();
    if (!student) {
      response.send("Student Not Founded");
    }

    // first get the course
    const course = await courseModel.findById(courseID).exec();
    console.log(course);
    // search if student already exist
    const index = course.list.findIndex((std) => {
      return std.id == student._id;
    });

    // Add student in course
    if (index == -1) {
      course.list.push({ id: student._id, grade: request.body.grade });
      const res = await courseModel
        .findByIdAndUpdate(courseID, course, { new: true })
        .exec();
      response.json(res);
      return;
    }

    response.send("Alerady Exist");
  } catch (error) {
    response.send(error);
  }
});

CourseRouter.post("/removeStudent/:id", async (request, response) => {
  const courseID = request.params.id;

  try {
    const student = await studentModel.findById(request.body.id).exec();
    if (!student) {
      response.send("Student Not Founded");
    }

    // first get the course
    const course = await courseModel.findById(courseID).exec();
    console.log(course);

    // search if student already exist
    const index = course.list.findIndex((std) => {
      return std.id == student._id;
    });

    // Add student in course
    if (index != -1) {
      course.list.splice(index, 1);
      const res = await courseModel
        .findByIdAndUpdate(courseID, course, { new: true })
        .exec();
      response.json(res);
      return;
    }

    response.send("Alerady Not Exist");
  } catch (error) {
    response.send(error);
  }
});

module.exports = CourseRouter;
