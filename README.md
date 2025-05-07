# Task Manager

## Overview
Task Manager is a web application built with Django Rest Framework (DRF) and React, designed to help users manage their tasks efficiently. It supports user authentication, task creation, editing, deletion, filtering, pagination, and real-time updates via WebSockets using Django Channels. A partially implemented drag-and-drop feature allows users to move tasks around for fun, though order persistence is still a work in progress.

## Features
- **User Authentication**: Register, log in, and log out securely using JWT tokens.
- **Task Management**:
  - Create, edit, and delete tasks.
  - Filter tasks by status, priority, and category.
  - Paginate tasks (5 tasks per page).
- **Categories**: Assign tasks to user-specific categories.
- **Drag-and-Drop**: Move tasks around the list (order not yet persistent).
- **Real-Time Updates**: WebSocket integration ensures tasks sync across tabs.
- **Responsive UI**: Built with React and styled with Tailwind CSS for a clean, responsive design.

## Tech Stack
- **Backend**: Django, Django Rest Framework, Django Channels, Daphne
- **Frontend**: React, React Router, Tanstack Query, Axios, Tailwind CSS, @dnd-kit
- **Database**: SQLite (default, can be swapped with PostgreSQL or others)
- **WebSocket**: Django Channels for real-time updates

## Prerequisites
- Python 3.8+
- Node.js 16+
- npm 7+
- Redis (for Django Channels)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Chuks-ked/task-manager.git
cd task_manager
```

### 2. Backend Setup
1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment and activate it**:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Start Redis** (required for Django Channels):
   - On macOS/Linux: `redis-server`
   - On Windows: Install Redis or use WSL, then run `redis-server`

6. **Run the backend server with Daphne**:
   ```bash
   daphne -p 8000 task_manager.asgi:application
   ```

### 3. Frontend Setup
1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the frontend development server**:
   ```bash
   npm run dev
   ```

4. **Access the app**:
   Open `http://localhost:5173` (or the port shown in the terminal) in your browser.

## Usage
1. **Register**: Navigate to `/signup` to create a new account.
2. **Log In**: Go to `/login` and log in with your credentials.
3. **Manage Tasks**:
   - View all tasks on the homepage (`/`).
   - Filter tasks by status, priority, or category using the dropdowns.
   - Use pagination to navigate between pages of tasks.
   - Click "Add Task" to create a new task.
   - Edit or delete existing tasks using the buttons on each task card.
   - Drag tasks to move them around (note: order won’t persist yet).
4. **Real-Time Updates**: Open the app in multiple tabs; updates (e.g., creating or editing a task) will sync automatically.
5. **Log Out**: Click the "Logout" button in the navigation bar.

## Project Structure
- **backend/**: Contains the Django project.
  - `task_manager/`: Django settings and ASGI configuration.
  - `tasks/`: Django app with models, views, serializers, and WebSocket consumers.
- **frontend/**: Contains the React project.
  - `src/components/`: React components (e.g., `TaskList`, `TaskCard`, `TaskForm`, `Login`, `Signup`).
  - `src/context/`: Auth context for user authentication.
  - `src/api/`: Axios instance for API requests.

## API Endpoints
- **POST /api/token/**: Authenticate and receive a JWT token.
- **POST /api/regsiter/**: Register a new user.
- **GET/POST /api/tasks/**: List or create tasks.
- **GET/PATCH/DELETE /api/tasks/<id>/**: Retrieve, update, or delete a specific task.
- **GET/POST /api/categories/**: List or create categories.
- **ws://127.0.0.1:8000/ws/tasks/**: WebSocket endpoint for real-time task updates.

## Known Issues
- Drag-and-drop allows task movement but does not persist the new order due to backend sync issues.
- Filtering might reset pagination; this can be improved in future updates.

## Future Improvements
- Fix drag-and-drop to persist task order after movement.
- Add task sorting by additional fields (e.g., due date).
- Enhance WebSocket performance by reducing unnecessary refetches.
- Add tests for both backend and frontend.

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -m "Add feature"`).
4. Push to your branch (`git push origin feature-name`).
5. Open a pull request.

## License
This project is licensed under the MIT License.