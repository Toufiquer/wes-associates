Look at the folder 'src/app/[...pageTitle]/page.tsx' and Update all file with the following instructions.


now generate a file name gtm-event-fire.ts and it will fire the event if some one visit render dynamic page. and implement full functionality. 

here is an example of event fire 
```
'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';

const GtmRouteChangeInner = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasSkippedInitialPageView = useRef(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GTM_ID) return;

    if (!hasSkippedInitialPageView.current) {
      hasSkippedInitialPageView.current = true;
      return;
    }

    const query = searchParams.toString();

    sendGTMEvent({
      event   : 'page_view',
      ...
    });
  }, [pathname, searchParams]);

  return null;
};

const GtmRouteChange = () => (
  <Suspense fallback={null}>
    <GtmRouteChangeInner />
  </Suspense>
);

export default GtmRouteChange;
```

And make sure it will fire once and it will fire dynamic page name and page rote.
