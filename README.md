# Digital Signage - Kulturni centar Kralj Fahd Sarajevo

Digital signage application for displaying course information at the Kulturni centar Kralj Fahd in Sarajevo.

## Features

- Displays course information in a grid layout
- Shows course status (open/closed enrollments)
- Auto-refreshes every minute
- Responsive design for digital signage displays
- Support for multiple languages

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## Setup Instructions

1. Clone or download the repository to your local machine.

2. Navigate to the project directory:
   ```bash
   cd digital_signage
   ```

3. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv .venv
   ```

4. Activate the virtual environment:
   - On Windows:
     ```bash
     .venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source .venv/bin/activate
     ```

5. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Run Instructions

1. Make sure you're in the `digital_signage` directory and your virtual environment is activated (if using one).

2. Run the application:
   ```bash
   python app.py
   ```

3. Open your web browser and go to `http://0.0.0.0:8002` (or the address shown in the console output).

## Project Structure

- `app.py` - Main FastAPI application
- `requirements.txt` - Python dependencies
- `static/` - CSS, JavaScript, and other static files
- `templates/` - HTML templates
- `content/` - Course content (HTML slides, images)

## Customization

To add or modify course content:
1. Edit the course HTML files in the `content/[course_name]/` directories
2. Update course information in `app.py` if needed

To change styling, modify the CSS in `static/css/style.css`

## Deployment

For production deployment, consider using a WSGI/ASGI server like uvicorn with a reverse proxy like Nginx.

## License

[Specify your license here if applicable]