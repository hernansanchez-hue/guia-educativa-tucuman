'use client';
import {useEffect,useRef} from 'react';

// The parent editor owns the portal, this document owns its hydration.
// No React subtree is inserted into this document before it is ready.
export default function PreviewMount(){
  const host=useRef(null);
  useEffect(()=>{
    const target=document.createElement('div');
    target.id='gc-preview-root';
    host.current.appendChild(target);
    if(window.parent!==window)window.parent.postMessage('get:private-preview-ready',window.location.origin);
    return ()=>target.remove();
  },[]);
  return <div ref={host}/>;
}
