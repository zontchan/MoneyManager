# Описание работы серверной логики 
## раздел для тех, кто использует локальный сервер и хочет узнать, как он работает

### Подготовительный запуск
#### В командной строке прописать run.bat перед запуском приложения, чтобы проставить переменные окружения.

Для работы локального сервера сперва нужно установить платформу [NodeJS](https://nodejs.org/en/download/).

Для конфигурации проекта используется файл `package.json`. Который содержит вспомогательную информацию о имени проекта, его версии, описания и т.д.
В разделе `scripts` используются скрипты, которые можно запускать из окружения.
* start - запускает сервер с помощью `nodemon`.
* test - должен запускать тесты, но так как тестов нету, то реализована такая загрушка (которую можно убрать)
В разделе `dependencies` прописаны зависимости, которые используются в проекте
* [dotenv](https://www.npmjs.com/package/dotenv) - позволяет использовать переменные окружения для настроек (в файле `.env` описаны настройки). [исходный_код](https://github.com/motdotla/dotenv)
* [express](https://www.npmjs.com/package/express) - основной framework используемый в приложении. Тоесть его база, которая позволяет удобно обрабатывать HTTP запросы. Можно сказать, что приложение реализовано с помощью [express](https://expressjs.com/ru/) framework'a. [официальный_сайт](https://expressjs.com/ru/), [исходный_код](https://github.com/expressjs/express)
* [lowdb](https://www.npmjs.com/package/lowdb) - простенькая база данных для сохранения данных. [исходный_код](https://github.com/typicode/lowdb)
* [morgan](https://www.npmjs.com/package/morgan) - средство регистрации HTTP запросов. В данном приложении просто печатает все запросы в консоль. [исходный_код](https://github.com/expressjs/morgan)
* [multer](https://www.npmjs.com/package/multer) - это middleware для фреймворка express для обработки multipart/form-data. [исходный_код](https://github.com/expressjs/multer)
* [nodemon](https://www.npmjs.com/package/nodemon) - пакет, который реализует перезагрузку сервера при изменении его исходного кода. Удобен для разработки, что бы каждый раз не перезапускать сервер. [исходный_код](https://github.com/remy/nodemon)
* [uniqid](https://www.npmjs.com/package/uniqid) - пакет, позволяющий генерировать уникальные идентификаторы. Очень важен при создании `id` для сущностей *пользователя* и *счёта*. [исходный_код](https://github.com/adamhalasz/uniqid)

Для установки пакетов в терменале используется команда `npm i`
 
Для запуска сервера используется команда `npm run start`. В этом случае запускается сервер (с использованием `nodemon`) запуская файл `index.js`

## Содержимое файла index.js
* 1 - изначально запрашивается пакет `dotenv` для получения переменных среды. 
* 2 - из `process.env` деструктурируются необходимые данные.
* 3-7 - создаются переменные для использования стандартных (`path`) или импортируемых пакетов.
* 8-12 - конфигурируется база данных
* 13-14 - если база данных пустая, то необходимо заполнить её начальными тестовыми данными
* 31-59 - создание тестовых данных и запись их в базу данных
* 16 - создаётся объект приложения express
* 17-21 - создаются [middleware](https://expressjs.com/ru/guide/writing-middleware.html), которые будут использоваться при каждом запросе.
    17 - использование статичных данных (HTML + CSS + JS)
    19-20 - запрашивается и устанавливается основная маршрутизация приложения (из папки `routes`)
    21 - используется `morgan` что бы при каждом запросе информация печаталась в консоль
* 23 - в случае пустого маршрута (он же корневой) вернуть файл `index.html` (из файла `.env`)
* 27 - начать прослушивать указанный порт и об этом напечатать на консоль.
**Важно! Использовать отправки начального файла index.js необходимо после настройки маршрутов. В ином случае при каждом запросе будет срабатывать обработчик отправки статичной страницы. Страница будет отправляться, а настроенные маршруты не будут работать (так как обработчик запроса уже выполнился и отправил статичный файл)**

На 20 строке запрашивается модуль маршрутизации, который находится в папке `routes` в файле `index.js`. В этом файле создаётся маршрутизатор приложения и настраиваются маршруты для соответствующих сущностей: пользователя, счёта и транзакции. Для каждого маршрута используется соответствующий модуль, который находится в той же папке.
Комментарии к модулям маршрутизации сущностей описаны в соответствующих комментариях.