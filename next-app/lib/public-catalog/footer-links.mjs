const required = [
 ["instituciones","Instituciones","/instituciones"],
 ["carreras","Carreras","/carreras"],
 ["docentes","Cursos Docentes","/cursos-docentes"],
 ["servicios","Servicios","/servicios"],
 ["nosotros","Nosotros","/nosotros"],
 ["contacto","Contacto","/contacto"],
];
// Events remain public through contextual links, not through footer navigation.
function isEventDestination(item) {
 if(item.id==="eventos")return true;
 try{return /^\/eventos(?:\/|$)/.test(new URL(item.href,"https://guiaeducativatuc.com.ar").pathname);}
 catch{return false;}
}
// Keep published custom destinations, but never show a duplicate or a demo action.
export function publicFooterLinks(items=[]) {
 const existing=items.filter(item=>item.visible!==false&&item.href&&!isEventDestination(item)).map(item=>({...item,href:item.href==="/ciudades"?"/#ciudades":item.href}));
 const result=required.map(([id,label,href])=>({...existing.find(item=>item.href===href),id,label,href}));
 const seen=new Set(result.map(item=>item.href));
 for(const item of existing)if(!seen.has(item.href)){result.push(item);seen.add(item.href);}
 return result;
}

