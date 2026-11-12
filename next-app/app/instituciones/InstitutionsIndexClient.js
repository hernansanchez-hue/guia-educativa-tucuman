"use client";
import EightDesignShell from '../components/approved/EightDesignShell';
import CatalogFilters from '../components/CatalogFilters';
import PublicImage from '../components/PublicImage';
export default function InstitutionsIndexClient({institutions,cities=[],careers=[],initialQuery='',initialFilters={}}){
 return <EightDesignShell><main className="institutions-page" data-catalog="instituciones"><header className="institutions-intro"><div className="hero-copy"><span>INSTITUCIONES</span><h1>Encontrá instituciones <em>en Tucumán</em></h1><p>Explorá las instituciones y sus propuestas disponibles.</p></div><figure className="hero-art photo" aria-hidden="true"><PublicImage src="/assets/approved/eight/instituto.webp" alt="" width={600} height={360} sizes="(max-width:730px) 100vw, 45vw" priority/></figure></header><CatalogFilters kind="institutions" items={institutions} cities={cities} careers={careers} initialQuery={initialQuery} initialFilters={initialFilters}/></main></EightDesignShell>;
}
