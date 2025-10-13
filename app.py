from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import os
import glob

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/content", StaticFiles(directory="content"), name="content")

# Set up templates
templates = Jinja2Templates(directory="templates")

# Course configuration - which courses are open
COURSE_STATUS = {
    "it": {"name": "Informatika", "open": True},
    "ar": {"name": "Arapski jezik", "open": True},
    "eng": {"name": "Engleski jezik", "open": True},
    "cal": {"name": "Kaligrafija", "open": True}
}

def get_course_slides(course):
    """Get all slide files from a specific course directory"""
    slide_pattern = f"content/{course}/*.html"
    slide_files = glob.glob(slide_pattern)
    # Sort files to ensure consistent order
    slide_files.sort()
    return slide_files

def get_all_open_courses():
    """Get list of all open courses"""
    return [course for course, info in COURSE_STATUS.items() if info["open"]]

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    courses = COURSE_STATUS
    open_courses = get_all_open_courses()
    
    # Get slides from all open courses
    all_slides = {}
    for course in open_courses:
        all_slides[course] = get_course_slides(course)
    
    return templates.TemplateResponse("index.html", {
        "request": request,
        "courses": courses,
        "all_slides": all_slides,
        "open_courses": open_courses
    })

@app.get("/slides/{course}")
async def get_slides(course: str):
    """API endpoint to get slides for a specific course"""
    if course not in COURSE_STATUS or not COURSE_STATUS[course]["open"]:
        return {"error": "Course not available"}
    
    slide_files = get_course_slides(course)
    slides = []
    
    for slide_file in slide_files:
        try:
            with open(slide_file, 'r', encoding='utf-8') as f:
                content = f.read()
                slides.append(content)
        except Exception as e:
            print(f"Error reading slide file {slide_file}: {e}")
            slides.append(f"<div class='error'>Error loading slide: {slide_file}</div>")
    
    return {"slides": slides, "course": course}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)