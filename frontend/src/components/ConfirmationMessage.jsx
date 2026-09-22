export default function ConfirmationMessage({ name, attendance, alreadyResponded = false }) {
  // Este navegador ya tenía una respuesta guardada: se recuerda el nombre
  // y se avisa de que no hace falta volver a responder.
  if (alreadyResponded) {
    return (
      <div className="confirmation" role="status" aria-live="polite">
        <span className="confirmation__mark" aria-hidden="true">
          ❦
        </span>

        <h2 className="confirmation__title">
          {name}, tu respuesta ya fue registrada.
        </h2>
        <p className="confirmation__text">
          {attendance
            ? `${name}, tu asistencia ya fue confirmada. 💚`
            : `${name}, hemos registrado que no podrás asistir. 💚`}
        </p>
      </div>
    )
  }

  return (
    <div className="confirmation" role="status" aria-live="polite">
      <span className="confirmation__mark" aria-hidden="true">
        {attendance ? '❦' : '❁'}
      </span>

      {attendance ? (
        <>
          <h2 className="confirmation__title">
            ¡Gracias, {name}!
          </h2>
          <p className="confirmation__text">
            Nos alegra mucho saber que nos acompañarás.
          </p>
        </>
      ) : (
        <>
          <h2 className="confirmation__title">Gracias por informarnos, {name}.</h2>
          <p className="confirmation__text">
            Sentiremos no poder contar contigo.
          </p>
        </>
      )}
    </div>
  )
}
