import {
  forwardRef,
  type SelectHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";

interface AppSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  containerClassName?: string;
}

const AppSelect = forwardRef<HTMLSelectElement, AppSelectProps>(
  function AppSelect(
    {
      className = "",
      containerClassName = "",
      children,
      ...props
    },
    ref
  ) {
    return (
      <div className={`relative ${containerClassName}`}>
        <select
          ref={ref}
          {...props}
          className={`w-full appearance-none rounded-xl border border-neutral-800 bg-[#090909] px-3 py-2.5 pr-10 text-sm text-white outline-none transition-all [color-scheme:dark] hover:border-neutral-700 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
          {children}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
        />
      </div>
    );
  }
);

export default AppSelect;