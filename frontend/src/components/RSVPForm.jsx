import { useState } from 'react'

const API_URL = (import.meta.env.VITE_API_URL || 'https://invitacion-boda-1-wt5o.onrender.com').replace(
  /\/+$/,
  '',
)

export default function RSVPForm({ onSubmitted }) {
  const [name, setName] = useState('')
  const [attendance, setAttendance] = useState(null) // true = sí, false = no
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const cleanName = name.trim()
    if (!cleanName) {
      setError('Por favor, escribe tu nombre.')
      return
    }
    if (attendance === null) {
      setError('Por favor, indica si asistirás.')
      return
    }

    setSubmitting(true)

    fetch(`${API_URL}/api/rsvp/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: cleanName, attendance }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          const firstError =
            typeof data === 'object'
              ? Object.values(data).flat()[0]
              : 'No se pudo enviar la respuesta.'
          throw new Error(firstError || 'No se pudo enviar la respuesta.')
        }
        onSubmitted({ name: cleanName, attendance })
      })
      .catch((err) => {
        console.error('Error enviando RSVP:', err)
        setError(
          err.message === 'Failed to fetch'
            ? 'No se pudo conectar con el servidor. Inténtalo de nuevo.'
            : err.message,
        )
      })
      .finally(() => setSubmitting(false))
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2 id="rsvp-title" className="form__title">
        Confirma tu asistencia
      </h2>

      <div className="field">
        <label className="field__label" htmlFor="guest-name">
          Nombre completo
        </label>
        <input
          id="guest-name"
          className="field__input"
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={200}
          disabled={submitting}
        />
      </div>

      <fieldset className="field field--options">
        <legend className="field__label">¿Asistirás a la boda?</legend>

        <div className="options" role="radiogroup" aria-label="¿Asistirás a la boda?">
          <label className={`option ${attendance === true ? 'option--selected' : ''}`}>
            <input
              type="radio"
              name="attendance"
              value="true"
              checked={attendance === true}
              onChange={() => setAttendance(true)}
              disabled={submitting}
            />
            <span>Sí, asistiré</span>
          </label>

          <label className={`option ${attendance === false ? 'option--selected' : ''}`}>
            <input
              type="radio"
              name="attendance"
              value="false"
              checked={attendance === false}
              onChange={() => setAttendance(false)}
              disabled={submitting}
            />
            <span>No podré asistir</span>
          </label>
        </div>
      </fieldset>

      {error && (
        <p className="form__error" role="alert">
          {error}
        </p>
      )}

      <button className="button" type="submit" disabled={submitting}>
        {submitting ? 'Enviando…' : 'Enviar'}
      </button>

      <p className="form__note">
        Esta respuesta no puede ser modificada una vez enviada.
      </p>
    </form>
  )
}
