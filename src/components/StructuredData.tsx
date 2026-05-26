type StructuredDataProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

function stringifyStructuredData(data: StructuredDataProps["data"]) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: stringifyStructuredData(data) }}
    />
  );
}
