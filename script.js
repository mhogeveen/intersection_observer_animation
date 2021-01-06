// Default animation variant
const defaultAnimation = 'fadeInLeft'

document.addEventListener('DOMContentLoaded', () => {
   const animationDuration = 3000 // Duration of animation in ms
   const frameDuration = 1000 / 60 // Calculate ms/frame at 60 frames/second
   const totalFrames = Math.round(animationDuration / frameDuration)

   const easeOutQuad = (t) => t * (2 - t)

   const animateCountUp = (el) => {
      let frame = 0
      const countTo = parseInt(el.innerHTML, 10)

      const counter = setInterval(() => {
         frame++

         const progress = easeOutQuad(frame / totalFrames)
         const currentCount = Math.round(countTo * progress)

         if (parseInt(el.innerHTML, 10) !== currentCount) {
            el.innerHTML = currentCount
         }

         if (frame === totalFrames) {
            clearInterval(counter)
         }
      }, frameDuration)
   }

   // const countupEls = document.querySelectorAll('.counter__count')
   // countupEls.forEach(animateCountUp)

   // Select DOM elements to animate
   const entries = document.querySelectorAll('[data-animate]')

   const handleAnimationParent = (element, animationVariant, delayModifier) => {
      const children = element.querySelectorAll('[data-animation-child]')
      children.forEach((child, index) => {
         child.setAttribute('style', `--delay: ${index * delayModifier}ms;`)
         child.classList.add(animationVariant)
      })
   }

   // Intersection observer options
   const options = {
      root: null,
      rootMargin: '-100px 0px -100px 0px',
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
               element.classList.add(defaultAnimation)
            } else if (element.dataset.animationParent !== undefined) {
               const animationVariant = element.dataset.animate
               const delayModifier = Number(element.dataset.animationParent)
               handleAnimationParent(element, animationVariant, delayModifier)
            } else if (element.dataset.animate === 'counter') {
               element.classList.add('active')
               animateCountUp(element)
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
})
