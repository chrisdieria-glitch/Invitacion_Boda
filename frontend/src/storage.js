// Utilidad de localStorage para recordar si este navegador ya respondió.
//
// IMPORTANTE: esto NO es seguridad. Cualquiera puede borrar esta clave,
// usar otro u otro dispositivo. Solo controla la experiencia del usuario
// en este dispositivo.

// Clave única donde se guarda la respuesta.
export const RSVP_STORAGE_KEY = 'wedding_rsvp'

// Devuelve { name, attendance } si hay una respuesta válida guardada, o null.
export function getSavedResponse() {
  try {
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
  } catch {
    // Si el navegador bloquea el almacenamiento, la app sigue funcionando:
    // simplemente no se recordará la respuesta en la próxima visita.
  }
}
