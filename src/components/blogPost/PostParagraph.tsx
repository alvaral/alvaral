type PostParagraphProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PostParagraph({
  children,
  className = "mb-4",
}: PostParagraphProps) {
  return <p className={className}>{children}</p>;
}
