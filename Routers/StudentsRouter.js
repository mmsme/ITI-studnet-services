let express=require("express"),

StudentRouter=express.Router(),

path=require("path"),
mongoose=require("mongoose"),

fs=require("fs");

StudentRouter.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

multer=require("multer");
multerMW=multer({
    dest:path.join(__dirname,"..","publics","images")
});

    require("../Models/StudentModel");
    require("../Models/DepartmentModel");
        let studentSchema=mongoose.model("Students");
        let departmentSchema=mongoose.model("Departments");

StudentRouter.get("/list",(request,response)=>{
    
    studentSchema.find({},(error,result)=>{
       console.log(result+"*******************")
       // response.render("students/studentslist",{speakers:result});
       response.send(result);
    });
        
    // });//list
   
    
    // response.send("LIST");
})
StudentRouter.get("/add",(request,response)=>{
    
    departmentSchema.find({},(error,result1)=>{
       console.log(result1);
       if(!error)
       response.render("students/addstudent",{depts:result1});

    });
    // response.render("students/addstudent");
})
StudentRouter.post("/add",(request,response)=>{
   console.log("request");
   console.log(request.body)
 
    let student=new studentSchema({
        _id:request.body._id,
        Name:request.body.Name,
        Email:request.body.Email,
        Department:request.body.Department
    });

    student.save((err)=>{


        if(!err)
        {
            studentSchema.findOne({_id:request.body._id},(error,result)=>{

                if(!error)
                response.send(result)
                else
                response.send(error)
                })
            // response.send("DONE")
            //response.redirect("/students/list");
        }
        else
        {
           response.send(err);
        }
    })

})
StudentRouter.get("/details/:id",(request,response)=>{

    studentSchema.findOne({_id:request.params.id},(error,result)=>{

        if(!error)
            response.send(result)
        else
            response.send(error);
        // departmentSchema.find({},(error,result2)=>{
        //     response.send(result2);
        //     //response.render("students/editStudent",{student:result,depts:result2})
        // })
       

    });
})
StudentRouter.post("/edit/:id",(request,response)=>{
  

    studentSchema.update({_id:request.params.id},{
        "$set":{
            Name:request.body.Name,
            Department:request.body.Department,
            Email:request.body.Email
        }
    },(error)=>{
        if(!error)
        {
            studentSchema.findOne({_id:request.params.id},(err,result)=>{
                if(!err)
                response.send(result)
                else
                response.send(err);
            })
            // response.redirect("/students/list");
        }
        else
        {
            response.send(error)
        }
    })


})
StudentRouter.get("/delete/:id",(request,response)=>{
    studentSchema.deleteOne({_id:request.params.id},(error)=>{
        if(!error)
        response.send({data:"deleted"})
        else
        response.send(error);
        // response.redirect("/students/list");
    })
});


module.exports=StudentRouter;