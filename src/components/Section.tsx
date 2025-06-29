"use client";

import React, { ReactNode, CSSProperties, useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface SectionProps {
  index?: number, 
  theme?: string;
  classes?: string;
  sectionHeight?: string;
  customHeight?: number;
  contentWidth?: string;
  horizontalAlign?: string;
  verticalAlign?: string;
  style?: CSSProperties;
  children?: ReactNode;
  isAlternate?: boolean;
  limitContentWidth?: boolean;
  delay?: number;
}

const Section = ({
  index = 0,  // default 0 si no se pasa
  theme = "",
  classes = "",
  sectionHeight = "custom",
  customHeight = 10,
  contentWidth = "wide",
  horizontalAlign = "center",
  verticalAlign = "middle",
  style = {},
  children,
  isAlternate = false,
  limitContentWidth = true,
  delay = 0
}: SectionProps) => {
  const sectionClass = `
    page-section
    full-bleed-section
    layout-engine-section
    background-width--full-bleed
    section-height--${sectionHeight}
    content-width--${contentWidth}
    horizontal-alignment--${horizontalAlign}
    vertical-alignment--${verticalAlign}
    ${isAlternate ? "bg-gray-100" : ""}
    ${theme}
    ${classes}
  `.trim().replace(/\s+/g, " ");

  const inlineStyle = {
    minHeight: `${customHeight}vh`,
    ...style,
  };

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  useEffect(() => {
    // Forzar animación si no se ejecutó en 3 segundos
    const timeout = setTimeout(() => {
      controls.start("visible");
    }, 1500);

    return () => clearTimeout(timeout);
  }, [controls]);

  return (
    <motion.section
      ref={ref}
      className={sectionClass}
      style={inlineStyle}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
      }}
      // delay proporcional al índice para que aparezca en orden
      transition={{ duration: 1, ease: "easeOut", delay: index * 0.3 + delay }}
    >
      <div className="section-border">
        <div className="section-background"></div>
      </div>
      <div
        className="content-wrapper"
        style={{
          paddingTop: `calc(${customHeight}vmax / 10)`,
        }}
      >
        <div className={`content ${limitContentWidth ? "max-w-[750px] mx-auto" : ""}`}>
          {children}
        </div>
      </div>
    </motion.section>
  );
};

export default Section;