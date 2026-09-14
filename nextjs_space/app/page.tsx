import Link from 'next/link';
import { ArrowRight, Layout, Ruler, Download, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Layout className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">ArchitectPro</span>
            </div>
            <Link href="/designer">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Designing
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Professional <span className="text-blue-600">Floor Plan</span> Generator
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Design stunning 2 BHK and 3 BHK floor plans with precision.
            Customize specifications, view real-time previews, and export in multiple formats.
          </p>
          <Link href="/designer">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
              Start Designing <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          Powerful Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Layout className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              BHK Selection
            </h3>
            <p className="text-slate-600">
              Choose between 2 BHK and 3 BHK layouts with professionally designed templates.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Ruler className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Custom Specifications
            </h3>
            <p className="text-slate-600">
              Control wall thickness, dimensions, ceiling height, and more with precision.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Layers className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Real-time Preview
            </h3>
            <p className="text-slate-600">
              See your floor plan update instantly as you modify specifications.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Download className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Multi-format Export
            </h3>
            <p className="text-slate-600">
              Download your designs as PDF, SVG, or PNG for presentations and documentation.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Your Floor Plan?
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            Start designing professional architectural layouts in minutes.
          </p>
          <Link href="/designer">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Launch Designer <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p>© 2024 ArchitectPro. Professional Floor Plan Design Tool.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
