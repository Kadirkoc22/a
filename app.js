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
app.post('/add-user', (req, res) => {
    const newUser = req.body;
    console.log('Yeni kullanıcı:', newUser);
    res.status(201).send('Kullanıcı başarıyla eklendi');
});

// Kullanıcı silme
app.delete('/delete-user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const initialLength = spotifyUsers.length;

    // Belirtilen ID'ye sahip kullanıcıyı filtrele
    spotifyUsers = spotifyUsers.filter(user => user.id !== userId);
     

    // Kullanıcı silinip silinmediğini kontrol et
    if (spotifyUsers.length < initialLength) {
        saveUsers(); // Kullanıcı silindi, verileri kaydet
        return res.status(200).json({ message: 'Kullanıcı başarıyla silindi.' });
    } else {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
});



function saveUsers() {
    const data = JSON.stringify({ users: spotifyUsers, id: id }, null, 2);
    fs.writeFile(dataFilePath, data, (err) => {
        if (err) {
            console.error('Veri kaydedilirken hata oluştu:', err);
        }
    });
}
const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port}/ adresinde çalışıyor.`);
});
