const currentCache = 'cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/js/theme.js',
  '/css/theme/light.css',
  '/css/theme/dark.css',
  '/equation-solver/',
  '/equation-solver/index.html',
  '/equation-solver/style.css',
  '/equation-solver/script.js',
  '/offline.html',
  '/manifest.json'
];





self.addEventListener('install', event => {
  event.waitUntil((async () => {
      let cache = await caches.open(currentCache)
      await cache.addAll(urlsToCache)
    })()
  )

  // event.waitUntil(
  //   caches.open(currentCache).then(cache => {
  //     return cache.addAll(urlsToCache);
  //   })
  // )

  console.log('Service worker installed');
})



self.addEventListener('activate', event => {
  event.waitUntil((async () => {
      let keys = await caches.keys()
      keys.map(key => {
        if (key != currentCache){
          console.log(`deleted cache "${key}"`)
          return caches.delete(key)
        }
      })

      // let keys = await caches.keys()
      // for (key of keys){
      //   if (key != currentCache){
      //     console.log(`Deleted cache ${key}`)
      //     return caches.delete(key)
      //   }
      // }

      
    })()
  )

  console.log('Service worker activated')
});






self.addEventListener('fetch', event => {

  let request = event.request
  let url = event.request.url
  let origin = location.origin

  // console.log(request)

  let doCache = request => {
    return true
  }

  if (request.method != 'GET' || !url.includes(origin)) {
    return
  }

  event.respondWith(
    (async () => {



      try {
        
        try {
          let response = await fetch(request)
          // console.log(response)
          if (!response.ok) {
            throw Error(`failed to fetch ${url} from network`)
          }
          if (doCache(request)) {
            let cache = await caches.open(currentCache)
            cache.put(request, response.clone())
          }
          return response
        }
        catch(error) {
          console.log(error)
          let response = await caches.match(request)
          // console.log(response)
          if(response == undefined || !response.ok) {
            throw Error(`failed to fetch ${url} from cache`)
          }
          return response
        }

      }
      catch(error) {
        console.log(error)
        let response = await caches.match('/offline.html')
        // console.log(response)
        return response
      }

    })()
  );





  // event.respondWith(
  //   caches.match(event.request).then(function(response) {
  //     return response || fetch(event.request);
  //   })
  // )
  
})