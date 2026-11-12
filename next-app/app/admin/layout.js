import styles from "./admin.module.css";

export const metadata = {
  title: { default: "Administrador GET", template: "%s | Administrador GET" },
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";
export default function AdminLayout({ children }) {
  return <main className={styles.root}>{children}</main>;
}
