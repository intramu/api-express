import express from 'express'
import admin from './routes/admin'

const app = express();

app.use(express.json())

app.use('/api/admin', admin)

app.listen(8080, () =>{
    console.log(`App listening on port 8080`);
})