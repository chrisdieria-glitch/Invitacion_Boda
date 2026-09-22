export default function ConfirmationMessage({ name, attendance }) {
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
