
import { Locale } from '@/i18n';

export const regionalSportsPreferences: Record<Locale, string[]> = {
  en: ['Premier League', 'Championship', 'NFL', 'NBA', 'MLB', 'NHL', 'IPL', 'Big Bash League'],
  es: ['La Liga', 'Liga MX', 'Champions League', 'Copa Libertadores', 'Brasileirão', 'Liga Profesional'],
  fr: ['Ligue 1', 'Champions League', 'Rugby Top 14', 'Tour de France', 'Belgian Pro League'],
  de: ['Bundesliga', 'Champions League', 'DFB-Pokal', 'Austrian Bundesliga', 'Swiss Super League'],
  pt: ['Brasileirão', 'Primeira Liga', 'Champions League', 'Copa do Brasil', 'Libertadores', 'Liga Profesional']
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
