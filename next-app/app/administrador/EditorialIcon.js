const shapes={
  preview:<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  save:<><path d="M5 3h12l4 4v14H3V3h2Zm2 0v6h9V3M7 21v-8h10v8"/></>,
  publish:<><path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6"/></>,
  image:<><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8" cy="9" r="1.5"/><path d="m4 17 4-4 3 3 4-6 5 7"/></>,
};
export default function EditorialIcon({name}){
  return <svg className="gc-editor-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>;
}
