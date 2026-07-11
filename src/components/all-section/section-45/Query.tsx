import { defaultDataSection45, ISection45Data, Section45Props } from './data';

const QuerySection45 = ({ data }: Section45Props) => {
  const settings: ISection45Data = { ...defaultDataSection45, ...data };

  return (
    <main>
      <section className="bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600">
              <i className="ti ti-star-filled text-sm text-yellow-400" /> {settings.badgeText}
            </span>
            <h2 className="mb-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">{settings.title}</h2>
            <p className="text-sm text-gray-500">{settings.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-4">
            {settings.videos.map((video, index) => (
              <a
                href={video.link}
                key={video.id}
                className={`card-hover animate-fadeUp-${index + 1} relative aspect-video cursor-pointer overflow-hidden rounded-xl`}
                style={{ background: video.backgroundColor }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/60 to-transparent p-3">
                  <div className="play-hover mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-red-600">
                    <i className="ti ti-player-play-filled text-lg text-white" />
                  </div>
                  <p className="text-center text-xs font-bold leading-snug text-white">{video.label}</p>
                  <p className="mt-0.5 text-center text-[10px] text-white/60">{video.sub}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default QuerySection45;

