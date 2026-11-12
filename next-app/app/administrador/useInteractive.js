'use client';
import {useSyncExternalStore} from 'react';

const subscribe = () => () => {};
const ready = () => true;
const loading = () => false;
// Never submit an editorial form via the browser's fallback GET before hydration.
export default function useInteractive() {
  return useSyncExternalStore(subscribe, ready, loading);
}
