const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let score = 0;
const ADMIN_PASS = "work"; // <- tukaj nastavi geslo

// Serve static files
app.use(express.static('public'));

// Overlay za OBS (ni zaščiten, ker ga OBS potrebuje javno)
app.get('/overlay', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Admin panel (zaščiten z geslom)
app.get('/admin', (req, res) => {
    const pass = req.query.pass;
    if (pass !== ADMIN_PASS) {
        return res.status(401).send('Unauthorized');
    }
    res.sendFile(__dirname + '/public/admin.html');
});

// Socket.IO
io.on('connection', (socket) => {
    socket.emit('update', score);

    socket.on('changeScore', (delta) => {
        score += delta;
        io.emit('update', score);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
