"use client";
import PublicFooter from '../components/PublicFooter';
import PublicHeader from '../components/PublicHeader';
import CatalogFilters from '../components/CatalogFilters';
import '../[ciudad]/ciudad.css';
import './instituciones.css';
export default function InstitutionsIndexClient({institutions,cities=[],careers=[],initialQuery=''}){
 return <div className="app-shell"><PublicHeader/><main className="institutions-page"><header className="institutions-intro"><span>INSTITUCIONES</span><h1>Encontrá instituciones en Tucumán</h1><p>Explorá las instituciones y sus propuestas disponibles.</p></header><CatalogFilters kind="institutions" items={institutions} cities={cities} careers={careers} initialQuery={initialQuery}/></main><PublicFooter/></div>;
}
