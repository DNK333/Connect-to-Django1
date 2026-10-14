# Создай своего персонажа

Учебное приложение: React + Vite отправляет форму персонажа в Django REST Framework API. Данные сохраняются в SQLite.

## Запуск Django API

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

API принимает `POST http://127.0.0.1:8000/api/characters/` с JSON-полями `name`, `character_class`, `level`, `weapon` и `description`, возвращает созданную запись со статусом `201 Created`.

## Запуск React

В отдельном окне терминала:

```powershell
cd frontend
npm install
npm run dev
```

Откройте адрес Vite, который будет показан в терминале (обычно `http://localhost:5173`). При необходимости адрес API можно переопределить переменной `VITE_API_URL`.

## Тесты API

```powershell
cd backend
python manage.py test characters
```


## ИИ

ии селал дизайн и прочее