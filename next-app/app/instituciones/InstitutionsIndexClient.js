"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import PublicFooter from "../components/PublicFooter";
import PublicHeader from "../components/PublicHeader";
import "../[ciudad]/ciudad.css";
import "./instituciones.css";
export default function InstitutionsIndexClient({ institutions }) { const [query, setQuery] = useState(""); const shown = institutions.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) || item.type.toLowerCase().includes(query.toLowerCase())); return <div className="app-shell"><PublicHeader /><main className="institutions-page"><header className="institutions-intro"><span>INSTITUCIONES</span><h1>Encontrá instituciones en Tucumán</h1><p>Explorá las instituciones y sus propuestas disponibles.</p><input aria-label="Buscar instituciones" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar institución..." /></header><section className="institutions-index-grid">{shown.map((item) => <Link href={`/instituciones/${item.slug}`} key={item.slug}><img src={item.image} alt="" /><div><small>{item.type}</small><h2>{item.name}</h2><p>{item.venues.length} {item.venues.length === 1 ? "sede" : "sedes"} en Tucumán</p><strong>Ver institución →</strong></div></Link>)}</section></main><PublicFooter /></div>; }
