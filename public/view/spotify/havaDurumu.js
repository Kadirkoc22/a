const arama = document.getElementById('arama');
const sehirİsim = document.getElementById('sehirİsim');
const sicaklik = document.getElementById('sicaklik');
const condition = document.getElementById('condition');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const digerGunler = document.getElementById('digerGunler');
const searchButton = document.getElementById('search');
const userTable = document.getElementById('userTable');
const editForm = document.getElementById('editForm');
const updateUserForm = document.getElementById('updateUserForm');
const userIdInput = document.getElementById('userId');
const userNameInput = document.getElementById('userName');
const userPasswordInput = document.getElementById('userPassword');
const userCityInput = document.getElementById('userCity');
const rowIndexInput = document.getElementById('rowIndex');
const tablinks = document.getElementsByClassName('tablinks');
const konumButton = document.getElementById('konum');
const locationInfo = document.getElementById('locationInfo');


// API ve URL tanımları
const api = 'dc3fec87a21040aca3671922241109';
const url = 'https://api.weatherapi.com/v1/forecast.json';
const usersUrl = '/data/spotifyUsers.json';
const deleteUserUrl = 'http://localhost:3000/delete-user/';
const updateUserUrl = 'http://localhost:3000/update-user/';

// Sayfa yüklendiğinde hava durumu tabını aç ve varsayılan şehir verilerini yükle
window.onload = function () {
    document.querySelector('.tablinks').click(); // sayfa yüklenince hava durumu sekmesini aç
    fetchWeatherData('istanbul'); // Sayfa yüklendiğinde varsayılan olarak İstanbul verisini çekme
};

// Hava durumu verilerini çekme
async function fetchWeatherData(city) {
    try {
        const response = await fetch(`${url}?key=${api}&q=${city}&days=5`);
        if (!response.ok) throw new Error('Şehir bulunamadı');
        const data = await response.json();
      
        

        sehirİsim.textContent = `${data.location.name}`;
        sicaklik.textContent = `Temp: ${data.current.temp_c}°C`;
        condition.src = data.current.condition.icon.startsWith('//') ? 'https:' + data.current.condition.icon : data.current.condition.icon;
        humidity.textContent = `Humidity: ${data.current.humidity}%`;
        wind.textContent = `Wind: ${data.current.wind_kph} km/h`;
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('bugun');


        digerGunler.innerHTML = '';
        data.forecast.forecastday.slice(1).forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('forecastt');
            let backgroundImage;
            switch (day.day.condition.text.toLowerCase()) {
                case 'sunny':
                    backgroundImage = 'url(/public/assets/sea.jpg)';
                    break;
                case 'partly cloudy ':
                    backgroundImage = 'url(/public/assets/sky.jpg)';
                    break;
                case 'moderate rain':
                    backgroundImage = 'url(/public/assets/lightning6.jpg)';
                    break;
                case 'patchy rain nearby':
                    backgroundImage = 'url(/public/assets/yer.jpg)';
                    break;
                case 'snow':
                    backgroundImage = 'url(/public/assets/winter.jpg)';
                    break;
                default:
                    backgroundImage = 'url(/public/assets/seea.jpg)';
            }
            dayDiv.style.backgroundImage = backgroundImage;
            dayDiv.style.backgroundSize = 'cover';
            dayDiv.style.color = 'white';
            dayDiv.style.borderRadius = '20px';

            dayDiv.innerHTML = `
                <h4>${new Date(day.date).toLocaleDateString()}</h4>
                <img src="${day.day.condition.icon.startsWith('//') ? 'https:' + day.day.condition.icon : day.day.condition.icon}" alt="${day.day.condition.text}" />
                <p>${day.day.condition.text}°C</p>
                <p>Temp: ${day.day.avgtemp_c}°C</p>
                <p>Humidity: ${day.day.avghumidity}%</p>
                <p>Wind: ${day.day.maxwind_kph} km/h</p>
            `;

            digerGunler.appendChild(dayDiv);
        });
    } catch (error) {
        sehirİsim.textContent = 'Hata: Şehir bulunamadı';
        sicaklik.textContent = '';
        condition.src = '';
        humidity.textContent = '';
        wind.textContent = '';
        digerGunler.innerHTML = '';
    }
}

// Arama butonuna tıklama
searchButton.addEventListener('click', () => {
    const city = arama.value;
    fetchWeatherData(city);

});

// Kullanıcı konumunu al
konumButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            locationInfo.textContent = `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`;
            // Konumu kullanarak hava durumu verilerini al
            const response = await fetch(`${url}?key=${api}&q=${latitude},${longitude}&days=5`);
            if (!response.ok) {
                locationInfo.textContent = 'Hava durumu alınamadı.';
                return;
            }
            const data = await response.json();
            sehirİsim.textContent = `${data.location.name}`;

            sicaklik.textContent = `Temp: ${data.current.temp_c}°C`;
            condition.src = data.current.condition.icon.startsWith('//') ? 'https:' + data.current.condition.icon : data.current.condition.icon;
            humidity.textContent = `Humidity: ${data.current.humidity}%`;
            wind.textContent = `Wind: ${data.current.wind_kph} km/h`;

            digerGunler.innerHTML = '';
            data.forecast.forecastday.slice(1).forEach(day => {
                
                const dayDiv = document.createElement('div');
            dayDiv.classList.add('forecastt');
            let backgroundImage;
            console.log("day ", day)
            switch (day.day.condition.text.toLowerCase()) {
                case 'sunny':
                    backgroundImage = 'url(/public/assets/sea.jpg)';
                    break;
                case 'partly cloudy ':
                    backgroundImage = 'url(/public/assets/sky.jpg)';
                    break;
                case 'moderate rain':
                    backgroundImage = 'url(/public/assets/lightning6.jpg)';
                    break;
                case 'patchy rain nearby':
                    backgroundImage = 'url(/public/assets/yer.jpg)';
                    break;
                case 'snow':
                    backgroundImage = 'url(/public/assets/winter.jpg)';
                    break;
                default:
                    backgroundImage = 'url(/public/assets/seea.jpg)';
            }
            dayDiv.style.backgroundImage = backgroundImage;
            dayDiv.style.backgroundSize = 'cover';
            dayDiv.style.color = 'white';
            dayDiv.style.borderRadius = '20px';
                dayDiv.innerHTML = `
                    <h4>${new Date(day.date).toLocaleDateString()}</h4>
                    <img src="${day.day.condition.icon.startsWith('//') ? 'https:' + day.day.condition.icon : day.day.condition.icon}" alt="${day.day.condition.text}" />
                    <p>${day.day.condition.text}</p>
                    <p>Temp: ${day.day.avgtemp_c}°C</p>
                    <p>Humidity: ${day.day.avghumidity}%</p>
                    <p>Wind: ${day.day.maxwind_kph} km/h</p>
                `;
                digerGunler.appendChild(dayDiv);
            });
        }, (error) => {
            console.error('Konum alınamadı:', error);
            locationInfo.textContent = 'Konum alınamadı.';
        });
    } else {
        locationInfo.textContent = 'Geolocation desteklenmiyor.';
    }
});

// Kullanıcı listelerini yüklemek
async function loadUserList() {
    try {
        const response = await fetch(usersUrl);
        if (!response.ok) throw new Error('Kullanıcı listesi bulunamadı');

        const data = await response.json();
        const spotifyUsers = data.users;

        const tbody = userTable.querySelector('tbody');
        tbody.innerHTML = '';

        spotifyUsers.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.password}</td>
                <td>${user.city}</td>
                <td>
                    <button class="updatebtn" data-id="${user.id}" data-index="${index}"style="border-radius:5px;background-color:rgb(74, 115, 248);color:#fff;"><strong>Edit</strong></button>
                    <button class="deletebtn" data-id="${user.id}" style="border-radius:5px;background-color:rgb(106, 117, 126);color:#fff;"><strong>Delete</strong></button>
                </td>
            `;
            tbody.appendChild(row);
        });

        document.querySelectorAll('.deletebtn').forEach(button => {
            button.addEventListener('click', function () {
                const userId = this.getAttribute('data-id');
                deleteUser(userId);
            });
        });

        document.querySelectorAll('.updatebtn').forEach(button => {
            button.addEventListener('click', function () {
                const userId = this.getAttribute('data-id');
                const index = this.getAttribute('data-index');
                openEditForm(userId, index);
            });
        });

    } catch (error) {
        const tbody = userTable.querySelector('tbody');
        tbody.innerHTML = `<tr><td colspan="5">Kullanıcı listesi yüklenemedi: ${error.message}</td></tr>`;
    }
}

// Kullanıcıyı silme fonksiyonu
async function deleteUser(userId) {
    try {
        const url = `${deleteUserUrl}${userId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Kullanıcı silinemedi');

        alert('Kullanıcı başarıyla silindi');
        loadUserList(); // Kullanıcı silindikten sonra listeyi yeniden yüklemek için
    } catch (error) {
        console.error('Hata:', error);
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
}

// Kullanıcıyı güncelleme fonksiyonu
async function updateUser(user) {
    try {
        const response = await fetch(updateUserUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) throw new Error('Kullanıcı güncellenemedi');

        alert('Kullanıcı başarıyla güncellendi');
        closeEditForm(); // Formu kapat
        loadUserList(); // Listeyi güncelle
    } catch (error) {
        console.error('Hata:', error);
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
}

// Güncelleme formunu açma
function openEditForm(userId, index) {
    fetch(usersUrl)
        .then(response => response.json())
        .then(data => {
            const user = data.users[index];
            userIdInput.value = user.id;
            userNameInput.value = user.name;
            userPasswordInput.value = user.password;
            userCityInput.value = user.city;
            rowIndexInput.value = index;
            editForm.style.display = 'block';
        })
        .catch(error => console.error('Hata:', error));
}

// Güncelleme formunu kapatma
function closeEditForm() {
    editForm.style.display = 'none';
}

// Güncelleme formunu gönderme
updateUserForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const user = {
        id: userIdInput.value,
        name: userNameInput.value,
        password: userPasswordInput.value,
        city: userCityInput.value
    };

    updateUser(user);
});

// Sekmelerin açılmasını sağlama
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    Array.from(tabcontent).forEach(content => content.style.display = "none");

    const tablinks = document.getElementsByClassName("tablinks");
    Array.from(tablinks).forEach(link => link.className = link.className.replace(" active", ""));

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


// Kullanıcı listelerini yüklemek
document.querySelector('button[onclick="openTab(event, \'kullaniciListesi\')"]').addEventListener('click', loadUserList);

