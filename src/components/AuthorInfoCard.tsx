import Link from "next/link";

interface AuthorInfoProps {
  name: string;
  role: string;
  avatar: string;
  infoUrl?: string;
}

export default function AuthorInfo({
  name,
  role,
  avatar,
  infoUrl,
}: AuthorInfoProps) {
  const content = (
    <div className="mt-12 flex justify-end items-start space-x-4 cursor-pointer">
      <div className="text-right">
        <p className="text-sm font-semibold font-sans text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
    </div>
  );

  if (infoUrl != null) {
    return <Link href={infoUrl}>{content}</Link>;
  }

  return content;
}
