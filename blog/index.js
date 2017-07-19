var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();


// APP config    
mongoose.connect("mongodb://localhost/blog");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,          //Aqui poderiamos colocar uma imagem default caso o utilizador nao coloque nenhuma
    body: String,
    created: {type: Date, default: Date.now}  //Cria a data que, caso nao seja definida pelo utilizador, será o momento do post por default
});

var Blog = mongoose.model("Blog", blogSchema);


//RESTFUL ROUTES

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});  //aqui basta colocar index, sem o .ejs, porque no incio deste dec colocamos o app.set("view engine", "ejs");  
        }   //O "blogs" que passamos dentro do render acima é o blogs da function.
    });
   
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RINNUNG !!");
})