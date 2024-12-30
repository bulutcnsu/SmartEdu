const express = require('express');


const app = express();

const port = 3000;

app.get('/temp/dashboard.html', function (req, res) {
    res.send('hello world')
  })

app.listen(3000, ()=> {
    console.log("App  started on port:", port)
})