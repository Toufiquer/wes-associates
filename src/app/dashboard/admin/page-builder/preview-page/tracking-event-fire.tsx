'use client';

import { useEffect, useMemo, useRef } from 'react';

import { trackPreviewPageView } from '@/lib/fbp-and-gtm';

interface PreviewPageTrackingProps {
  pageId?: string;
  pageName: string;
  pagePath: string;
}

const firedPreviewKeys = new Set<string>();

const PreviewPageTracking = ({ pageId, pageName, pagePath }: PreviewPageTrackingProps) => {
  const hasFired = useRef(false);
  const eventKey = useMemo(() => `${pageId || pagePath}:${pageName}`, [pageId, pageName, pagePath]);

  useEffect(() => {
    if (hasFired.current || firedPreviewKeys.has(eventKey)) return;

    hasFired.current = true;
    firedPreviewKeys.add(eventKey);

    trackPreviewPageView({
      pageId,
      pageName,
      pagePath,
      previewPath: window.location.pathname,
    });
  }, [eventKey, pageId, pageName, pagePath]);

  return null;
};

export default PreviewPageTracking;
