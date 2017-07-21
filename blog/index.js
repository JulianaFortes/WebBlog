var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"), //Isto é para não deixar o user introduzir scripts ao escrever a informação
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();


// APP config    
mongoose.connect("mongodb://localhost/blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); //O sanitizer tem que vir depois do body-parser. Neste site não vou chegar a utilizar isto.
app.use(methodOverride("_method")); //Isto serve para pudermos fazer o PUT request para fazermos update de uma edição do formulário


// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,          //Aqui poderiamos colocar uma imagem default caso o utilizador nao coloque nenhuma
    body: String,
    created: {type: Date, default: Date.now}  //Cria a data que, caso nao seja definida pelo utilizador, será o momento do post por default
});

var Blog = mongoose.model("Blog", blogSchema);


//-----------RESTFUL ROUTES------------------------

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});  //aqui basta colocar index, sem o .ejs, porque no incio deste dec colocamos o app.set("view engine", "ejs");  
        }   //O "blogs" que passamos dentro do render acima é o blogs da function.
    });
   
});

//NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
    //create blog
    Blog.create(req.body.blog, function(err, newBlog){  //Aqui é req.body.blog porque no new.ejs, no form, pus o nome blog[...] por isso ele assume o title, image e body automaticamente
        if(err){
            res.render("new");
        }else{
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){  //A palavra inicial "Blog" é para o mongodb
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            err.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});      
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});


//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //Destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });

});






app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RINNUNG !!");
})