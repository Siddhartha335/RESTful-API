import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import ejs from "ejs"

const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static("public"))

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB")

const articleSchema = new mongoose.Schema({
    title:String,
    content:String
})

const Article = mongoose.model("article",articleSchema)

// const article = new Article ({
//     title:"Express",
//     content:"Express is framework of JS used in backend"
// })

app.route("/articles")
    .get((req,res)=> {
        Article.find({}).
        then((resp)=> {res.send(resp)}).
        catch((err)=> {res.send(err)})
    })
    .post((req,res)=> {
        const article = new Article ({
            title:req.body.title,
            content:req.body.content
        })
        article.save().
        then(()=> {res.send("Success")}).
        catch((err)=> {res.send(err + "occured!")})
    })
    .delete((req,res)=> {
        Article.deleteMany({}).
        then(()=> {res.send("Succesfully deleted!")}).
        catch((err)=> {res.send(err)})
    })

    // For specific articles
    app.route("/articles/:articleTitle")
    .get((req,res)=> {
        Article.findOne({title:req.params.articleTitle})
        .then((result)=> {res.send(result)})
        .catch((err)=> {res.send(err)})
    })
    .put((req,res)=> {
        Article.findOneAndUpdate({title:req.params.articleTitle},{title:req.body.title,content:req.body.content},{upsert:true,setDefaultsOnInsert: true})
        .then(()=> {res.send("Updated succesfully")})
        .catch((err)=> {res.send(err)})
    })
    .delete((req,res)=> {
        Article.deleteOne({title:req.params.articleTitle}).
        then(()=> {res.send("Succesfully deleted!")}).
        catch((err)=> {res.send(err)})
        
    })
    

// app.get("/articles",(req,res)=> {
//     Article.find({}).
//     then((resp)=> {res.send(resp)}).
//     catch((err)=> {res.send(err)})
// })

// app.post("/articles",(req,res)=> {
//     const article = new Article ({
//         title:req.body.title,
//         content:req.body.content
//     })
//     article.save().
//     then(()=> {res.send("Success")}).
//     catch((err)=> {res.send(err + "occured!")})
// })

// app.delete("/articles",(req,res)=> {
//     Article.deleteMany({}).
//     then(()=> {res.send("Succesfully deleted!")}).
//     catch((err)=> {res.send(err)})
// })

app.listen(5000,()=> {
    console.log("Server started on port 5000")
})