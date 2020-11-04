document.addEventListener('DOMContentLoaded', () => {
   // Select DOM elements to animate
   const entries = document.querySelectorAll('[data-animate]')

   // Intersection observer options
   const options = {
      root: null,
      rootMargin: '0px 0px 0px 0px',
      threshold: 0,
   }

   // Function to run when the observer observes the intersection of
   // an entry within entries
   const callback = (entries, observer) => {
      entries.forEach((entry) => {
         if (entry.isIntersecting) {
            // If data-animate is empty add default animation variant
            // else add given animation variant
            if (entry.target.dataset.animate === '') {
               entry.target.classList.add('fadeInLeft')
            } else {
               entry.target.classList.add(entry.target.dataset.animate)
            }

            // Prevent multiple animations of the same element
            observer.unobserve(entry.target)
         }
      })
   }

   // Create observer by calling constructor
   const observer = new IntersectionObserver(callback, options)

   // Attach observer to each element that shoud be observed
   entries.forEach((entry) => {
      observer.observe(entry)
   })
})
