import Section from "../Section";

type PostLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function PostLayout({ title, children }: PostLayoutProps) {
  return (
    <main className="px-4 md:px-6 lg:px-0 py-12 font-serif text-[#1A1A1A] bg-white">
      <article className="max-w-[680px] mx-auto text-[1.05rem] leading-7">
        <h1 className="text-[2.2rem] leading-tight font-bold font-sans mb-6">
          {title}
        </h1>
        {children}
      </article>
    </main>
  );
}
