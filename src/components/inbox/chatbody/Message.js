export default function Message({ justify, message, select }) {
    return (
        <li className={`flex justify-${justify} my-2`}>
            <div
                className={`relative max-w-xl px-4 py-2 text-gray-700  rounded shadow ${
                    select && "bg-gray-300"
                }`}
            >
                <span className="block">{message}</span>
            </div>
        </li>
    );
}
