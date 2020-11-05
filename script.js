document.addEventListener('DOMContentLoaded', () => {
   // Select DOM elements to animate
   const entries = document.querySelectorAll('[data-animate]')
   const parents = document.querySelectorAll('[data-parent]')

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
            const element = entry.target
            // If data-animate is empty add default animation variant
            // else add given animation variant
            if (element.dataset.animate === '') {
               element.classList.add('fadeInLeft')
            } else {
               element.classList.add(element.dataset.animate)
            }

            // Prevent multiple animations of the same element
            observer.unobserve(element)
         }
      })
   }

   // Create observer by calling constructor
   const observer = new IntersectionObserver(callback, options)

   // Attach observer to each element that shoud be observed
   entries.forEach((entry) => {
      observer.observe(entry)
   })

   console.log(parents)
   parents.forEach((parent) => {
      const children = Array.from(parent.childNodes)
      const noTextNodes = children.filter((node) => node.nodeName !== '#text')
      noTextNodes.forEach((node, index) => {
         console.log(node)
      })
   })
})
