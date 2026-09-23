// Utilidad de localStorage para recordar si este navegador ya respondió.
//
// IMPORTANTE: esto NO es seguridad. Cualquiera puede borrar esta clave,
// usar otro u otro dispositivo. Solo controla la experiencia del usuario
// en este dispositivo.

// Versión actual del RSVP. Para permitir que todos los invitados vuelvan a
// responder basta con subir este valor (p. ej. de "2" a "3"): quien tenga
// guardada una versión anterior quedará en desfase y podrá responder otra vez.
export const RSVP_VERSION = '2'

// Clave donde se guarda la versión con la que se respondió.
export const RSVP_VERSION_KEY = 'rsvp_version'

// Clave única donde se guarda la respuesta.
export const RSVP_STORAGE_KEY = 'wedding_rsvp'

// ¿La versión guardada coincide exactamente con la versión actual?
function isCurrentVersion() {
  try {
    return window.localStorage.getItem(RSVP_VERSION_KEY) === RSVP_VERSION
  } catch {
    // localStorage no disponible: se trata como sin respuesta.
    return false
  }
}

// Devuelve { name, attendance } si hay una respuesta válida guardada EN LA
// VERSIÓN ACTUAL, o null (si no hay respuesta o fue guardada en otra versión).
export function getSavedResponse() {
  try {
    // Versión distinta a la actual => el invitado puede volver a responder.
    if (!isCurrentVersion()) return null

    const raw = window.localStorage.getItem(RSVP_STORAGE_KEY)
    if (!raw) return null

    const saved = JSON.parse(raw)
    const isValid =
      saved &&
      typeof saved === 'object' &&
      typeof saved.name === 'string' &&
      saved.name.trim() !== '' &&
      typeof saved.attendance === 'boolean'

    return isValid
      ? { name: saved.name.trim(), attendance: saved.attendance }
      : null
  } catch {
    // localStorage no disponible o JSON corrupto: se trata como sin respuesta.
    return null
  }
}

// Guarda la respuesta. Debe llamarse SOLO después de que Django confirme
// que la respuesta se guardó correctamente (HTTP 2xx).
export function saveResponse({ name, attendance }) {
  try {
    window.localStorage.setItem(
      RSVP_STORAGE_KEY,
      JSON.stringify({ name, attendance }),
    )
    // Marca la versión con la que se respondió; solo llega aquí tras
    // confirmación del backend (HTTP 2xx).
    window.localStorage.setItem(RSVP_VERSION_KEY, RSVP_VERSION)
  } catch {
    // Si el navegador bloquea el almacenamiento, la app sigue funcionando:
    // simplemente no se recordará la respuesta en la próxima visita.
  }
}
