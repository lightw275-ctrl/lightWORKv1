const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let score = 0;
const ADMIN_PASS = "work"; // <- tukaj nastavi geslo

// Root stran (info page)
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head><title>OBS Counter Service</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h1>✅ OBS Counter Service is running!</h1>
            <p>Overlay (for OBS): <a href="/overlay">/overlay</a></p>
            <p>Admin panel: <a href="/admin">/admin</a> (or /admin?pass=GESLO če imaš zaščito)</p>
        </body>
        </html>
    `);
});


// Serve static files
app.use(express.static('public'));

// Overlay za OBS (ni zaščiten, ker ga OBS potrebuje javno)
app.get('/overlay', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Admin panel (brez gesla - za test)
app.get('/admin', (req, res) => {
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
