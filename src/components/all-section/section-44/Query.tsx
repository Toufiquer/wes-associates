import { defaultDataSection44, ISection44Data, Section44Props } from './data';

const QuerySection44 = ({ data }: Section44Props) => {
  const settings: ISection44Data = { ...defaultDataSection44, ...data };

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-14 text-center sm:py-20">
          <div className="animate-fadeUp">
            <span className="mb-5 inline-block rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-white">
              {settings.badgeText}
            </span>
            <h1 className="mb-4 text-3xl font-black leading-tight sm:text-5xl">
              {settings.titleLine1}
              <br />
              {settings.titleLine2}
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-base text-blue-100 sm:text-lg">{settings.subtitle}</p>
          </div>
          <div className="animate-fadeUp mb-8 flex flex-wrap justify-center gap-8">
            {settings.stats.map(item => (
              <div key={item.id} className="text-center">
                <p className="text-3xl font-black">{item.value}</p>
                <p className="mt-0.5 text-xs text-blue-200">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="animate-fadeUp flex flex-wrap justify-center gap-2.5">
            {settings.features.map(item => (
              <span key={item.id} className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-medium text-white">
                <i className={`ti ${item.icon} text-sm`} /> {item.label}
              </span>
            ))}
          </div>
        </div>
        <div className="text-gray-50">
          <svg viewBox="0 0 1440 56" fill="currentColor" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="block h-8 w-full sm:h-14">
            <path d="M0,32 C360,64 1080,0 1440,32 L1440,56 L0,56 Z" />
          </svg>
        </div>
      </section>
    </main>
  );
};

export default QuerySection44;

