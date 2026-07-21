'use client';

import { useEffect, useMemo, useRef } from 'react';

import { trackPreviewPageView } from '@/lib/fbp-and-gtm';
import { trackTikTokEvent } from '@/lib/tiktok-pixel';

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
    trackTikTokEvent('ViewContent', {
      content_id: pageId || pagePath,
      content_type: 'page_preview',
      content_name: pageName,
      page_path: pagePath,
    });
  }, [eventKey, pageId, pageName, pagePath]);

  return null;
};

export default PreviewPageTracking;
