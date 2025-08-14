interface CTAButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  href?: string;
}

export function CTAButton({ onClick, children, href }: CTAButtonProps) {
  const defaultText = "START MY AI EMPIRE NOW - $39/month";
  
  const handleClick = () => {
    if (href) {
      window.location.href = href;
    } else if (onClick) {
      onClick();
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className="
        inline-flex items-center justify-center
        text-lg font-bold text-white
        px-8 py-4
        bg-green-600 hover:bg-green-700 active:bg-green-800
        rounded-lg shadow-lg hover:shadow-xl
        transform hover:scale-105 active:scale-95
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50
        border-2 border-transparent hover:border-green-500
        min-w-max
        cursor-pointer
        select-none
      "
      type="button"
    >
      <span className="relative">
        {children || defaultText}
      </span>
    </button>
  );
}