'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "c9208c36e08fefb9adc0a0dc3953c4d9",
"index.html": "842cb80c93dd4154bc6ff22c882ba0ef",
"/": "842cb80c93dd4154bc6ff22c882ba0ef",
"main.dart.js": "d600ba8cef82482832d098b59c85b93e",
"flutter.js": "a85fcf6324d3c4d3ae3be1ae4931e9c5",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "50b0e8a995b98b46368b1c252a01d632",
"assets/AssetManifest.json": "51bddc65c777920b9628c8d421ab70ca",
"assets/NOTICES": "d95f53f58e8ceeab894ca105f59b8aac",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/assets/images/lila.png": "41a4c1ff855851da06692df67cb0d860",
"assets/assets/images/lalli.png": "47ab782d43b15c0f723bd701dbb23522",
"assets/assets/images/cookie.png": "238963c07c44ef8283f7ac97a45a48ef",
"assets/assets/images/mone.png": "e755e74b33e5679242f0f5f9346a1181",
"assets/assets/images/alf.png": "17f5f14a3c32929d8d96ad09b4758f2f",
"assets/assets/images/elvis.png": "d5dd54473b7f193b01df562a3778e8bc",
"assets/assets/images/masja.png": "6b8f46a6adb82d9bcb11fbe5786a304a",
"assets/assets/images/paola.png": "06301eda64f38a155ee1fa4c824b8e15",
"assets/assets/images/tile1.png": "fcbda1d4b1433a7d00578e6463c367b0",
"assets/assets/images/fox.png": "5c099983b1f1402a4eeeb94081938163",
"assets/assets/images/tile2.png": "527fbfa7a789a80897be81707c5f429a",
"assets/assets/images/tile3.png": "6fbfec7ba42524171ddcac2bcad5c8eb",
"assets/assets/images/mike.png": "7bf3bf0f0b5d7466f024dea365d0e141",
"assets/assets/images/orig/lila.png": "f475c9c8f7967eb6ad5602d61f5b069d",
"assets/assets/images/orig/lalli.png": "6e050db1553d83d8870e17b83784a1cd",
"assets/assets/images/orig/cookie.png": "6ef21b93a4801dc288e5cfb4ed620255",
"assets/assets/images/orig/mone.png": "f6c57b953f23a0e39f46f19cfea28673",
"assets/assets/images/orig/alf.png": "60544107e21d5809b8d0fd8a5931cf8e",
"assets/assets/images/orig/elvis.png": "ad402a0d0c2b64f5adf8580a1db02999",
"assets/assets/images/orig/masja.png": "128208f560b404a99d919baf5792d9a1",
"assets/assets/images/orig/paola.png": "9962143562ce9d8a1c9d2dfd3e076f9c",
"assets/assets/images/orig/fox.png": "37187392652b878abab5ae38652648f4",
"assets/assets/images/orig/mike.png": "99c9562b15c8f85cb5908fc764fc294f",
"assets/assets/images/tile6.png": "1850f1555796f80faeeaaaf60fa55ce8",
"assets/assets/images/tile4.png": "e43636b30eb22616c3a87380e0eb764a",
"assets/assets/images/tile5.png": "6925d0312fbecdfe4c8dc9d9cd39a64f",
"assets/assets/cats.yaml": "da0a85ee7fbc070f3dc08f3159194c16",
"assets/assets/sounds/purr.mp3": "dd2d85f461bcd5fa4aebfedfe75442e6",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
