Look at the folder 'src/app/components/assets' and Update all file with the following instructions.

Page-101
    - 'src/app/components/assets/assets-1/data.ts'
    - 'src/app/components/assets/assets-1/Mutation.tsx'
    - 'src/app/components/assets/assets-1/Query.tsx'
    - 'src/app/components/assets/assets-1/RenderItem.tsx'

now generate a file name gtm-event-fire.ts and it will fire when some one click 'Buy Now' Button

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
      event: 'add_to_cart',
currency                    string
value                       number
items                       Array<Item>
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

And make sure it will fire once and it will fire dynamic data not default data in data.ts

If I click buy now button then it will be fire add_to_cart event with currency                    string
value                       number
items                       Array<Item> 

data