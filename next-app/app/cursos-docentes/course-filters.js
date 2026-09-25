export function normalizeCourseText(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getMatchingTeacherCourses(courses, filters) {
  const query = normalizeCourseText(filters.query);
  return courses.filter((course) => {
    const searchable = normalizeCourseText(
      [course.name, course.institution, course.city, course.modality].join(" "),
    );
    const scoreMatch = !filters.score
      || (filters.score === "0" ? course.score === 0 : course.score >= Number(filters.score));
    const durationMatch = !filters.duration
      || (filters.duration === "short" && course.weeks <= 4)
      || (filters.duration === "medium" && course.weeks >= 5 && course.weeks <= 8)
      || (filters.duration === "long" && course.weeks > 8);

    return (!query || searchable.includes(query))
      && (!filters.institution || course.institution === filters.institution)
      && (!filters.modality || course.modality === filters.modality)
      && scoreMatch
      && (!filters.date || course.start === filters.date)
      && durationMatch;
  });
}
