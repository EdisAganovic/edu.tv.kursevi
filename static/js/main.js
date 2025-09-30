// Digital Signage Application - Main JavaScript Logic
class DigitalSignage {
    constructor() {
        this.currentCourseIndex = 0;
        this.currentSlideIndex = 0;
        this.courseSlides = {}; // Store slides for each course
        this.openCourses = window.openCourses;
        
        // Configuration
        this.slideDuration = 8000; // 8 seconds per slide
        
        // Start the slideshow
        this.init();
    }
    
    async init() {
        if (this.openCourses.length > 0) {
            // Load slides for all open courses
            for (const course of this.openCourses) {
                await this.loadCourseSlides(course);
            }
            
            // Start displaying content
            this.displayCurrentSlide();
            this.startRotation();
        } else {
            document.getElementById('content-container').innerHTML = 
                '<div class="placeholder">No open courses available</div>';
        }
    }
    
    async loadCourseSlides(course) {
        try {
            const response = await fetch(`/slides/${course}`);
            const data = await response.json();
            
            if (data.slides && Array.isArray(data.slides)) {
                this.courseSlides[course] = data.slides;
            } else {
                this.courseSlides[course] = [];
            }
        } catch (error) {
            console.error(`Error loading slides for course ${course}:`, error);
            this.courseSlides[course] = [];
        }
    }
    
    displayCurrentSlide() {
        if (this.openCourses.length === 0) return;
        
        const currentCourse = this.openCourses[this.currentCourseIndex];
        const courseSlides = this.courseSlides[currentCourse] || [];
        
        if (courseSlides.length > 0 && this.currentSlideIndex < courseSlides.length) {
            const contentContainer = document.getElementById('content-container');
            contentContainer.innerHTML = courseSlides[this.currentSlideIndex];
            contentContainer.classList.add('slide-transition');
            
            // Remove the transition class after animation completes to allow for future transitions
            setTimeout(() => {
                contentContainer.classList.remove('slide-transition');
            }, 500);
        } else {
            // If no slides in current course, try next course
            this.nextCourse();
        }
    }
    
    nextSlide() {
        if (this.openCourses.length === 0) return;
        
        const currentCourse = this.openCourses[this.currentCourseIndex];
        const courseSlides = this.courseSlides[currentCourse] || [];
        
        this.currentSlideIndex++;
        
        // If we've reached the end of slides in the current course
        if (this.currentSlideIndex >= courseSlides.length) {
            this.nextCourse();
        } else {
            this.displayCurrentSlide();
        }
    }
    
    nextCourse() {
        // Move to the next course
        this.currentCourseIndex = (this.currentCourseIndex + 1) % this.openCourses.length;
        this.currentSlideIndex = 0; // Reset to first slide of new course
        this.displayCurrentSlide();
    }
    
    startRotation() {
        setInterval(() => {
            this.nextSlide();
        }, this.slideDuration);
    }
}

// Initialize the digital signage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DigitalSignage();
});