"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getMatchingTeacherCourses } from "./course-filters.js";

const INITIAL_FILTERS = Object.freeze({
  query: "",
  institution: "",
  modality: "",
  score: "",
  date: "",
  duration: "",
});

function CourseDate({ date }) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CourseDetailGrid({ course }) {
  return (
    <div className="course-detail-grid">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 5h16v12H4zM9 21h6" /></svg>{course.modality}</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" /></svg>{course.score ? `${course.score} puntos` : "Sin puntaje"}</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>{course.weeks} semanas</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4" /></svg><CourseDate date={course.start} /></span>
    </div>
  );
}

function CourseCard({ course, urgency = false, onView, onConsult }) {
  return (
    <article className="teacher-course-card">
      <div className="teacher-course-card-image-wrap">
        <img src={course.image} alt={course.name} />
        <span className={urgency ? "course-urgency" : "course-card-badge"}>{urgency ? course.urgency : course.badge}</span>
      </div>
      <div className="teacher-course-card-body">
        <h3>{course.name}</h3>
        <p className="course-institution">{course.institution} · {course.city}</p>
        <CourseDetailGrid course={course} />
        <div className="course-card-actions">
          <button className="btn light" type="button" onClick={() => onView(course.name)}>Ver curso</button>
          <button className="btn" type="button" onClick={() => onConsult(course.name)}>Consultar</button>
        </div>
      </div>
    </article>
  );
}

function CourseListCard({ course, onView }) {
  const statusClass = course.status === "Últimos cupos"
    ? " warning"
    : course.status === "Próximamente" ? " soon" : "";

  return (
    <article className="course-list-card">
      <img src={course.image} alt={course.name} />
      <div className="course-list-title"><h3>{course.name}</h3><p>{course.institution} · {course.city}</p></div>
      <div className="course-list-meta">
        <span><strong>Modalidad</strong>{course.modality}</span>
        <span><strong>Puntaje</strong>{course.score ? `${course.score} puntos` : "Sin puntaje"}</span>
        <span><strong>Duración</strong>{course.weeks} semanas</span>
        <span><strong>Inicio</strong><CourseDate date={course.start} /></span>
        <span><strong>Ciudad</strong>{course.city}</span>
        <span><strong>Institución</strong>{course.institution}</span>
      </div>
      <div><span className={`course-status${statusClass}`}>{course.status}</span><button className="btn light" type="button" onClick={() => onView(course.name)}>Ver curso</button></div>
    </article>
  );
}

export default function CoursesClient({ courses }) {
  const router = useRouter();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [visibleLimit, setVisibleLimit] = useState(5);
  const institutions = useMemo(
    () => [...new Set(courses.map((course) => course.institution))].sort(),
    [courses],
  );
  const featured = useMemo(() => courses.filter((course) => course.featured), [courses]);
  const upcoming = useMemo(
    () => [...courses].sort((a, b) => a.start.localeCompare(b.start)).slice(0, 5),
    [courses],
  );
  const matches = useMemo(
    () => getMatchingTeacherCourses(courses, filters),
    [courses, filters],
  );
  const visible = matches.slice(0, visibleLimit);

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function clearFilters() {
    setFilters(INITIAL_FILTERS);
    setVisibleLimit(5);
  }

  function scrollCarousel(id, direction) {
    const carousel = document.getElementById(id);
    carousel?.scrollBy({
      left: direction * Math.max(300, carousel.clientWidth * 0.72),
      behavior: "smooth",
    });
  }

  function viewCourse(name) {
    window.alert(`La ficha de “${name}” estará disponible próximamente.`);
  }

  function consultCourse(name) {
    window.open(
      `https://wa.me/5493865751273?text=${encodeURIComponent(`Hola, quiero consultar por el curso docente: ${name}`)}`,
      "_blank",
      "noopener",
    );
  }

  return (
    <div className="courses-page">
      <section className="courses-hero about-reveal">
        <div className="courses-hero-copy">
          <span className="eyebrow">Formación docente</span>
          <h1>Cursos Docentes de toda la provincia</h1>
          <p>Encontrá capacitaciones, trayectos formativos y propuestas de actualización docente organizadas por instituciones educativas de Tucumán.</p>
          <div className="course-trust-list">
            {[
              "Cursos actualizados permanentemente",
              "Instituciones reconocidas",
              "Modalidades presenciales y virtuales",
            ].map((item) => <span className="course-trust-item" key={item}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></svg>{item}</span>)}
          </div>
        </div>
        <div className="courses-hero-visual">
          <img className="courses-hero-image" src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=82" alt="Docente participando de una capacitación educativa" />
          <div className="courses-visual-card">
            <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h16v14H4z" /><path d="M8 9h8M8 13h5" /></svg></span>
            <strong>Formación continua</strong>
            <small>Propuestas para actualizar conocimientos y sumar puntaje.</small>
          </div>
        </div>
      </section>

      <form className="course-filters" onSubmit={(event) => event.preventDefault()}>
        <label className="course-filter-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
          <input type="search" placeholder="Buscar cursos..." autoComplete="off" value={filters.query} onChange={(event) => updateFilter("query", event.target.value)} />
        </label>
        <select value={filters.institution} onChange={(event) => updateFilter("institution", event.target.value)} aria-label="Filtrar por institución"><option value="">Institución</option>{institutions.map((institution) => <option key={institution}>{institution}</option>)}</select>
        <select value={filters.modality} onChange={(event) => updateFilter("modality", event.target.value)} aria-label="Filtrar por modalidad"><option value="">Modalidad</option><option>Presencial</option><option>Virtual</option><option>Mixta</option></select>
        <select value={filters.score} onChange={(event) => updateFilter("score", event.target.value)} aria-label="Filtrar por puntaje"><option value="">Puntaje</option><option value="0">Sin puntaje</option><option value="20">20 puntos o más</option><option value="40">40 puntos o más</option></select>
        <input type="date" value={filters.date} onChange={(event) => updateFilter("date", event.target.value)} aria-label="Filtrar por fecha de inicio" />
        <select value={filters.duration} onChange={(event) => updateFilter("duration", event.target.value)} aria-label="Filtrar por duración"><option value="">Duración</option><option value="short">Hasta 4 semanas</option><option value="medium">5 a 8 semanas</option><option value="long">Más de 8 semanas</option></select>
        <button className="course-clear-button" type="button" onClick={clearFilters}>Limpiar filtros</button>
      </form>

      <section className="course-section about-reveal">
        <div className="course-section-head">
          <div><h2>Cursos destacados</h2><p>Propuestas seleccionadas por su calidad y relevancia.</p></div>
          <div className="course-carousel-controls"><button className="course-carousel-button" type="button" onClick={() => scrollCarousel("featuredCourses", -1)} aria-label="Anterior">←</button><button className="course-carousel-button" type="button" onClick={() => scrollCarousel("featuredCourses", 1)} aria-label="Siguiente">→</button></div>
        </div>
        <div id="featuredCourses" className="course-carousel">{featured.map((course) => <CourseCard key={course.id} course={course} onView={viewCourse} onConsult={consultCourse} />)}</div>
      </section>

      <section className="course-section about-reveal">
        <div className="course-section-head">
          <div><h2>Próximos a iniciar</h2><p>Inscripciones abiertas para propuestas que comienzan pronto.</p></div>
          <div className="course-carousel-controls"><button className="course-carousel-button" type="button" onClick={() => scrollCarousel("upcomingCourses", -1)} aria-label="Anterior">←</button><button className="course-carousel-button" type="button" onClick={() => scrollCarousel("upcomingCourses", 1)} aria-label="Siguiente">→</button></div>
        </div>
        <div id="upcomingCourses" className="course-carousel">{upcoming.map((course) => <CourseCard key={course.id} course={course} urgency onView={viewCourse} onConsult={consultCourse} />)}</div>
      </section>

      <section className="course-section about-reveal">
        <div className="course-section-head"><div><h2>Todos los cursos docentes</h2><p id="courseResultsText">{matches.length === 1 ? "1 curso encontrado." : `${matches.length} cursos encontrados.`}</p></div></div>
        <div id="courseCatalog" className="course-catalog">{visible.map((course) => <CourseListCard key={course.id} course={course} onView={viewCourse} />)}</div>
        <div id="courseEmpty" className={matches.length ? "course-empty hidden" : "course-empty"}>No encontramos cursos con esos filtros.</div>
        <button id="courseLoadMore" className={visible.length >= matches.length || matches.length === 0 ? "btn light course-load-more hidden" : "btn light course-load-more"} type="button" onClick={() => setVisibleLimit((limit) => limit + 4)}>Cargar más</button>
      </section>

      <section className="teacher-course-cta about-reveal">
        <div><h2>¿Sos una institución educativa?</h2><p>Publicá tus cursos docentes en Guía Educativa Tucumán y llegá a docentes de toda la provincia.</p></div>
        <button className="btn" type="button" onClick={() => router.push("/contacto")}>Publicar curso</button>
      </section>
    </div>
  );
}
