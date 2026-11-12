import {useMemo} from 'react';
export const usePathname=()=>window.location.pathname;
export const useSearchParams=()=>new URLSearchParams(window.location.search);
export function useRouter(){return useMemo(()=>({push:href=>location.assign(href),replace:href=>location.replace(href),refresh:()=>{ /* RSC refresh preserves client state; there is no RSC server in this isolated harness. */ }}),[]);}
export function notFound(){throw new Error('Fixture no disponible');}
export function redirect(url){location.assign(url);}
