import { Link, useLocation } from 'wouter';
import { Calculator, Building2 } from 'lucide-react';

export default function Navigation() {
  const [location] = useLocation();

  const isIntegrated = location === '/';

  return (
    <div className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">建</span>
            </div>
            <span className="font-semibold text-foreground hidden sm:inline">營建試算工具</span>
          </div>

        </div>
      </div>
    </div>
  );
}
