import Section from "./Section";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <Section>
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h4 className="text-xl font-semibold mb-4">alvaral</h4>
          <p className="mb-2">
            Follow me on{" "}
            <a
              href="https://www.instagram.com/alvaroalonsoprz"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Instagram
            </a>
          </p>
          <p className="mb-1">Business email</p>
          <p className="text-gray-600">alvaroalonso222@gmail.com</p>
        </div>
      </Section>
    </footer>
  )
}
