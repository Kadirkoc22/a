const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dataFilePath = path.join(__dirname, 'data', 'spotifyUsers.json');

let spotifyUsers = [];
let id = 1;

function loadUsers() {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        
        if (err) {
            if (err.code === 'ENOENT') {
                spotifyUsers = [];
                id = 1;
            } else {
                console.error('Dosya okunurken hata oluştu:', err);
            }
            return;
        }
        try {
            const parsedData = JSON.parse(data);
            spotifyUsers = parsedData.users || [];
            id = parsedData.id || 1;
        } catch (parseError) {
            console.error('JSON çözümleme hatası:', parseError);
        }
    });
}

loadUsers();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());

// Hata yönetimi middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Hata oluştu!');
});

// Kullanıcıları getirme
app.get('/get-users', (req, res) => {
    res.json({ users: spotifyUsers });
});


const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port}/ adresinde çalışıyor.`);
});
