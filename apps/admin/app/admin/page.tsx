// ===========================================
// Admin Root Page (Redirect to Dashboard)
// ===========================================
// Owner: Stream 6 (Admin Console)

import { redirect } from 'next/navigation';

export default function AdminPage() {
  redirect('/');
}
