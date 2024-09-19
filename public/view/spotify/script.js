document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    const singUpButton = document.getElementById('singUp');
    

    // Sign Up butonuna tıklama işlemi
    singUpButton.addEventListener('click', function () {
        window.location.href = 'spotify.html';    
        alert("Kullanıcı başarıyla kaydedildi.")    
    });

    //Kullanıcı silme işlemi
    document.getElementById('deleteUserButton')?.addEventListener('click', function() {
        
        if (userId) {
            fetch(`http://localhost:3000/delete-user/${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    alert('Kullanıcı başarıyla silindi');
                } else {
                    return response.text().then(text => {
                        throw new Error(text);
                    });
                }
            })
            .catch(error => {
                console.error('Hata:', error);
                alert('Bir hata oluştu. Lütfen tekrar deneyin.');
            });
        }
    });

    // Kullanıcı güncelleme işlemi
    document.getElementById('updateUserButton')?.addEventListener('click', function() {
        const userId = prompt("Güncellemek istediğiniz kullanıcının ID'sini girin:");
        if (userId) {
            
                        // Kullanıcının mevcut bilgilerini alırız
                        fetch(`http://localhost:3000/get-users`)
                        .then(response => response.json())
                        .then(data => {
                            const user = data.find(user => user.id === userId);
                            if (!user) {
                                alert('Kullanıcı bulunamadı');
                                return;
                            }
            
                            
                            document.getElementById('name').value = user.name;
                            document.getElementById('password').value = user.password;
                            document.getElementById('city').value = user.city;
            
                            
                            form.addEventListener('submit', function (event) {
                                event.preventDefault();
            
                                const updatedUser = {
                                    id: userId,
                                    name: document.getElementById('name').value,
                                    password: document.getElementById('password').value,
                                    city: document.getElementById('city').value
                                };
            
                                fetch('http://localhost:3000/update-user', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(updatedUser)
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Ağ yanıtı uygun değil');
                                    }
                                    return response.text();
                                })
                                .then(() => {
                                    alert('Kullanıcı başarıyla güncellendi');
                                    form.reset();
                                })
                                .catch(error => {
                                    console.error('Hata:', error);
                                    alert('Bir hata oluştu. Lütfen tekrar deneyin.');
                                });
                            });
                        })
                        .catch(error => {
                            console.error('Hata:', error);
                            alert('Kullanıcı bilgileri alınamadı.');
                        });
                    }
                });
            
                
                form.addEventListener('submit', function (event) {
                    event.preventDefault();
            
                    let id = parseInt(localStorage.getItem('id')) || 1;
            
                    const name = document.getElementById('name').value;
                    const password = document.getElementById('password').value;
                    const city = document.getElementById('city').value;
                    const spotifyUser = {
                        id: (id++).toString(),
                        name: name,
                        password: password,
                        city: city
                    };
            
                    fetch('http://localhost:3000/add-user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(spotifyUser)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Ağ yanıtı uygun değil');
                        }
                        return response.text();
                    })
                    .then(() => {
                        alert('Kullanıcı başarıyla eklendi');
                        form.reset();
                        localStorage.setItem('id', id);
                    })
                    .catch(error => {
                        console.error('Hata:', error);
                        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
                    });
                });
            });
            
