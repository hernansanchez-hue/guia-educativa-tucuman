"use client";
import "./analytics-preferences-button.css";

export default function AnalyticsPreferencesButton() {
  return <button className="footer-contact-link get-analytics-preferences" type="button" onClick={event => {
    window.dispatchEvent(new CustomEvent("get:analytics-preferences", {detail: {trigger: event.currentTarget}}));
  }}>Preferencias de analítica</button>;
}
