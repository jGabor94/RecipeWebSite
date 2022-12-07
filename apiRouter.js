import express from "express";
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'
import  multer from 'multer'

const apiRouter = express.Router();
const app = express();

app.use(express.json());

function getClient(){
    
    const uri = "mongodb+srv://testUser:YoBFkIWy9aY64PXb@cluster0.hgbuxsu.mongodb.net/?retryWrites=true&w=majority";
    return new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/static/images/')
    },
    filename: function (req, file, cb) {
      cb(null, req.body.imageid) //Appending extension
    }
  })

const upload = multer({ storage: storage });


function getId(raw){

    try{
        return new ObjectId(raw)
    }
    catch(err){
        return ""
    }
}

apiRouter.get('/recipeList', (req, res) => {

    const client = getClient();

    client.connect(async (err) => {
        const collection = client.db("recipeSite").collection("recipes");
        const data = await collection.find().toArray();

        client.close();
        res.send(data)
    })

})




apiRouter.get("/recipe/:id", (req, res) => {


    const id = getId(req.params.id);

    const client = getClient();

    client.connect(async (err) => {

        const collection = await client.db("recipeSite").collection("recipes");
        const recipe = await collection.findOne({_id: id})

        res.send(recipe)

    })

})


apiRouter.post("/recipeAdd", upload.single('image'), (req, res) => {


    console.log(req.file)
    console.log(req.body)
    
    const client = getClient();

    client.connect(async (err) => {
        const collection = client.db("recipeSite").collection("recipes");
        const result = await collection.insertOne({...req.body, ingredients: JSON.parse(req.body.ingredients)})

        client.close();
        res.send(result)
    })

   
})

export default apiRouter
