interface HighlightedParagraphProps {
    children: React.ReactNode;
  }
  
  export default function HighlightedParagraph({ children }: HighlightedParagraphProps) {
    return (
      <p className="border-l-4 border-black-500 pl-4 italic mb-4">
        {children}
      </p>
    );
  }
  