const express    = require("express"),
app              = express(),
mongoose         = require("mongoose"),
expressSanitizer = require("express-sanitizer"),
override         = require("method-override"),
bp               = require("body-parser"),
animeblog        = require("./models/animeblog"),
comments         = require("./models/comments");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bp.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(override("_method"));

const connectionURL = "mongodb+srv://noah:theworldsbestpencil1@yelpcamp-db-isvf0.mongodb.net/blog?retryWrites=true&w=majority";

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  mongoose.connection.on('connected', () => {
    console.log("server connected to db");
  });

// ================================= Begin RESTFUL routes ==================================

//index
app.get("/", (request, response) => {
    response.redirect("/animeblog");
});
app.get("/animeblog", (request, response) => {
    animeblog.countDocuments({}, function(error, result){
        if(error){
            console.log(error);
        } else if(result === 0){
            response.render("noposts"); //when no posts are present in DB
        } else if(result === 1) {
            animeblog.find({}, function(error, blogs){ //sorts by date/time created
                if(error){
                    response.send(error);
                    console.log(error);
                }else {
                    console.log(blogs)
                    response.render("index0", {blogs, blogs}); //when objects returned index is 0
                }
            });
        } else {
            animeblog.find().sort({created: -1}).exec(function(error, blogs){ //sorts by date/time created && 2 or more posts are present
                if(error){
                    response.send(error);
                    console.log(error);
                }else {
                    console.log(blogs)
                    response.render("index", {blogs, blogs});
                }
            });
        };
    });
});
//new
app.get("/animeblog/new", (request, response) => {
    response.render("form");
});
//create
app.post("/animeblog", (request, response) => {
    request.body.blog.body = request.sanitize(request.body.blog.body) //sanitize input
    animeblog.create(request.body.blog, (error, newblog) => {
        if(error){
            console.render("form")
        }else{
            console.log("success")
            response.redirect("/animeblog");
        };
    })
    
});
//show
app.get("/animeblog/:id", (request, response) => {
    animeblog.findById(request.params.id).populate("comments").exec(function(error, blog) {
        if(error) {
            console.log(error)
        } else {
            response.render("readmore", {blog: blog});
        }
    });                   


});
//edit
app.get("/animeblog/:id/edit", (request, response) => {
    animeblog.findById(request.params.id, function(error, editPost){
    if(error){
        response.redirect("/animeblog");
    } else {
        response.render("edit", {blog: editPost});
    }
});
});
//update
app.put("/animeblog/:id", (request, response) => {
request.body.blog.body = request.sanitize(request.body.blog.body)  //sanitize input
    animeblog.findByIdAndUpdate(request.params.id, request.body.blog, function(error, updated){
    if(error){
        response.send(error);
    } else {
        response.redirect("/animeblog/" + request.params.id);
    }
    });

});
//delete
app.delete("/animeblog/:id", (request, response) => {
    animeblog.findByIdAndDelete(request.params.id, request.body.blog, function(error, deleted){
    if(error){
        console.log(error);
    } else {
        console.log("post deleted");
        response.redirect("/");
    }
})
});

//========================= Comments Section =====================================
app.get("/animeblog/:id/comments/new", (request, response) => {
    animeblog.findById(request.params.id, (error, comment) => {
        if(error){
            console.log(error)
        } else {
            response.render("comments/new", {comment: comment});
        }
        
    });
});

app.post("/animeblog/:id/comments", (request, response) => {
    request.body.comment.body = request.sanitize(request.body.comment.body);
    animeblog.findById(request.params.id, (error, foundPost) => {
        if(error){
            console.log(error);
        } else {
            comments.create(request.body.comment, (error, comment) => {
                if(error){
                    console.log(error);
                } else {
                    foundPost.comments.push(comment);
                    foundPost.save(function(error, comment) {
                        if(error) {
                            console.log(error)
                        } else {
                            console.log("comment success");
                        }; 
                    });
                    response.redirect("/animeblog/" + foundPost._id);
                }
            });
        }
    })
});

app.delete("/animeblog/:id/comments", (request, response) => {
    response.send("delete");
});


app.listen(3000, () => {
    console.log("listening on port 3000")
});

//TETSING GIT STATUS
