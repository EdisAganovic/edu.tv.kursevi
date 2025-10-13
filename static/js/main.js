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
            
            // Show the registration message when courses are open
            const registrationMessage = document.getElementById('registration-message');
            if (registrationMessage) {
                registrationMessage.style.display = 'block';
            }
            
            // Start displaying content
            this.displayCurrentSlide();
            this.startRotation();
            
            // Add click event listeners to course boxes
            this.addCourseNavigation();
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
            
            // Create a container that includes both the registration message and the slide content
            const registrationMessage = '';
            contentContainer.innerHTML = registrationMessage + courseSlides[this.currentSlideIndex];
            
            contentContainer.classList.add('slide-transition');
            
            // Remove the transition class after animation completes to allow for future transitions
            setTimeout(() => {
                contentContainer.classList.remove('slide-transition');
            }, 500);
            
            // Update active course indicator
            this.updateActiveCourseIndicator();
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
    
    // Navigate to a specific course
    navigateToCourse(course) {
        const courseIndex = this.openCourses.indexOf(course);
        
        if (courseIndex !== -1) {
            this.currentCourseIndex = courseIndex;
            this.currentSlideIndex = 0; // Start from first slide of the selected course
            this.displayCurrentSlide();
            
            // Make sure registration message is visible when navigating
            const registrationMessage = document.getElementById('registration-message');
            if (registrationMessage) {
                registrationMessage.style.display = 'block';
            }
            
            // Reset the rotation timer when user navigates manually
            this.resetRotationTimer();
        }
    }
    
    // Add click event listeners to course boxes
    addCourseNavigation() {
        const courseBoxes = document.querySelectorAll('.course-box');
        
        courseBoxes.forEach((box, index) => {
            // Only add event listener to open courses
            if (box.classList.contains('open')) {
                const course = box.getAttribute('data-course');
                
                box.addEventListener('click', () => {
                    this.navigateToCourse(course);
                });
            }
        });
    }
    
    // Update the active course indicator
    updateActiveCourseIndicator() {
        // Remove active class from all course boxes
        document.querySelectorAll('.course-box').forEach(box => {
            box.classList.remove('active');
        });
        
        // Add active class to the current course box
        const currentCourse = this.openCourses[this.currentCourseIndex];
        const currentCourseBox = document.querySelector(`.course-box[data-course="${currentCourse}"]`);
        
        if (currentCourseBox) {
            currentCourseBox.classList.add('active');
        }
    }
    
    startRotation() {
        // Stop auto-rotation if it's already running
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
        }
        
        // Start the rotation interval
        this.rotationInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideDuration);
    }
    
    // Reset the rotation timer (for when user interacts with course navigation)
    resetRotationTimer() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
        }
        
        this.rotationInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideDuration);
    }
}

// Initialize the digital signage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DigitalSignage();
});