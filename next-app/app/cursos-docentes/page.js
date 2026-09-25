import PublicFooter from "../components/PublicFooter";
import PublicHeader from "../components/PublicHeader";
import AboutRevealClient from "../nosotros/AboutRevealClient";
import { getTeacherCoursesCatalog } from "../../lib/public-catalog/teacher-courses-catalog.js";
import { createPublicMetadata } from "../../lib/seo/public-metadata";
import CoursesClient from "./CoursesClient";
import "../[ciudad]/ciudad.css";
import "./cursos-docentes.css";

export const revalidate = 60;

export const metadata = createPublicMetadata({
  title: "Cursos Docentes",
  description: "Encontrá capacitaciones, trayectos formativos y propuestas de actualización docente organizadas por instituciones educativas de Tucumán.",
  path: "/cursos-docentes",
});

export default async function TeacherCoursesPage() {
  const courses = await getTeacherCoursesCatalog();

  return (
    <div className="app-shell">
      <PublicHeader />
      <AboutRevealClient />
      <section id="coursesPage" className="page active">
        <CoursesClient courses={courses} />
      </section>
      <PublicFooter />
    </div>
  );
}
