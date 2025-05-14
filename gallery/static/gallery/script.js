        document.addEventListener('DOMContentLoaded', function() {
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

                // Здесь должна быть логика отправки файлов на сервер
                // Например, с использованием FormData и fetch/XMLHttpRequest

                alert(`Выбрано ${files.length} файлов для загрузки. В реальном приложении они будут отправлены на сервер.`);

                // Очищаем input после "загрузки"
                fileInput.value = '';
            }
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


        fetch('/api/your-model/')
          .then(response => response.json())
          .then(data => {
            console.log(data); // данные из вашей модели
            // Дальнейшая обработка данных
          })
          .catch(error => console.error('Error:', error));


        // Функция для загрузки по URL (модифицированная)
        function uploadFromUrl() {
            const urlInput = document.getElementById('imageUrl');
            const imageUrl = urlInput.value.trim();

            if (imageUrl == "") {
                alert('Пожалуйста, введите URL изображения');
                return;
            }

            // Добавляем изображение в галерею
            addImageToGallery(imageUrl, "Новое изображение", "Загружено по URL");
            // Очищаем поле после загрузки
            urlInput.value = '';
        }

        // Обновляем обработчик загрузки по URL
        document.getElementById('uploadUrlBtn').addEventListener('click', uploadFromUrl);

        // Загружаем тестовые изображения при загрузке страницы (можно удалить в боевом режиме)
        window.addEventListener('load', loadSampleImages);