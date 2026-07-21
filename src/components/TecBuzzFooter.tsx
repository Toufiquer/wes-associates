/*
|-----------------------------------------
| setting up TecBuzzFooter for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: webapp, July, 2026
|-----------------------------------------
*/

import Link from 'next/link';

const TecBuzzFooter = () => {
  return (
    <footer className="mb-20 bg-black px-4 py-4 text-center text-sm text-white md:mb-0 md:text-right">
      <div className="bg-black text-stone-300">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 pt-0 pb-0 text-xs md:flex-row md:px-12 lg:px-24">
          <p>
            Design and Develop by
            <Link
              href="https://tecbuzz.bd"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-white underline-offset-4 transition-opacity hover:opacity-75 hover:underline"
            >
              TecBuzz
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};
export default TecBuzzFooter;
