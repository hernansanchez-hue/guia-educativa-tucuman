"use client";

export default function ContactForm() {
  function handleSubmit(event) {
    event.preventDefault();
    window.alert("Mensaje listo para seguimiento comercial.");
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <input required placeholder="Nombre de la institución" />
      <input required placeholder="Persona de contacto" />
      <input required placeholder="WhatsApp" inputMode="tel" />
      <input required placeholder="Email" type="email" />
      <select required defaultValue="">
        <option value="">Plan de interés</option>
        <option>Básico</option>
        <option>Profesional</option>
        <option>Premium</option>
      </select>
      <textarea rows="4" placeholder="Mensaje" />
      <button className="btn" type="submit">Enviar consulta</button>
    </form>
  );
}
