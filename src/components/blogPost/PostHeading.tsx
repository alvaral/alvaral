type PostHeadingProps = {
  level: 1 | 2;
  children: React.ReactNode;
};

export default function PostHeading({ level, children }: PostHeadingProps) {
  const common = "font-sans font-bold mb-4";
  if (level === 1) {
    return <h1 className={`text-[1.6rem] ${common}`}>{children}</h1>;
  }
  return <h2 className="text-[1.2rem] font-semibold mt-10 mb-3">{children}</h2>;
}
