const express = require('express');
const http    = require('http');

const app     = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(require('path').join(__dirname, 'public')));
app.get('/',(req,res)=>{})

const server = http.createServer(app);
server.listen(3000,()=>console.log('Server on port', 3000));