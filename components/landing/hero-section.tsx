import { CTAButton } from './cta-button';
import { TrustBadges } from './trust-badges';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      // Default behavior - could redirect to signup or pricing
      window.location.href = '/pricing';
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Your $500K AI Team.
          <br />
          <span className="text-green-600">Working in 60 Seconds.</span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
          23 AI employees for $39/month. 30-day guarantee or full refund.
        </p>
        
        {/* CTA Button */}
        <div className="mb-16">
          <CTAButton onClick={handleGetStarted} />
        </div>
        
        {/* Trust Badges */}
        <TrustBadges />
      </div>
    </section>
  );
}