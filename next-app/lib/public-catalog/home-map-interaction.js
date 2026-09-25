export function departmentAction(cities, canHover, fromKeyboard = false) {
  if (cities.length === 0) return { type: "coming-soon" };
  if (cities.length > 1) return { type: "choose-city" };
  if (!canHover || fromKeyboard) return { type: "select", href: `/${cities[0].slug}` };
  return { type: "navigate", href: `/${cities[0].slug}` };
}
