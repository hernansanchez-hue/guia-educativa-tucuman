"use client";
import {createContext,useContext} from 'react';
import {navigationContent,footerContent,orientationContent,resolvePublicNavigation} from '../data/publicSiteContent';
const defaults={navigation:navigationContent,footer:footerContent,orientation:orientationContent};
const Context=createContext(defaults);
export function PublicEditorialProvider({content,children}){return <Context.Provider value={{...defaults,...content,navigation:resolvePublicNavigation(content?.navigation||defaults.navigation)}}>{children}</Context.Provider>;}
export function usePublicEditorial(module){return useContext(Context)[module]||defaults[module];}
