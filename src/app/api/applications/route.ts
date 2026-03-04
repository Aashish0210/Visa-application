import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'applications.json');

function readApplications() {
    if (!existsSync(FILE_PATH)) {
        mkdirSync(DATA_DIR, { recursive: true });
        writeFileSync(FILE_PATH, '[]', 'utf-8');
    }
    try {
        return JSON.parse(readFileSync(FILE_PATH, 'utf-8'));
    } catch {
        return [];
    }
}

function writeApplications(data: unknown[]) {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function generateRefId(): string {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const code = Array.from({ length: 6 }, () =>
        Math.random() < 0.5
            ? letters[Math.floor(Math.random() * letters.length)]
            : String(Math.floor(Math.random() * 10))
    ).join('');
    return `NV-${code}`;
}

/* GET  /api/applications — Admin: list all applications */
export async function GET() {
    const apps = readApplications();
    return NextResponse.json({ success: true, data: apps });
}

/* POST /api/applications — Public: submit a visa application */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { firstName, lastName, email, passportNumber, nationality, visaType, duration, address, documents } = body;

        if (!firstName || !lastName || !email || !passportNumber || !nationality || !visaType) {
            return NextResponse.json(
                { success: false, error: 'All required fields must be filled.' },
                { status: 400 }
            );
        }

        const applications = readApplications();

        /* Avoid duplicate passport submissions */
        const existing = applications.find(
            (a: { passportNumber: string }) =>
                a.passportNumber?.toLowerCase() === String(passportNumber).toLowerCase()
        );
        if (existing) {
            return NextResponse.json(
                { success: false, error: 'An application with this passport number already exists.', refId: existing.refId },
                { status: 409 }
            );
        }

        const visaLabels: Record<string, string> = {
            working: 'Working Visa',
            study: 'Study Visa',
            residential: 'Residential Visa',
            tourist: 'Tourist Visa',
        };

        const newApp = {
            id: `VZA-${Date.now()}`,
            refId: generateRefId(),
            firstName: String(firstName).trim(),
            lastName: String(lastName).trim(),
            fullName: `${String(firstName).trim()} ${String(lastName).trim()}`,
            email: String(email).trim().toLowerCase(),
            passportNumber: String(passportNumber).trim().toUpperCase(),
            nationality: String(nationality).trim(),
            visaType: String(visaType).trim(),
            visaLabel: visaLabels[visaType] ?? visaType,
            duration: String(duration ?? '1_year').trim(),
            address: String(address ?? '').trim(),
            documents: documents || {},
            status: 'Pending',
            submittedAt: new Date().toISOString(),
        };

        applications.unshift(newApp);
        writeApplications(applications);

        return NextResponse.json(
            { success: true, id: newApp.id, refId: newApp.refId },
            { status: 201 }
        );
    } catch (err) {
        console.error('[applications POST]', err);
        return NextResponse.json(
            { success: false, error: 'Internal server error.' },
            { status: 500 }
        );
    }
}
/* PATCH /api/applications — Admin: update application status */
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { refId, status, linkEmail, passportNumber, rejectedDocuments, adminFeedback } = body;
        const applications = readApplications();
        const index = applications.findIndex((a: any) => a.refId === refId || a.id === refId);

        if (index === -1) {
            return NextResponse.json({ success: false, error: 'Application not found.' }, { status: 404 });
        }

        // Link functionality
        if (linkEmail && passportNumber) {
            if (applications[index].passportNumber?.toUpperCase() !== String(passportNumber).trim().toUpperCase()) {
                return NextResponse.json({ success: false, error: 'Passport verification failed. Reference and Passport do not match.' }, { status: 401 });
            }
            applications[index].email = linkEmail.trim().toLowerCase();
        }

        // Status update functionality
        if (status) {
            const validStatuses = ['Pending', 'Under Review', 'In Progress', 'Approved', 'Rejected'];
            if (!validStatuses.includes(status)) {
                return NextResponse.json({ success: false, error: 'Invalid status.' }, { status: 400 });
            }
            applications[index].status = status;
        }

        // Handle rejected documents tracking
        if (rejectedDocuments) {
            applications[index].rejectedDocuments = rejectedDocuments;
        }

        // Handle admin feedback
        if (adminFeedback !== undefined) {
            applications[index].adminFeedback = adminFeedback;
        }

        applications[index].updatedAt = new Date().toISOString();
        writeApplications(applications);

        return NextResponse.json({ success: true, data: applications[index] });

        return NextResponse.json({ success: true, data: applications[index] });
    } catch (err) {
        console.error('[applications PATCH]', err);
        return NextResponse.json(
            { success: false, error: 'Internal server error.' },
            { status: 500 }
        );
    }
}
