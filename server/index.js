const express = require('express')
const app= express()

app.get('/', (req,res)=>{
res.send({hi:"there"})
})

const PORT = process.env.PORT || 5000
app.listen(PORT)

// http://localhost:5000/

// process.env.PORT - when we run our application on production otherwise in development mode we use by default 5000