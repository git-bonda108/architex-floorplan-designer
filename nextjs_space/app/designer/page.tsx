import Link from 'next/link';
import { Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DesignerWorkspace from './_components/designer-workspace';

export default function DesignerPage() {
  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm z-50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Layout className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">ArchitectPro</span>
            </Link>
            <Link href="/">
              <Button variant="outline">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Designer Workspace */}
      <div className="flex-1 overflow-hidden">
        <DesignerWorkspace />
      </div>
    </div>
  );
}
