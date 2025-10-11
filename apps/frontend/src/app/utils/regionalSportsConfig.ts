
import { Locale } from '@/i18n';

export const regionalSportsPreferences: Record<Locale, string[]> = {
  en: ['Premier League', 'NFL', 'NBA', 'MLB', 'NHL'],
  es: ['La Liga', 'Champions League', 'Copa Libertadores', 'Liga MX'],
  fr: ['Ligue 1', 'Champions League', 'Rugby Top 14', 'Tour de France'],
  de: ['Bundesliga', 'Champions League', 'DFB-Pokal', 'Handball Bundesliga'],
  pt: ['Brasileirão', 'Champions League', 'Copa do Brasil', 'Libertadores']
};

export const regionalTerminology: Record<Locale, Record<string, string>> = {
  en: { soccer: 'Soccer', football: 'American Football' },
  es: { soccer: 'Fútbol', football: 'Fútbol Americano' },
  fr: { soccer: 'Football', football: 'Football Américain' },
  de: { soccer: 'Fußball', football: 'American Football' },
  pt: { soccer: 'Futebol', football: 'Futebol Americano' }
};

export function getPreferredSports(locale: Locale): string[] {
  return regionalSportsPreferences[locale] || regionalSportsPreferences.en;
}

export function getSportTerminology(locale: Locale, term: string): string {
  return regionalTerminology[locale]?.[term] || term;
}
