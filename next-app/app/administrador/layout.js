import './control.css';
import './editor-ux.css';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Centro de Control | GET',
  robots: { index: false, follow: false },
  referrer: 'same-origin',
};
export default function Layout({ children }) {
  return <div className="get-control">{children}</div>;
}
