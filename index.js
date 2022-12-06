const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const objectId = require('mongodb').ObjectId;
const cors = require('cors');
const multer = require('multer');
const { json } = require('body-parser');

function getClient(){
    const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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


app.use(bodyParser.json());
function getId(raw){

    try{
        return new objectId(raw)
    }
    catch(err){
        return ""
    }
}
app.use(cors())
app.use(express.static("public"))


app.get('/', (req, res) => {

   
        res.sendFile(__dirname +'/index.html')
   

})



app.get('/recipes', (req, res) => {

    const client = getClient();

    client.connect(async (err) => {
        const collection = client.db("recipeSite").collection("recipes");
        const data = await collection.find().toArray();

        client.close();
        res.send(data)
    })

})


app.get("/recipe/:id", (req, res) => {


    const id = getId(req.params.id);

    const client = getClient();

    client.connect(async (err) => {

        const collection = await client.db("recipeSite").collection("recipes");
        const recipe = await collection.findOne({_id: id})

        res.send(recipe)

    })

})


app.post("/add", upload.single('image'), (req, res) => {


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


app.listen(6060)