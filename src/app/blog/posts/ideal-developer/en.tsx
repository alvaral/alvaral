import AuthorInfo from "@/components/AuthorInfoCard";
import HighlightedParagraph from "@/components/HighlightedParagraph";
import Section from "@/components/Section";
import PostHeading from "@/components/blogPost/PostHeading";
import { PostLayout } from "@/components/blogPost/PostLayout";
import PostParagraph from "@/components/blogPost/PostParagraph";

const author = {
  name: "Álvaro Alonso",
  avatar: "/assets/images/profile-photo.jpeg",
  role: "Software Engineer",
  infoUrl: "/about",
};

export default function IdealDeveloperPost() {
  return (
    <PostLayout title="The Ideal Software Developer">
      <Section key={1}>
        <PostParagraph>
          Consciously or unconsciously, we all have ideals—people who seem to
          have reached perfection in their craft. Like Cristiano Ronaldo or
          Messi in football, Warren Buffett in investing, or Christopher Nolan
          in filmmaking.
        </PostParagraph>

        <PostParagraph>
          So, if we were to close our eyes for a moment and imagine the perfect
          programmer, who would come to mind? Linus Torvalds? Margaret Hamilton?
          Mark Zuckerberg?
        </PostParagraph>

        <PostParagraph>
          All of them were—and are—brilliant programmers. Whether creating
          Linux, the Apollo 11 software that took humanity to the moon, or a
          social network that changed the world. Still, it would be unrealistic
          to think they never made mistakes or that their current abilities set
          an absolute standard.
        </PostParagraph>

        <PostParagraph>
          Sometimes, I like to imagine an anonymous developer who does
          everything right (for some reason, I picture them wearing a hoodie,
          focused on the keyboard). Other times, I think of Fernando, my
          coworker who sits next to me, calmly solving problems like he&apos;s
          peeling an orange.
        </PostParagraph>

        <PostParagraph className="mb-8">
          Either way, the figure of the ideal software engineer should have a
          series of traits to be considered the perfect developer. Here&apos;s
          my attempt at figuring out what those would be.
        </PostParagraph>
      </Section>
      <Section key={2}>
        <PostHeading level={1}>Technical Skills</PostHeading>

        <HighlightedParagraph>
          Technical skills (or hard skills) are the specific abilities that
          allow someone to perform particular tasks in a profession.
        </HighlightedParagraph>

        <PostParagraph>
          In software development, these skills let you build, maintain, and
          improve tech products in an efficient, secure, and scalable way. You
          know, all the stuff they teach us in university.
        </PostParagraph>

        <PostParagraph>
          We could write entire books about this (and many have), but here are
          some of the most important ones:
        </PostParagraph>

        <PostHeading level={2}>Programming fundamentals</PostHeading>

        <PostParagraph>
          A programmer should, at the very least, know how to code (duh). You
          know: a language, ifs, loops, variable types, execution flow… If
          you&apos;re reading this, you probably already have the basics. If
          not, time to brush up.
        </PostParagraph>

        <PostHeading level={2}>Data structures and algorithms</PostHeading>

        <PostParagraph>
          Now this is a bit tougher… but once you get it, it becomes really fun.
          To learn this, you need to have mastered the programming basics (and
          you can learn them in parallel).
        </PostParagraph>

        <PostParagraph>
          Simply put, data structures are ways to organize information (arrays,
          queues, stacks, trees, graphs…).
        </PostParagraph>

        <PostParagraph>
          Algorithms, on the other hand, are recipes to solve problems using
          those structures: like binary search or the sliding window technique.
        </PostParagraph>

        <PostParagraph>
          It&apos;s no coincidence that this comes up so much in interviews at
          big companies like Google, Meta, or Amazon.
        </PostParagraph>

        <PostHeading level={2}>Version control or Git</PostHeading>

        <PostParagraph>
          Knowing Git is almost as essential as knowing how to code. It&apos;s
          the “Ctrl+Z” of professional development. Ever needed to start over
          from scratch? That&apos;s what this is about.
        </PostParagraph>

        <PostParagraph>
          Being able to version, review, and collaborate without fear of
          breaking everything is one of the skills that brings me the most peace
          of mind.
        </PostParagraph>

        <PostHeading level={2}>Testing</PostHeading>

        <PostParagraph>
          It&apos;s not enough for code to work once (ask any tester). Tests
          ensure it keeps working after multiple changes. Knowing how to test
          (unit, integration, e2e…) is just as important as writing new code—and
          skipping tests because you&apos;re in a rush is a terrible habit.
        </PostParagraph>

        <PostHeading level={2}>Problem-solving (Debugging)</PostHeading>

        <PostParagraph className="mb-10">
          A huge part of development is fixing things that don&apos;t work. Yes,
          you&apos;ll get bugs in code you didn&apos;t write or understand—but
          that&apos;s your job. Debugging helps us understand what broke, why,
          and how to fix it without wasting hours going in circles.
        </PostParagraph>
      </Section>
      <Section key={3}>
        <PostHeading level={1}>Soft Skills</PostHeading>

        <HighlightedParagraph>
          Soft skills are personal and interpersonal abilities that enable
          communication, collaboration, and adaptation in various professional
          and social environments.
        </HighlightedParagraph>

        <PostParagraph>
          You could say they&apos;re what make us human. Or, as I put it: not
          being “a jerk.” Take Sheldon Cooper, for example—he may be a genius,
          but he struggles with people, and that limits him professionally. You
          can be the best coder in the world, but if you can&apos;t communicate,
          collaborate, or adapt, your impact will be limited.
        </PostParagraph>

        <PostHeading level={2}>Communication</PostHeading>

        <PostParagraph>
          Being able to explain a technical idea to a non-technical person (or
          someone from a different field) is a superpower. Do you think your
          manager or client fully understands the technology they&apos;re paying
          for? Good communication makes work smoother, reduces
          misunderstandings, and improves outcomes.
        </PostParagraph>

        <PostHeading level={2}>Teamwork</PostHeading>

        <PostParagraph>
          Two minds are better than one—if they don&apos;t step on each other.
          Knowing how to collaborate, listen, and give and receive feedback is
          what turns a good programmer into a great teammate.
        </PostParagraph>

        <PostHeading level={2}>Mental and Physical Health</PostHeading>

        <PostParagraph>
          We don&apos;t talk about this enough. Sleeping well, eating better,
          and disconnecting in time are key to clear thinking and stability.
          We&apos;re not machines—even if we live among them—and burnout is
          always lurking.
        </PostParagraph>

        <PostHeading level={2}>Design principles and good habits</PostHeading>

        <PostParagraph>
          Writing code that others can understand and maintain is an art.
          Following principles like SOLID, using design patterns, and keeping a
          clean architecture can be the difference between an elegant solution
          and a technical debt nightmare.
        </PostParagraph>

        <PostHeading level={2}>
          Inconsistency (yes, you read that right)
        </PostHeading>

        <PostParagraph>
          Accepting that we won&apos;t always be at 100%—that there will be bad
          days—is a skill in itself. The key is not giving up.
        </PostParagraph>

        <PostParagraph>
          That, in fact, is the difference between an amateur and a
          professional. An amateur does things out of passion, when they feel
          like it. A professional does it even when they don&apos;t feel like
          it. Would you want the surgeon about to operate on you to only do a
          good job when in a good mood?
        </PostParagraph>

        <PostParagraph>
          Absolute consistency is an illusion. What&apos;s real—and admirable—is
          pushing forward even when we fail or aren&apos;t at our best.
        </PostParagraph>

        <PostHeading level={2}>Creativity and reflection</PostHeading>

        <PostParagraph>
          Innovating, finding new solutions, and looking back to understand what
          worked (and what didn&apos;t) is what drives continuous improvement. A
          good developer doesn&apos;t just write code—they think about how to do
          it better.
        </PostParagraph>
      </Section>
      <Section key={4}>
        <PostHeading level={2}>Is the perfect programmer real?</PostHeading>

        <PostParagraph>
          Probably not. But like anything in life, we can aim to be the best
          version of ourselves by combining technical skills, human qualities,
          and above all, the humility to keep learning.
        </PostParagraph>

        <PostParagraph className="italic">
          And you—how do you imagine the ideal developer?
        </PostParagraph>
      </Section>
      <Section key={5}>
        <AuthorInfo
          name={author.name}
          role={author.role}
          avatar={author.avatar}
          infoUrl={author.infoUrl}
        />
      </Section>
    </PostLayout>
  );
}
