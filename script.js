document.addEventListener('DOMContentLoaded', () => {
   const entries = document.querySelectorAll('[data-animate]')

   const options = {
      root: null,
      rootMargin: '0px 0px 0px 0px',
      threshold: 0,
   }
   const callback = (entries, observer) => {
      entries.forEach((entry) => {
         if (entry.isIntersecting) {
            if (entry.target.dataset.animate === '') {
               entry.target.classList.add('fadeInLeft')
            } else {
               entry.target.classList.add(entry.target.dataset.animate)
            }
            observer.unobserve(entry.target)
         }
      })
   }

   const observer = new IntersectionObserver(callback, options)

   entries.forEach((entry) => {
      observer.observe(entry)
   })
})
