import AuthorInfo from "@/components/AuthorInfoCard";
import HighlightedParagraph from "@/components/HighlightedParagraph";
import Section from "@/components/Section";
import PostHeading from "@/components/blogPost/PostHeading";
import { PostLayout } from "@/components/blogPost/PostLayout";
import PostParagraph from "@/components/blogPost/PostParagraph";

const author = {
  name: "Álvaro Alonso",
  avatar: "/assets/images/profile-photo.webp",
  role: "Software Engineer",
  infoUrl: "/about",
};

export default function FrontendVsBackendPost() {
  return (
    <PostLayout title="Frontend vs Backend: Two Halves of the Same Whole">
      <Section key={1}>
        <PostParagraph>
          If software were a rock band, the frontend would be the lead
          singer—the one who gets the applause, who&apos;s in all the photos,
          who the audience sees. The backend, on the other hand, would be the
          quiet bassist holding everything together without most people
          noticing. Without one, the other doesn&apos;t shine. Without the
          other, there&apos;s no show.
        </PostParagraph>

        <PostParagraph>
          Sometimes, when someone starts in programming, they hear these terms
          like they&apos;re rival tribes: &quot;the ones who make pretty
          screens&quot; vs &quot;the ones who build serious stuff.&quot; But in
          reality, frontend and backend are like the yin and yang of modern
          development—opposites in appearance, complementary in essence.
        </PostParagraph>
      </Section>

      <Section key={2}>
        <PostHeading level={1}>The Frontend Universe</PostHeading>

        <HighlightedParagraph>
          The frontend is what the user touches, sees, and feels. It&apos;s the
          visible layer of applications, where design and logic meet to create
          experiences.
        </HighlightedParagraph>

        <PostParagraph>
          This is where technologies like HTML, CSS, and JavaScript live, along
          with frameworks like React, Vue, or Angular. These are the tools that
          make a button move smoothly, colors change on hover, or text adapt to
          your screen size without breaking.
        </PostParagraph>

        <PostParagraph>
          A good frontend developer is part artist, part engineer—combining
          aesthetics with precision. They understand color palettes, typography,
          accessibility… but also performance, state management, and
          asynchronous events. It&apos;s no coincidence that many compare
          frontend work to architecture or graphic design: both seek harmony
          between form and function.
        </PostParagraph>

        <PostParagraph>
          And yes, sometimes it can be hell. Browsers don&apos;t always behave
          the same way, a CSS property might look different in Safari and
          Chrome, and a bug can mysteriously disappear after an{" "}
          <code>npm install</code>. But when everything clicks, it&apos;s pure
          satisfaction: the interface comes to life and the user smiles without
          knowing how many lines of code are behind that natural gesture.
        </PostParagraph>
      </Section>

      <Section key={3}>
        <PostHeading level={1}>The Backend World</PostHeading>

        <HighlightedParagraph>
          If the frontend builds the facade, the backend builds the foundation.
          It&apos;s the set of invisible processes that make everything work:
          storing users, authenticating, processing payments, sending emails, or
          keeping data secure.
        </HighlightedParagraph>

        <PostParagraph>
          Here, the spotlight goes to languages like Python, Java, Go, Node.js,
          or PHP. Also databases (SQL or NoSQL), servers, APIs, and business
          logic. The backend developer thinks about performance, security, data
          integrity, and architecture. While the frontend worries about how it
          looks, the backend worries about <em>what happens</em> when you click.
        </PostParagraph>

        <PostParagraph>
          There&apos;s something magical about the backend: you work in the
          shadows, without pretty interfaces, but each line of code can enable a
          million users to connect without crashing the system. It&apos;s a
          place for analytical, patient minds obsessed with efficiency. And
          although it doesn&apos;t always get the same visual recognition, its
          impact is deep and silent—like a good bass line in a song.
        </PostParagraph>
      </Section>

      <Section key={4}>
        <PostHeading level={1}>
          The Middle Ground (and Meeting Point)
        </PostHeading>

        <PostParagraph>
          Between both worlds exists a bridge: APIs. They&apos;re like a common
          language, a peace treaty. The frontend asks; the backend responds.
          &quot;Give me the user data.&quot; &quot;Here you go.&quot; &quot;Save
          this preference.&quot; &quot;Done.&quot;
        </PostParagraph>

        <PostParagraph>
          And that&apos;s where the <strong>full stack developer</strong>{" "}
          appears—that hybrid creature who understands both sides. They know how
          to structure a database and how to animate a menu. Maybe they&apos;re
          not experts in everything, but they can build an application from
          start to finish, which has its own magic: seeing the entire process,
          from click to persisted data.
        </PostParagraph>
      </Section>

      <Section key={5}>
        <PostHeading level={1}>Two Sides of the Same Coin</PostHeading>

        <PostParagraph>
          The truth is, there&apos;s no competition between frontend and
          backend. There&apos;s collaboration. A great product requires both:
          someone to make it look good and someone to make it work well.
        </PostParagraph>

        <PostParagraph>
          The best frontend in the world collapses without a solid backend, and
          the most powerful backend is wasted if nobody can use it easily.
          It&apos;s like a good movie: the script matters as much as the
          cinematography.
        </PostParagraph>

        <PostParagraph>
          So next time someone tells you &quot;frontend is more fun&quot; or
          &quot;backend is more important,&quot; you can smile and think:
          without both, the application wouldn&apos;t exist.
        </PostParagraph>

        <PostParagraph className="italic">
          And you—which side of the stage would you like to play on?
        </PostParagraph>
      </Section>

      <Section key={6}>
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
