interface DividerProps {
    height?: string; // acepta valores de tailwind (p.ej. "my-12") o unidades CSS (p.ej. "3rem")
  }
  
export default function Divider({ 
    height = "my-12" 
}:  DividerProps) {
    return <div className={height} />;
}