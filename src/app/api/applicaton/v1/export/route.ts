import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import JSZip from 'jszip';
import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import connectToDB from '@/app/api/utils/mongoose';
import { isUserHasAccessByRole } from '@/app/api/utils/is-user-has-access-by-role';

import StudentApplication from '../model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ApplicationDocument {
  kind?: string;
  label?: string;
  name?: string;
  url?: string;
  type?: string;
}

interface ApplicationRecord {
  _id: { toString(): string } | string;
  ownerEmail?: string;
  fullName?: string;
  mobileWhatsApp?: string;
  age?: number;
  fatherName?: string;
  motherName?: string;
  englishProficiency?: string;
  englishScore?: string;
  otherCurriculum?: string;
  selectedCountry?: string;
  selectedUniversity?: string;
  selectedCourseName?: string;
  status?: string;
  adminNote?: string;
  documents?: ApplicationDocument[];
  createdAt?: Date | string;
}

const safeName = (value: unknown, fallback: string) => {
  const normalized = String(value || '')
    .trim()
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/[. ]+$/g, '')
    .slice(0, 100);
  return normalized || fallback;
};

const fieldParagraph = (label: string, value: unknown) =>
  new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun({ text: String(value || 'Not provided') }),
    ],
    spacing: { after: 100 },
  });

const applicationDocx = async (application: ApplicationRecord) => {
  const uploadedDocuments = application.documents || [];
  const document = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: 'University Application', heading: HeadingLevel.TITLE, spacing: { after: 240 } }),
          new Paragraph({ text: 'Personal information', heading: HeadingLevel.HEADING_1 }),
          fieldParagraph('Full name', application.fullName),
          fieldParagraph('Mobile/WhatsApp number', application.mobileWhatsApp),
          fieldParagraph('Email', application.ownerEmail),
          fieldParagraph('Age', application.age),
          fieldParagraph("Father's name", application.fatherName),
          fieldParagraph("Mother's name", application.motherName),
          fieldParagraph('English test', application.englishProficiency),
          fieldParagraph('English test score', application.englishScore),
          fieldParagraph('Other curriculum activities', application.otherCurriculum),
          new Paragraph({ text: 'Study destination', heading: HeadingLevel.HEADING_1, spacing: { before: 240 } }),
          fieldParagraph('Country', application.selectedCountry),
          fieldParagraph('University', application.selectedUniversity),
          fieldParagraph('Course/Subject', application.selectedCourseName),
          new Paragraph({ text: 'Application details', heading: HeadingLevel.HEADING_1, spacing: { before: 240 } }),
          fieldParagraph('Status', application.status),
          fieldParagraph('Admin note', application.adminNote),
          fieldParagraph('Submitted at', application.createdAt ? new Date(application.createdAt).toLocaleString() : ''),
          new Paragraph({ text: 'Uploaded files', heading: HeadingLevel.HEADING_1, spacing: { before: 240 } }),
          ...(uploadedDocuments.length
            ? uploadedDocuments.map(item => fieldParagraph(item.label || item.kind || 'Document', item.name))
            : [new Paragraph('No uploaded files')]),
        ],
      },
    ],
  });

  return Packer.toBuffer(document);
};

const uniqueFileName = (usedNames: Set<string>, requestedName: string) => {
  const safeFileName = safeName(requestedName, 'document');
  const dotIndex = safeFileName.lastIndexOf('.');
  const base = dotIndex > 0 ? safeFileName.slice(0, dotIndex) : safeFileName;
  const extension = dotIndex > 0 ? safeFileName.slice(dotIndex) : '';
  let candidate = safeFileName;
  let suffix = 2;
  while (usedNames.has(candidate.toLowerCase())) {
    candidate = `${base}-${suffix}${extension}`;
    suffix += 1;
  }
  usedNames.add(candidate.toLowerCase());
  return candidate;
};

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ message: 'Session required' }, { status: 401 });
  const denied = await isUserHasAccessByRole({ db_name: 'Application', access: 'read' });
  if (denied) return denied;

  await connectToDB();
  const applications = (await StudentApplication.find({}).sort({ createdAt: -1 }).lean()) as unknown as ApplicationRecord[];
  const zip = new JSZip();

  for (const application of applications) {
    const id = application._id.toString();
    const applicantFolder = zip.folder(`${safeName(application.fullName, 'Applicant')}-${id.slice(-6)}`);
    if (!applicantFolder) continue;

    applicantFolder.file('application-data.docx', await applicationDocx(application));
    const usedNames = new Set<string>(['application-data.docx']);
    const downloadErrors: string[] = [];

    for (const uploadedDocument of application.documents || []) {
      const url = String(uploadedDocument.url || '');
      if (!/^https?:\/\//i.test(url)) continue;
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const requestedName = uploadedDocument.name || `${uploadedDocument.label || uploadedDocument.kind || 'document'}`;
        applicantFolder.file(uniqueFileName(usedNames, requestedName), await response.arrayBuffer());
      } catch (error) {
        downloadErrors.push(`${uploadedDocument.name || uploadedDocument.label || 'Document'}: ${(error as Error).message}`);
      }
    }

    if (downloadErrors.length) applicantFolder.file('download-errors.txt', downloadErrors.join('\n'));
  }

  const archive = await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  const responseBody = new ArrayBuffer(archive.byteLength);
  new Uint8Array(responseBody).set(archive);
  return new Response(responseBody, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="applications-export.zip"',
      'Cache-Control': 'no-store',
    },
  });
}
