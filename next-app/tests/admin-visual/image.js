/* eslint-disable @next/next/no-img-element -- A test-only replacement for next/image. */
export default function Image({priority,fill,unoptimized,...props}){void priority;void fill;void unoptimized;return <img {...props} alt={props.alt||''}/>;}
