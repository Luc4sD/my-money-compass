import { usePrivacy } from '@/contexts/PrivacyContext';
import { cn } from '@/lib/utils';

interface PrivacyValueProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Componente que aplica blur em valores sensíveis quando o modo privacidade está ativo.
 * Use este componente para envolver qualquer valor monetário ou sensível.
 */
export function PrivacyValue({ 
  children, 
  className,
  as: Component = 'span' 
}: PrivacyValueProps) {
  const { isPrivacyMode } = usePrivacy();

  return (
    <Component
      className={cn(
        'transition-all duration-300',
        isPrivacyMode && 'blur-md select-none',
        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * Formata um valor monetário e aplica blur se o modo privacidade estiver ativo.
 */
interface PrivacyCurrencyProps {
  value: number;
  className?: string;
  showSign?: boolean;
}

export function PrivacyCurrency({ 
  value, 
  className,
  showSign = false 
}: PrivacyCurrencyProps) {
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Math.abs(value));

  const displayValue = showSign 
    ? `${value >= 0 ? '+' : '-'} ${formattedValue}`
    : formattedValue;

  return (
    <PrivacyValue className={className}>
      {displayValue}
    </PrivacyValue>
  );
}
