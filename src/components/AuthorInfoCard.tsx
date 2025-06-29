
interface AuthorInfoProps {
    name: string;
    role: string;
    avatar: string;
  }
  
export default function AuthorInfo({ name, role, avatar }: AuthorInfoProps) {
    return (
        <div className="mt-12 flex justify-end items-center space-x-4">
        <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
        />
        <div className="text-right">
            <p className="text-sm font-semibold font-sans text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">{role}</p>
        </div>
        </div>
    );
}