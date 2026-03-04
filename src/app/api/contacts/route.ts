import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'contacts.json');

function readContacts() {
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

function writeContacts(data: unknown[]) {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

/* GET  /api/contacts — Admin: list all submissions */
export async function GET() {
    const contacts = readContacts();
    return NextResponse.json({ success: true, data: contacts });
}

/* POST /api/contacts — Public: submit a contact query */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, department, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, error: 'Name, email, and message are required.' },
                { status: 400 }
            );
        }

        const contacts = readContacts();
        const newEntry = {
            id: `QRY-${Date.now()}`,
            name: String(name).trim(),
            email: String(email).trim().toLowerCase(),
            department: String(department ?? 'General Inquiry').trim(),
            message: String(message).trim(),
            status: 'Unread',
            priority: 'Normal',
            submittedAt: new Date().toISOString(),
        };

        contacts.unshift(newEntry);          // newest first
        writeContacts(contacts);

        return NextResponse.json({ success: true, id: newEntry.id }, { status: 201 });
    } catch (err) {
        console.error('[contacts POST]', err);
        return NextResponse.json(
            { success: false, error: 'Internal server error.' },
            { status: 500 }
        );
    }
}
/* PATCH /api/contacts — Admin: update query status/reply */
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, status, priority, reply } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Query ID is required.' },
                { status: 400 }
            );
        }

        const contacts = readContacts();
        const index = contacts.findIndex((c: { id: string }) => c.id === id);

        if (index === -1) {
            return NextResponse.json(
                { success: false, error: 'Query not found.' },
                { status: 404 }
            );
        }

        if (status) contacts[index].status = status;
        if (priority) contacts[index].priority = priority;
        if (reply) {
            contacts[index].reply = reply;
            contacts[index].repliedAt = new Date().toISOString();
            contacts[index].status = 'Replied';
        }

        contacts[index].updatedAt = new Date().toISOString();
        writeContacts(contacts);

        return NextResponse.json({ success: true, data: contacts[index] });
    } catch (err) {
        console.error('[contacts PATCH]', err);
        return NextResponse.json(
            { success: false, error: 'Internal server error.' },
            { status: 500 }
        );
    }
}
