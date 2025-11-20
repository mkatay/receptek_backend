import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cloudinary from './cloudinaryConfig.js'
//import ServerlessHttp from 'serverless-http'

dotenv.config()

const app=express()
app.use(cors())
app.use(express.json({limit:"5mb"}))

/*app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});*/


//feltöltés végpont:
app.post('/api/uploadImage', async (req,resp)=>{
    try {
        const {image}=req.body
        const uploadResponse=await cloudinary.uploader.upload(image,{folder:"recipes"})
        resp.json({
            serverMsg:"Image uploaded!",
            url:uploadResponse.secure_url,
            public_id:uploadResponse.public_id
        })
    } catch (error) {
        console.log(error);
        resp.status(500).json({serverMsg:"Upload failed!"})  
    }

})


//törlés végpont:
app.post('/api/deleteImage',async (req,resp)=>{
    try {
        const {public_id}=req.body
        console.log("public_id klins oldalról:",public_id);
        const deleteResult=await cloudinary.uploader.destroy(public_id)
        if(deleteResult.result=="ok") resp.json({serverMsg:"Image deleted successfully!"})
        else resp.status(404).json({serverMsg:"Image not found or already deleted!"})
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({serverMsg:"Failed to delete image!"})  
    }

})

const port=process.env.PORT|| 5000
app.listen(port,()=>console.log(`Server listening on port: ${port}`))
//export default ServerlessHttp(app)