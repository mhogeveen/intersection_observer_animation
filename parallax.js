// Default parallax class
const parallaxClass = 'parallax'

document.addEventListener('DOMContentLoaded', () => {
   // Start parallax code
   let data, transform, screenHeight, animationId, isAnimating

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

      transform = el.getAttribute('data-parallax').split(',')
      data = {
         el,
         transform,
      }
      screenHeight = window.innerHeight

      return animateParallax()
   }

   const animateParallax = () => {
      if (!isAnimating) {
         isAnimating = true
         const { top } = data.el.getBoundingClientRect()
         let translate = []

         translate = data.transform.map((item, index) => {
            if (item === '0') return (translate[index] = 0)
            if (index === 3) return item
            return (translate[index] = Math.floor(Math.floor(top) / Number(item)))
         })

         data.el.style.transform = `translate3d(${translate[0]}px, ${translate[1]}px, ${translate[2]}px) scale(${translate[3]})`

         isAnimating = false
         return (animationId = requestAnimationFrame(animateParallax))
      }
   }

   const cleanupParallax = () => {
      cancelAnimationFrame(animationId)
   }
   // End parallax code

   const observerParallax = new IntersectionObserver(
      (entries) => {
         entries.forEach((entry) => {
            const element = entry.target
            let parallaxAnimationID
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
               setTimeout(() => {
                  parallaxAnimationID = initParallax(element)
               }, 10)
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

   document.querySelectorAll('[data-parallax]').forEach((entry) => {
      observerParallax.observe(entry)
   })
   // End of intersection observer code
})
