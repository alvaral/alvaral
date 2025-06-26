"use client"; // necesario para usar Framer Motion en Next.js App Router

import React, { ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";

interface SectionProps {
  theme?: string;
  classes?: string;
  sectionHeight?: string;
  customHeight?: number;
  contentWidth?: string;
  horizontalAlign?: string;
  verticalAlign?: string;
  style?: CSSProperties;
  children?: ReactNode;
  isAlternate?: boolean; // fondo alternativo gris claro
}

const Section = ({
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

  return (
    <motion.section
      data-test="page-section"
      data-section-theme={theme}
      className={sectionClass}
      style={inlineStyle}
      data-controller="SectionWrapperController"
      data-active="true"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
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
        <div className="content">{children}</div>
      </div>
    </motion.section>
  );
};

export default Section;
