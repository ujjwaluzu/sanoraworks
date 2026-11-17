import { useId } from "react";
import { LogoRevealMotion } from "./LogoRevealMotion";
import styles from "./logo-reveal.module.css";

const mark = "/brand/sanoraworks-mark.png";
export function LogoReveal() {
  const id = `about-reveal-${useId().replaceAll(":", "")}`;
  return (
    <LogoRevealMotion>
      <svg className={styles.art} viewBox="0 0 560 440" role="img" aria-labelledby={`${id}-title`} focusable="false">
        <title id={`${id}-title`}>SanoraWorks. Diagonal fragments assemble into the SW mark, followed by a light sweep and the wordmark.</title>
        <defs>
          {Array.from({ length: 9 }, (_, i) => {
            const y = -50 + i * 50;
            return <clipPath key={i} id={`${id}-slice-${i}`}><path d={`M0 ${y} 437 ${y - 65}V${y - 15}L0 ${y + 50}Z`} /></clipPath>;
          })}
          <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="437" height="299" style={{ maskType: "alpha" }}><image href={mark} width="437" height="299" /></mask>
          <linearGradient id={`${id}-shine`}><stop stopColor="white" stopOpacity="0" /><stop offset=".6" stopColor="white" stopOpacity=".85" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient>
        </defs>
        <g data-reveal="guides" visibility="hidden" opacity="0" style={{ transformOrigin: "280px 195px" }}>
          <path d="M43 91V39h52m370 0h52v52M43 294v52h52m370 0h52v-52" fill="none" stroke="var(--cobalt-line)" strokeWidth="1.5" />
          <path d="M280 17v22m0 307v22M21 193h22m474 0h22" stroke="var(--line)" />
          {[105, 155, 205, 255, 305].map((y, i) => <path key={y} d={`M${i % 2 ? 47 : 499} ${y}h14`} stroke="var(--cobalt-line)" strokeWidth="1" />)}
          <path d="M61 349 499 284" stroke="var(--cobalt-line)" strokeDasharray="3 7" />
        </g>
        <g transform="translate(61.5 44)">
          <g data-reveal="ghost" opacity="0"><rect width="437" height="299" fill="var(--ink)" mask={`url(#${id}-mask)`} /></g>
          <g data-reveal="echo" opacity="0" style={{ transformOrigin: "218.5px 149.5px" }}><image href={mark} width="437" height="299" /></g>
          {Array.from({ length: 9 }, (_, i) => <g key={i} data-reveal={`slice-${i}`} style={{ transformOrigin: "218.5px 149.5px" }}><g clipPath={`url(#${id}-slice-${i})`}><image href={mark} width="437" height="299" /></g></g>)}
          <image data-reveal="complete" href={mark} width="437" height="299" />
          <g mask={`url(#${id}-mask)`}><g data-reveal="sweep" opacity="0"><path d="M-80 0H0L-110 299h-80Z" fill={`url(#${id}-shine)`} /><path d="M0 0-110 299" stroke="white" strokeWidth="1.2" /></g></g>
        </g>
        <g data-reveal="wordmark"><image href="/brand/sanoraworks-lettering.png" x="118" y="362" width="324" height="61" /></g>
        <path data-reveal="underline" opacity=".5" d="M247 436h66" stroke="var(--cobalt)" strokeWidth="2" style={{ transformOrigin: "280px 436px" }} />
      </svg>
    </LogoRevealMotion>
  );
}
