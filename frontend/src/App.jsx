import { useState } from 'react'
import Invitation from './components/Invitation.jsx'
import RSVPForm from './components/RSVPForm.jsx'
import ConfirmationMessage from './components/ConfirmationMessage.jsx'

export default function App() {
  const [response, setResponse] = useState(null)

  return (
    <main className="page">
      <div className="page__inner">
        <Invitation />

        <section className="rsvp" aria-labelledby="rsvp-title">
          <span className="divider" aria-hidden="true" />

          {response ? (
            <ConfirmationMessage
              name={response.name}
              attendance={response.attendance}
            />
          ) : (
            <RSVPForm onSubmitted={setResponse} />
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
