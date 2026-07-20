import type { LucideIcon, LucideProps } from "lucide-react";
import {
  Heart,
  Users,
  BookOpen,
  MapPin,
  Music,
  Church,
  Calendar,
  Star,
  Sparkles,
  HandHeart,
  Baby,
  Flame,
  Globe,
  Phone,
  Mail,
} from "lucide-react";
import type { SiteIconName } from "@/lib/site-content/types";

/**
 * Mapa explícito nome → ícone do lucide-react.
 * Não usar `import * as lucide` para não arrastar o pacote inteiro para o bundle.
 * Mantém sincronizado com o enum `SiteIconName` (e com a validação da API).
 */
export const SITE_ICON_MAP: Record<SiteIconName, LucideIcon> = {
  Heart,
  Users,
  BookOpen,
  MapPin,
  Music,
  Church,
  Calendar,
  Star,
  Sparkles,
  HandHeart,
  Baby,
  Flame,
  Globe,
  Phone,
  Mail,
};

interface SiteIconProps extends LucideProps {
  /** Nome vindo do CMS. Se não bater com o enum, cai no ícone `fallback`. */
  name: string;
  /** Ícone usado quando `name` é desconhecido (default: Sparkles). */
  fallback?: SiteIconName;
}

/** Renderiza um ícone do lucide a partir de um nome do CMS, com fallback seguro. */
export default function SiteIcon({ name, fallback = "Sparkles", ...props }: SiteIconProps) {
  const Icon = SITE_ICON_MAP[name as SiteIconName] ?? SITE_ICON_MAP[fallback];
  return <Icon {...props} />;
}
