import{r as s,j as e}from"./app-ixndsVVo.js";const j=s.forwardRef(function({type:l="text",className:n="",isFocused:t=!1,error:c=!1,disabled:x=!1,icon:o=null,onIconClick:u=null,...d},g){const r=s.useRef(null),[p,f]=s.useState(!1);s.useImperativeHandle(g,()=>({focus:()=>r.current?.focus(),blur:()=>r.current?.blur(),value:r.current?.value})),s.useEffect(()=>{t&&r.current?.focus()},[t]);const b=`
        w-full px-4 py-3 border rounded-lg transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        dark:bg-gray-800 dark:text-white dark:border-gray-600
    `,v=c?"border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400":"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-gray-600",h=p?"ring-2 ring-offset-1":"";return e.jsxs("div",{className:"relative",children:[e.jsx("input",{...d,type:l,disabled:x,className:`
                    ${b}
                    ${v}
                    ${h}
                    ${o?"pr-10":""}
                    ${n}
                `,ref:r,onFocus:i=>{f(!0),d.onFocus?.(i)},onBlur:i=>{f(!1),d.onBlur?.(i)}}),o&&e.jsx("div",{className:`
                        absolute inset-y-0 right-0 pr-3 flex items-center
                        ${u?"cursor-pointer":"pointer-events-none"}
                    `,onClick:u,children:e.jsx(o,{className:`h-5 w-5 ${c?"text-red-500":"text-gray-400"} ${u?"hover:text-gray-600 dark:hover:text-gray-300":""}`})})]})});function y({message:a,className:l="",showIcon:n=!0,...t}){return a?e.jsxs("div",{...t,className:`
                flex items-center gap-2 mt-1 text-sm transition-all duration-200
                text-red-600 dark:text-red-400
                ${l}
            `,role:"alert",children:[n&&e.jsx("svg",{className:"h-4 w-4 flex-shrink-0",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 极 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})}),e.jsx("span",{children:a})]}):null}export{y as I,j as T};
