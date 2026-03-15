import { Link, useLocation } from 'wouter';
import { Calculator, Building2 } from 'lucide-react';

export default function Navigation() {
  const [location] = useLocation();

  const isHome = location === '/';
  const isJointDev = location === '/joint-development';

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

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <a
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isHome
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">稅務套利試算</span>
                <span className="sm:hidden text-sm font-medium">試算</span>
              </a>
            </Link>

            <Link href="/joint-development">
              <a
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isJointDev
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">合建收益評估</span>
                <span className="sm:hidden text-sm font-medium">合建</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
