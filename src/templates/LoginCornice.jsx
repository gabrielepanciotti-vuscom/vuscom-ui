import ThemeToggle from "../theme/ThemeToggle.jsx";
import { LOGHI_VUSCOM } from "../brand/Brand.jsx";

/** The login card frame (gradient, theme toggle, logo pair, title): shared by every login screen. */
export default function LoginCornice({
  title,
  subtitle,
  logoLight = LOGHI_VUSCOM.marchioChiaro,
  logoDark = LOGHI_VUSCOM.marchioScuro,
  children,
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 px-4 dark:from-slate-900 dark:to-slate-800">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-2xl">
        <div className="text-center">
          <img
            src={logoLight}
            alt="VUS COM"
            className="mx-auto h-20 w-auto object-contain dark:hidden"
          />
          <img
            src={logoDark}
            alt="VUS COM"
            className="mx-auto hidden h-20 w-auto object-contain dark:block"
          />
          <h1 className="mt-6 text-3xl font-bold text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
