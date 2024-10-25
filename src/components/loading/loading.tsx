import { BCGovLogo } from './BC Logo';

export const LoadingScreen = () => {
  return (
    <section className="tg-bg-slate-100 dark:tg-bg-slate-900 tg-relative tg-place-items-center tg-grid tg-h-screen tg-w-screen tg-gap-4">
      <div className="tg-bg-slate-200 dark:tg-bg-slate-500 tg-w-48 tg-h-48 tg- tg-absolute tg-animate-ping tg-rounded-full tg-delay-5s tg-shadow-xl"></div>
      <div className="tg-bg-slate-500 dark:tg-bg-slate-400 tg-w-32 tg-h-32 tg-absolute tg-animate-ping tg-rounded-full tg-shadow-xl"></div>
      <BCGovLogo />
    </section>
  );
};
