// Default animation variant
const defaultAnimation = 'fadeInLeft'
const parallaxClass = 'parallax'

document.addEventListener('DOMContentLoaded', () => {
   // Start parallax code
   let data, speed, screenHeight, animationId, isAnimating

   window.requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (f) {
         return setTimeout(f, 1000 / 60)
      }

   const cancelAnimationFrame =
      window.cancelAnimationFrame || window.mozCancelAnimationFrame || clearTimeout

   const initParallax = (el) => {
      // Cleanup before setting up new requestAnimationFrame.
      cancelAnimationFrame(animationId)

      speed = el.getAttribute('data-parallax').split(',')
      data = {
         el,
         speed,
      }
      screenHeight = window.innerHeight

      return animateParallax()
   }

   const animateParallax = () => {
      if (!isAnimating) {
         isAnimating = true
         const { top } = data.el.getBoundingClientRect()
         let translate = []

         translate = data.speed.map((item, index) => {
            if (item === '0') return (translate[index] = 0)
            return (translate[index] = Math.floor(Math.floor(top) / Number(item)))
         })

         data.el.style.transform = `translate3d(${translate[0]}px, calc(${translate[1]}px), ${translate[2]}px)`

         isAnimating = false
         return (animationId = requestAnimationFrame(animateParallax))
      }
   }

   const cleanupParallax = () => {
      cancelAnimationFrame(animationId)
   }
   // End parallax code

   // Start of count up animation code
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
   // End of count up animation code

   // Start of intersection observer code
   const handleAnimationParent = (element, animationVariant, delayModifier) => {
      const children = element.querySelectorAll('[data-animation-child]')
      children.forEach((child, index) => {
         child.setAttribute('style', `--delay: ${index * delayModifier}ms;`)
         child.classList.add(animationVariant)
      })
   }

   const observerAnimate = new IntersectionObserver(
      (entries, observer) => {
         entries.forEach((entry) => {
            const element = entry.target
            const dataAnimate = element.dataset.animate
            if (entry.isIntersecting) {
               switch (dataAnimate) {
                  case '':
                     element.classList.add(defaultAnimation)
                     observer.unobserve(element)
                     break
                  case 'counter':
                     element.classList.add('active')
                     animateCountUp(element)
                     observer.unobserve(element)
                     break
                  default:
                     if (element.dataset.animationParent !== undefined) {
                        const delayModifier = Number(element.dataset.animationParent)
                        handleAnimationParent(element, dataAnimate, delayModifier)
                        observer.unobserve(element)
                     }
                     element.classList.add(dataAnimate)
                     observer.unobserve(element)
                     break
               }
            }
         })
      },
      {
         root: null,
         rootMargin: '-100px 0px -100px 0px',
         threshold: 0,
      }
   )

   const observerParallax = new IntersectionObserver(
      (entries) => {
         entries.forEach((entry) => {
            const element = entry.target
            let parallaxAnimationID
            if (entry.isIntersecting) {
               parallaxAnimationID = initParallax(element)
            } else {
               cleanupParallax(parallaxAnimationID)
            }
         })
      },
      {
         root: null,
         rootMargin: '10px 0px 10px 0px',
         threshold: 0,
      }
   )

   document.querySelectorAll('[data-animate]').forEach((entry) => {
      if (entry.dataset.animate === 'parallax') return observerParallax.observe(entry)
      observerAnimate.observe(entry)
   })
   // End of intersection observer code
})
