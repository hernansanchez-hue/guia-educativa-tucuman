export function heroStyle(design) {
 if(!design)return undefined;
 return { ...(design.titleSize?{fontSize:`clamp(28px, 4vw, ${Math.max(32,Math.min(80,design.titleSize))}px)`}:{}), ...(design.color&&/^#[0-9a-f]{6}$/i.test(design.color)?{color:design.color}:{}), ...(design.align==='center'?{textAlign:'center'}:{}) };
}
