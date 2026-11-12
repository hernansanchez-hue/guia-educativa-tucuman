const shapes = {
  home: 'M3 10 12 3l9 7v10H3z M9 20v-7h6v7',
  slides: 'M3 5h18v14H3z M8 8l7 4-7 4z',
  school: 'M2 8l10-5 10 5H2z M5 10v7 M10 10v7 M15 10v7 M20 10v7 M2 21h20 M3 18h18',
  book: 'M3 4q5-2 9 1 4-3 9-1v14q-5-2-9 1-4-3-9-1z M12 5v14',
  image: 'M3 4h18v16H3z M3 15l5-5 4 4 3-2 6 6 M16 8h.01',
  edit: 'M4 16 15 5l4 4L8 20l-5 1z M14 6l4 4',
  clock: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M12 7v6l4 2',
  team: 'M9 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z M2 21v-3c0-5 14-5 14 0v3 M16 4a4 4 0 0 1 0 7 M18 14q4 1 4 6',
  pin: 'M12 22s8-8 8-13a8 8 0 0 0-16 0c0 5 8 13 8 13z M12 6a3 3 0 1 0 0 6 3 3 0 1 0 0-6z',
  chevron: 'm7 10 5 5 5-5', arrow: 'M4 12h15m-5-5 5 5-5 5', plus: 'M12 4v16 M4 12h16',
  search: 'M10 3a7 7 0 1 0 0 14 7 7 0 1 0 0-14z M15 15l6 6', menu: 'M3 6h18M3 12h18M3 18h18',
};
export default function ControlIcon({name}){return <svg className="gc-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={shapes[name] || shapes.arrow}/></svg>;}
