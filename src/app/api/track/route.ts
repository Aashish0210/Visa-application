import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'data', 'applications.json');

function readApplications() {
    if (!existsSync(FILE_PATH)) return [];
    try { return JSON.parse(readFileSync(FILE_PATH, 'utf-8')); } catch { return []; }
}

/* GET /api/track?refId=NV-XXXXXX&passport=YYYYYY */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const refId = searchParams.get('refId')?.trim().toUpperCase();
    const passport = searchParams.get('passport')?.trim().toUpperCase();

    if (!refId || !passport) {
        return NextResponse.json({ success: false, error: 'refId and passport are required.' }, { status: 400 });
    }

    const apps = readApplications();
    const app = apps.find(
        (a: { refId: string; passportNumber: string }) =>
            a.refId?.toUpperCase() === refId &&
            a.passportNumber?.toUpperCase() === passport
    );

    if (!app) {
        return NextResponse.json({ success: false, found: false });
    }

    /* Return only safe, client-visible fields */
    return NextResponse.json({
        success: true,
        found: true,
        data: {
            refId: app.refId,
            fullName: app.fullName,
            visaLabel: app.visaLabel,
            status: app.status,
            submittedAt: app.submittedAt,
            nationality: app.nationality,
        }
    });
}
