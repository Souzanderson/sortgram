const express = require('express');
const posts = require('./start.js')
const app = express();

app.get('/', function (req, res) {
    res.send('SortGram!');
});

app.get('/comments', async function (req, res) {
    if(req.query.post){
        let comm = await posts.start(req.query.post)
        res.send(comm)
    }
    else{
        res.send({"error":"Nenhum post selecionado!"})
    }
});

var porta = process.env.PORT || 8080;
app.listen(porta);