'use client';

import { sendGTMEvent } from '@next/third-parties/google';

import { trackMetaEvent } from '@/lib/facebook-pixel';

export interface PreviewPageTrackingData {
  pageId?: string;
  pageName: string;
  pagePath: string;
  previewPath: string;
}

export interface ApplicationSubmissionTrackingData {
  applicationId?: string;
  selectedCountry?: string;
  selectedUniversity?: string;
  selectedCourseName?: string;
  documentCount: number;
}

export const trackPreviewPageView = ({ pageId, pageName, pagePath, previewPath }: PreviewPageTrackingData) => {
  if (process.env.NEXT_PUBLIC_GTM_ID) {
    sendGTMEvent({
      event: 'preview_page_view',
      page_id: pageId,
      page_name: pageName,
      page_path: pagePath,
      preview_path: previewPath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }

  trackMetaEvent('ViewContent', {
    content_name: pageName,
    content_category: 'Page Builder Preview',
    content_ids: pageId ? [pageId] : undefined,
    page_path: pagePath,
  });
};

export const trackApplicationSubmission = ({
  applicationId,
  selectedCountry,
  selectedUniversity,
  selectedCourseName,
  documentCount,
}: ApplicationSubmissionTrackingData) => {
  if (process.env.NEXT_PUBLIC_GTM_ID) {
    sendGTMEvent({
      event: 'submit_application',
      application_id: applicationId,
      application_status: 'submitted',
      selected_country: selectedCountry || undefined,
      selected_university: selectedUniversity || undefined,
      selected_course: selectedCourseName || undefined,
      document_count: documentCount,
      page_path: window.location.pathname,
      page_location: window.location.href,
    });
  }

  trackMetaEvent('SubmitApplication', {
    content_name: 'Student Application',
    content_category: 'Study Abroad Application',
    application_id: applicationId,
    status: 'submitted',
    selected_country: selectedCountry || undefined,
    selected_university: selectedUniversity || undefined,
    selected_course: selectedCourseName || undefined,
    document_count: documentCount,
  });
};
