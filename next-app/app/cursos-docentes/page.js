import { getTeacherCoursesCatalog } from "../../lib/public-catalog/teacher-courses-catalog.js";
import { createPublicMetadata } from "../../lib/seo/public-metadata";
import CoursesClient from "../components/approved/ApprovedCourses";



export const revalidate = 60;

export const metadata = createPublicMetadata({
  title: "Cursos Docentes",
  description: "Encontrá capacitaciones, trayectos formativos y propuestas de actualización docente organizadas por instituciones educativas de Tucumán.",
  path: "/cursos-docentes",
});

export default async function TeacherCoursesPage() {
  const courses = await getTeacherCoursesCatalog();

  return <CoursesClient courses={courses} today={new Date().toLocaleDateString('en-CA',{timeZone:'America/Argentina/Tucuman'})}/>;
}
