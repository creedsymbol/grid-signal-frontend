export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white rounded-3xl border border-black/5 shadow-[0_2px_24px_rgba(30,27,75,0.06)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
