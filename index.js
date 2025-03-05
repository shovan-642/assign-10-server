const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@assignment-10.9gvo9.mongodb.net/?retryWrites=true&w=majority&appName=assignment-10`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    const movieCollection = client.db('movieDB').collection('movies')
    const favoriteMovieCollection = client.db('movieDB').collection('favoriteMovie')

    app.get('/movies', async(req, res)=>{
        const allMovies = movieCollection.find();
        const result = await allMovies.toArray();
        res.send(result)

    })
    app.get('/favoriteMovies', async(req, res)=>{
        const allFavoriteMovies = favoriteMovieCollection.find();
        const result = await allFavoriteMovies.toArray();
        res.send(result)

    })

    app.get('/movies/:id', async(req,res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result =  await movieCollection.findOne(query)
        res.send(result)

    } )

    app.post('/movies', async (req, res)=>{
        const newMovie = req.body
        const result = await movieCollection.insertOne(newMovie)
        res.send(result)
    })

    app.post('/favoriteMovies', async (req, res)=>{
      const newFavoriteMovie = req.body
      console.log(newFavoriteMovie)
      const result = await favoriteMovieCollection.insertOne(newFavoriteMovie)
      res.send(result)
  })

    app.put('/movies/:id', async(req, res)=>{
        const id = req.params.id
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true}
        const updatedMovie = req.body
        const movie = {
            $set: {
                movie_poster: updatedMovie.movie_poster,
                 movie_title: updatedMovie.movie_title, 
                 genre: updatedMovie.genre,
                  duration: updatedMovie.duration,
                   release_year: updatedMovie.release_year,
                    rating: updatedMovie.rating,
                     summary: updatedMovie.summary
            }
        }
        const result =  await movieCollection.updateOne(filter, movie, options )
        res.send(result)

    })

    app.delete('/movies/:id', async(req,res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await movieCollection.deleteOne(query)
        res.send(result)
    })


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req, res)=>{
    res.send('simple crud is running')
})


app.listen(port, ()=>{
    console.log(`running port ${port}`)
})