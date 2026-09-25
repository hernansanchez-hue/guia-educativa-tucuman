import assert from "node:assert/strict";
import test from "node:test";
import { teacherCourses } from "../app/data/teacherCourses.js";
import { getMatchingTeacherCourses } from "../app/cursos-docentes/course-filters.js";

const empty = {
  query: "",
  institution: "",
  modality: "",
  score: "",
  date: "",
  duration: "",
};

function match(filters) {
  return getMatchingTeacherCourses(teacherCourses, { ...empty, ...filters });
}

test("search is accent-insensitive across canonical searchable fields", () => {
  assert.deepEqual(match({ query: "evaluacion formativa" }).map((course) => course.order), [2]);
  assert.deepEqual(match({ query: "aguilares virtual" }).map((course) => course.order), [8]);
});

test("institution, modality, score, date and duration reproduce Vite filters", () => {
  assert.equal(match({ institution: "IES Concepción" }).length, 2);
  assert.equal(match({ modality: "Virtual" }).length, 3);
  assert.deepEqual(match({ score: "40" }).map((course) => course.order), [1, 5, 6, 9]);
  assert.deepEqual(match({ score: "0" }), []);
  assert.deepEqual(match({ date: "2026-07-13" }).map((course) => course.order), [5]);
  assert.deepEqual(match({ duration: "short" }).map((course) => course.order), [2, 8]);
  assert.deepEqual(match({ duration: "medium" }).map((course) => course.order), [1, 3, 4, 6, 7, 10]);
  assert.deepEqual(match({ duration: "long" }).map((course) => course.order), [5, 9]);
});

test("combined filters preserve canonical order and support an empty result", () => {
  assert.deepEqual(
    match({ institution: "Universidad Siglo 21", modality: "Mixta", score: "40" }).map((course) => course.order),
    [1, 9],
  );
  assert.deepEqual(match({ query: "curso que no existe" }), []);
  assert.deepEqual(match({}).map((course) => course.order), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});
