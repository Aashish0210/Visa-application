// Admin layout — completely isolated from main site (no navbar/footer/chatbot)
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
