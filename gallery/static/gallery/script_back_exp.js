document.addEventListener('DOMContentLoaded', function() {
    loadDataFromDjango();
    // Drag and Drop
    const dragDropArea = document.getElementById('dragDropArea');
    const fileInput = document.getElementById('fileInput');
    const browseLink = document.querySelector('.browse-link');

    // Обработка клика по области для выбора файла
    browseLink.addEventListener('click', function(e) {
        e.stopPropagation();
        fileInput.click();
    });

    // Обработка выбора файла через input
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            uploadFiles(this.files);
        }
    });

    // Обработка событий drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dragDropArea.classList.add('highlight');
    }

    function unhighlight() {
        dragDropArea.classList.remove('highlight');
    }

    dragDropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            uploadFiles(files);
        }
    }

    // Функция для загрузки файлов (заглушка)
    function uploadFiles(files) {
        console.log('Файлы для загрузки:', files);
        alert(`Выбрано ${files.length} файлов для загрузки. В реальном приложении они будут отправлены на сервер.`);
        fileInput.value = '';
    }

    // Функция для загрузки данных из API Django
function loadDataFromDjango() {
    fetch('/api/image/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Данные из Django:', data);
            // Очищаем галерею перед загрузкой новых данных
            const gallery = document.querySelector('.gallery');
            gallery.innerHTML = '';
            
            // Добавляем сообщение, если нет изображений
            if (!Array.isArray(data) || data.length === 0) {
                gallery.innerHTML = '<p>Нет изображений для отображения.</p>';
                return;
            }
            
            // Добавляем все изображения из базы данных
            data.forEach(item => {
                if (item.image_url && isValidImageUrl(item.image_url)) {
                    addImageToGallery(
                        item.image_url,
                        item.title || "Без названия",
                        item.description || ""
                    );
                }
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных:', error);
        });
    }

    // Вызываем загрузку данных при загрузке страницы
    loadDataFromDjango();
});

// Функция для добавления изображения в галерею
function addImageToGallery(url, title = "Без названия", description = "") {
    const gallery = document.querySelector('.gallery');

    // Удаляем сообщение "Нет изображений", если оно есть
    const emptyMessage = gallery.querySelector('p');
    if (emptyMessage && emptyMessage.textContent === 'Нет изображений для отображения.') {
        gallery.removeChild(emptyMessage);
    }

    // Создаем новый элемент галереи
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    galleryItem.innerHTML = `
        <img src="${url}" alt="${title}" class="gallery-image" onerror="this.src='https://via.placeholder.com/250x200?text=Ошибка+загрузки'">
        <div class="image-info">
            <div class="image-title">${title}</div>
            <div class="image-desc">${description}</div>
        </div>
    `;

    // Добавляем новый элемент в галерею
    gallery.appendChild(galleryItem);
}

function isValidImageUrl(url) {
    // Список разрешенных расширений файлов
    const allowedExtensions = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'webp'];

    try {
        // Создаем объект URL для парсинга
        const urlObj = new URL(url);

        // Извлекаем путь и имя файла
        const pathname = urlObj.pathname.toLowerCase();

        // Получаем расширение файла (последняя часть после последней точки)
        const extension = pathname.split('.').pop();

        // Проверяем, есть ли расширение в списке разрешенных
        return allowedExtensions.includes(extension);
    } catch (e) {
        // Если URL невалидный, возвращаем false
        return false;
    }
}


// Функция для получения CSRF токена
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}



// Функция для загрузки по URL (модифицированная)
function uploadFromUrl() {
    const urlInput = document.getElementById('imageUrl');
    const imageUrl = urlInput.value.trim();

    if (imageUrl == "") {
        alert('Пожалуйста, введите URL изображения');
        return;
    }

    if (!isValidImageUrl(imageUrl)) {
        alert('Пожалуйста, введите корректный URL изображения');
        return;
    }

    // Отправляем данные на сервер
    fetch('/api/image/create/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'), // Необходимо для CSRF защиты
        },
        body: JSON.stringify({
            image_url: imageUrl,
            title: "Новое изображение",
            description: "Загружено по URL"
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при сохранении изображения');
        }
        return response.json();
    })
    .then(data => {
        // Добавляем изображение в галерею после успешного сохранения
        addImageToGallery(data.image_url, data.title, data.description);
        urlInput.value = '';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при сохранении изображения');
    });
}

// Обновляем обработчик загрузки по URL
document.getElementById('uploadUrlBtn').addEventListener('click', uploadFromUrl);