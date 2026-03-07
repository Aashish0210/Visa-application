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
            business: 'Business Visa',
            study: 'Study Visa',
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
            isNewUpdate: true, // Flag as brand new for admin
            recentlyUpdatedDocs: Object.keys(documents || {}), // All docs are new initially
            rejectedDocuments: [],
            adminFeedback: ''
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
        const { refId, status, linkEmail, passportNumber, documents, rejectedDocuments, adminFeedback } = body;
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

        // Document update (Client "Fix Issues")
        if (documents) {
            const updatedDocNames = Object.keys(documents);
            applications[index].documents = { ...applications[index].documents, ...documents };
            applications[index].status = 'Under Review'; // Move back to review
            applications[index].isNewUpdate = true; // Flag for admin notification

            // Add to recently updated, avoiding duplicates
            const currentRecent = applications[index].recentlyUpdatedDocs || [];
            applications[index].recentlyUpdatedDocs = Array.from(new Set([...currentRecent, ...updatedDocNames]));

            // Remove ONLY the updated documents from the rejected list
            const currentRejected = applications[index].rejectedDocuments || [];
            applications[index].rejectedDocuments = currentRejected.filter((doc: string) => !updatedDocNames.includes(doc));

            // We can keep adminFeedback so user knows what they fixed, or clear it.
            // Let's clear it to show the "Fix" was submitted.
            applications[index].adminFeedback = '';
        }

        if (body.isNewUpdate === false) {
            applications[index].isNewUpdate = false;
            applications[index].recentlyUpdatedDocs = []; // Clear tracked updates
        }

        // Status update functionality (Admin/System)
        if (status) {
            const validStatuses = ['Pending', 'Under Review', 'In Progress', 'Approved', 'Rejected', 'Awaiting Payment'];
            if (!validStatuses.includes(status)) {
                return NextResponse.json({ success: false, error: 'Invalid status.' }, { status: 400 });
            }
            applications[index].status = status;
        }

        // Payment Processing logic
        if (body.paymentStatus) {
            applications[index].paymentStatus = body.paymentStatus;
            applications[index].paidAt = body.paidAt || new Date().toISOString();

            // Generate a receipt if one isn't provided
            if (!applications[index].receipt) {
                applications[index].receipt = body.receipt || {
                    transactionId: `TXN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
                    amount: "150.00",
                    currency: "USD",
                    method: body.paymentMethod || "Global Card"
                };
            }

            // Set issuance timeline message
            applications[index].issuanceTimeline = "Your visa is estimated to be issued within 5-7 business days. A digital copy will be sent to your registered email address.";

            // Mark as new update for admin to see the payment
            applications[index].isNewUpdate = true;
            applications[index].recentlyUpdatedDocs = applications[index].recentlyUpdatedDocs || [];
            if (!applications[index].recentlyUpdatedDocs.includes('PAYMENT_RECEIPT')) {
                applications[index].recentlyUpdatedDocs.push('PAYMENT_RECEIPT');
            }
        }

        // Handle rejected documents tracking (Admin)
        if (rejectedDocuments) {
            applications[index].rejectedDocuments = rejectedDocuments;
        }

        // Handle admin feedback (Admin)
        if (adminFeedback !== undefined) {
            applications[index].adminFeedback = adminFeedback;
        }

        if (body.issuanceTimeline) {
            applications[index].issuanceTimeline = body.issuanceTimeline;
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
