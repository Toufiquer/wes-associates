import { defaultDataSection46, ISection46Data, Section46Props } from './data';

const QuerySection46 = ({ data }: Section46Props) => {
  const settings: ISection46Data = { ...defaultDataSection46, ...data };

  return (
    <main>
      <a
        href={settings.link}
        className="block cursor-pointer select-none px-4 py-5 text-center text-lg font-extrabold tracking-wide text-white transition-opacity hover:opacity-95 sm:text-xl"
        style={{ backgroundImage: `linear-gradient(to right, ${settings.gradientFrom}, ${settings.gradientTo})` }}
      >
        {settings.text}
      </a>
    </main>
  );
};

export default QuerySection46;

