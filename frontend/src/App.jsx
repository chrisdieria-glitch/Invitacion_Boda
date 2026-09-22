import { useState } from 'react'
import Invitation from './components/Invitation.jsx'
import RSVPForm from './components/RSVPForm.jsx'
import ConfirmationMessage from './components/ConfirmationMessage.jsx'
import { getSavedResponse, saveResponse } from './storage.js'

export default function App() {
  // ¿Este navegador ya respondió? Se comprueba una sola vez al cargar la
  // página (inicialización perezosa de useState), así nunca se llega a
  // montar el formulario si ya existe una respuesta guardada.
  const [savedResponse] = useState(getSavedResponse)

  // Respuesta enviada durante esta visita a la página.
  const [response, setResponse] = useState(null)

  // Este callback solo llega a ejecutarse cuando el backend ha confirmado
  // el guardado con éxito, así que es el momento correcto de persistirlo.
  function handleSubmitted(newResponse) {
    saveResponse(newResponse)
    setResponse(newResponse)
  }

  return (
    <main className="page">
      <div className="page__inner">
        <Invitation />

        <section className="rsvp" aria-labelledby="rsvp-title">
          <span className="divider" aria-hidden="true" />

          {response || savedResponse ? (
            <ConfirmationMessage
              name={(response || savedResponse).name}
              attendance={(response || savedResponse).attendance}
              // En esta visita se acaba de enviar => mensaje de confirmación.
              // En visitas posteriores => mensaje de "ya has respondido".
              alreadyResponded={!response}
            />
          ) : (
            <RSVPForm onSubmitted={handleSubmitted} />
          )}
        </section>

        <footer className="page__footer">
          <span className="divider divider--small" aria-hidden="true" />
          <p>Con cariño, los esperamos</p>
        </footer>
      </div>
    </main>
  )
}
