// Service Worker de Mascotas App.
// Estrategia network-first: siempre intenta traer la versión nueva de la red
// y guarda una copia en caché. Si no hay conexión, responde con la copia.
// Si tampoco hay copia, muestra la página propia de "sin conexión".

const CACHE_NAME = "mascotas-v1";
const PAGINA_OFFLINE = "/offline";
const ARCHIVOS_INICIALES = [
  "/",
  PAGINA_OFFLINE,
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ARCHIVOS_INICIALES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  // Borra cachés de versiones anteriores (por ejemplo "mascotas-v0").
  event.waitUntil(
    caches
      .keys()
      .then((nombres) =>
        Promise.all(nombres.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const peticion = event.request;

  // Solo GET del mismo origen. Los POST (Server Actions) van directo a la red.
  if (peticion.method !== "GET") return;
  if (new URL(peticion.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(peticion)
      .then((respuesta) => {
        if (respuesta.ok) {
          const copia = respuesta.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(peticion, copia));
        }
        return respuesta;
      })
      .catch(async () => {
        const enCache = await caches.match(peticion);
        if (enCache) return enCache;

        if (peticion.mode === "navigate") {
          return caches.match(PAGINA_OFFLINE);
        }
        return Response.error();
      })
  );
});
