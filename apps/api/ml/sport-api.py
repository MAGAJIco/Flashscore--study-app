import os
import requests
from typing import List, Dict, Optional, Any
from datetime import datetime
from bs4 import BeautifulSoup
import re


class LiveMatch:
    def __init__(
        self,
        id: str,
        sport: str,
        home_team: str,
        away_team: str,
        game_time: str,
        status: str,
        home_score: Optional[int] = None,
        away_score: Optional[int] = None,
        prediction: Optional[str] = None,
        confidence: Optional[int] = None
    ):
        self.id = id
        self.sport = sport
        self.home_team = home_team
        self.away_team = away_team
        self.game_time = game_time
        self.status = status
        self.home_score = home_score
        self.away_score = away_score
        self.prediction = prediction
        self.confidence = confidence

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "sport": self.sport,
            "homeTeam": self.home_team,
            "awayTeam": self.away_team,
            "gameTime": self.game_time,
            "status": self.status,
            "homeScore": self.home_score,
            "awayScore": self.away_score,
            "prediction": self.prediction,
            "confidence": self.confidence
        }


class OddsData:
    def __init__(
        self,
        game_id: str,
        bookmaker: str,
        home_odds: float,
        away_odds: float,
        draw_odds: Optional[float] = None,
        over_under: Optional[Dict[str, float]] = None
    ):
        self.game_id = game_id
        self.bookmaker = bookmaker
        self.home_odds = home_odds
        self.away_odds = away_odds
        self.draw_odds = draw_odds
        self.over_under = over_under

    def to_dict(self) -> Dict[str, Any]:
        return {
            "gameId": self.game_id,
            "bookmaker": self.bookmaker,
            "homeOdds": self.home_odds,
            "awayOdds": self.away_odds,
            "drawOdds": self.draw_odds,
            "overUnder": self.over_under
        }


class SportsAPIService:
    def __init__(
        self,
        rapidapi_key: Optional[str] = None,
        odds_api_key: Optional[str] = None,
        football_data_api_key: Optional[str] = None
    ):
        self.rapidapi_key = rapidapi_key
        self.odds_api_key = odds_api_key
        self.football_data_api_key = football_data_api_key

    def fetch_nfl_matches(self) -> List[LiveMatch]:
        if not self.rapidapi_key:
            raise ValueError("RapidAPI key required for NFL data")

        try:
            response = requests.get(
                "https://api-american-football.p.rapidapi.com/games?league=1&season=2025",
                headers={
                    "X-RapidAPI-Key": self.rapidapi_key,
                    "X-RapidAPI-Host": "api-american-football.p.rapidapi.com"
                },
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            return self._format_nfl_data(data)
        except Exception as e:
            print(f"NFL API fetch error: {e}")
            raise

    def fetch_nba_matches(self) -> List[LiveMatch]:
        if not self.rapidapi_key:
            raise ValueError("RapidAPI key required for NBA data")

        try:
            response = requests.get(
                "https://api-basketball.p.rapidapi.com/games?league=12&season=2024-2025",
                headers={
                    "X-RapidAPI-Key": self.rapidapi_key,
                    "X-RapidAPI-Host": "api-basketball.p.rapidapi.com"
                },
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            return self._format_nba_data(data)
        except Exception as e:
            print(f"NBA API fetch error: {e}")
            raise

    def fetch_mlb_matches(self) -> List[LiveMatch]:
        if not self.rapidapi_key:
            raise ValueError("RapidAPI key required for MLB data")

        try:
            response = requests.get(
                "https://api-baseball.p.rapidapi.com/games?league=1&season=2025",
                headers={
                    "X-RapidAPI-Key": self.rapidapi_key,
                    "X-RapidAPI-Host": "api-baseball.p.rapidapi.com"
                },
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            return self._format_mlb_data(data)
        except Exception as e:
            print(f"MLB API fetch error: {e}")
            raise

    def fetch_soccer_matches(self) -> List[LiveMatch]:
        if not self.football_data_api_key:
            raise ValueError("Football-Data.org API key required for soccer data")

        try:
            response = requests.get(
                "https://api.football-data.org/v4/competitions/PL/matches",
                headers={"X-Auth-Token": self.football_data_api_key},
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            return self._format_soccer_data(data)
        except Exception as e:
            print(f"Soccer API fetch error: {e}")
            raise

    def fetch_espn_nfl(self) -> List[LiveMatch]:
        try:
            response = requests.get(
                "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            return self._format_espn_data(data, "NFL")
        except Exception as e:
            print(f"ESPN NFL API fetch error: {e}")
            raise

    def fetch_espn_nba(self) -> List[LiveMatch]:
        try:
            response = requests.get(
                "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            return self._format_espn_data(data, "NBA")
        except Exception as e:
            print(f"ESPN NBA API fetch error: {e}")
            raise

    def fetch_espn_mlb(self) -> List[LiveMatch]:
        try:
            response = requests.get(
                "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            return self._format_espn_data(data, "MLB")
        except Exception as e:
            print(f"ESPN MLB API fetch error: {e}")
            raise

    def fetch_odds_data(self, sport: str, bookmaker: Optional[str] = None) -> List[OddsData]:
        """
        Fetch betting odds with optional bookmaker filtering
        Args:
            sport: Sport type (NFL, NBA, MLB)
            bookmaker: Optional specific bookmaker to filter (e.g., 'draftkings', 'fanduel')
        """
        if not self.odds_api_key:
            raise ValueError("The Odds API key required for betting odds")

        sport_keys = {
            "NFL": "americanfootball_nfl",
            "NBA": "basketball_nba",
            "MLB": "baseball_mlb",
            "SOCCER": "soccer_epl"
        }

        sport_key = sport_keys.get(sport.upper())
        if not sport_key:
            raise ValueError(f"Unsupported sport for odds: {sport}")

        try:
            params = {
                "apiKey": self.odds_api_key,
                "regions": "us,uk",
                "markets": "h2h,spreads,totals",
                "oddsFormat": "decimal"
            }
            
            if bookmaker:
                params["bookmakers"] = bookmaker
            
            response = requests.get(
                f"https://api.the-odds-api.com/v4/sports/{sport_key}/odds",
                params=params,
                timeout=15
            )
            response.raise_for_status()
            
            # Check remaining quota
            remaining = response.headers.get('x-requests-remaining')
            if remaining:
                print(f"Odds API requests remaining: {remaining}")
            
            data = response.json()
            return self._format_odds_data(data)
        except requests.Timeout:
            print(f"Odds API timeout for {sport}")
            raise Exception(f"Timeout fetching odds for {sport}")
        except Exception as e:
            print(f"Odds API fetch error: {e}")
            raise

    def fetch_all_live_matches(self) -> List[LiveMatch]:
        all_matches = []
        
        tasks = [
            ("NFL", lambda: self.fetch_nfl_matches() if self.rapidapi_key else self.fetch_espn_nfl()),
            ("NBA", lambda: self.fetch_nba_matches() if self.rapidapi_key else self.fetch_espn_nba()),
            ("MLB", lambda: self.fetch_mlb_matches() if self.rapidapi_key else self.fetch_espn_mlb()),
            ("Soccer", self.fetch_soccer_matches if self.football_data_api_key else None),
        ]

        for sport, fetch_func in tasks:
            if fetch_func:
                try:
                    matches = fetch_func()
                    all_matches.extend(matches)
                except Exception as e:
                    print(f"Failed to fetch {sport} data: {e}")

        return all_matches

    def check_api_health(self) -> List[Dict[str, str]]:
        checks = [
            {"name": "RapidAPI NFL", "test": self.fetch_nfl_matches},
            {"name": "RapidAPI NBA", "test": self.fetch_nba_matches},
            {"name": "RapidAPI MLB", "test": self.fetch_mlb_matches},
            {"name": "Soccer API", "test": self.fetch_soccer_matches},
            {"name": "ESPN NFL (Free)", "test": self.fetch_espn_nfl},
            {"name": "ESPN NBA (Free)", "test": self.fetch_espn_nba},
            {"name": "ESPN MLB (Free)", "test": self.fetch_espn_mlb},
        ]

        results = []
        for check in checks:
            try:
                check["test"]()
                results.append({"service": check["name"], "status": "healthy"})
            except Exception as e:
                results.append({
                    "service": check["name"],
                    "status": "unhealthy",
                    "error": str(e)
                })

        return results

    def _format_nfl_data(self, api_data: Dict) -> List[LiveMatch]:
        if "response" not in api_data:
            return []

        matches = []
        for game in api_data["response"]:
            matches.append(LiveMatch(
                id=str(game["game"]["id"]),
                sport="NFL",
                home_team=game["teams"]["home"]["name"],
                away_team=game["teams"]["away"]["name"],
                game_time=game["game"]["date"]["start"],
                status=game["game"]["status"]["short"],
                home_score=game["scores"]["home"].get("total"),
                away_score=game["scores"]["away"].get("total")
            ))
        return matches

    def _format_nba_data(self, api_data: Dict) -> List[LiveMatch]:
        if "response" not in api_data:
            return []

        matches = []
        for game in api_data["response"]:
            matches.append(LiveMatch(
                id=str(game["id"]),
                sport="NBA",
                home_team=game["teams"]["home"]["name"],
                away_team=game["teams"]["away"]["name"],
                game_time=game["date"],
                status=game["status"]["short"],
                home_score=game["scores"]["home"].get("total"),
                away_score=game["scores"]["away"].get("total")
            ))
        return matches

    def _format_mlb_data(self, api_data: Dict) -> List[LiveMatch]:
        if "response" not in api_data:
            return []

        matches = []
        for game in api_data["response"]:
            matches.append(LiveMatch(
                id=str(game["id"]),
                sport="MLB",
                home_team=game["teams"]["home"]["name"],
                away_team=game["teams"]["away"]["name"],
                game_time=game["date"],
                status=game["status"]["short"],
                home_score=game["scores"]["home"].get("total"),
                away_score=game["scores"]["away"].get("total")
            ))
        return matches

    def _format_soccer_data(self, api_data: Dict) -> List[LiveMatch]:
        if "matches" not in api_data:
            return []

        matches = []
        for match in api_data["matches"]:
            matches.append(LiveMatch(
                id=str(match["id"]),
                sport="Soccer",
                home_team=match["homeTeam"]["name"],
                away_team=match["awayTeam"]["name"],
                game_time=match["utcDate"],
                status=match["status"],
                home_score=match["score"]["fullTime"].get("home"),
                away_score=match["score"]["fullTime"].get("away")
            ))
        return matches

    def _format_espn_data(self, api_data: Dict, sport: str) -> List[LiveMatch]:
        if "events" not in api_data:
            return []

        matches = []
        for event in api_data["events"]:
            competition = event.get("competitions", [{}])[0]
            competitors = competition.get("competitors", [])
            
            home_team = next((c for c in competitors if c.get("homeAway") == "home"), {})
            away_team = next((c for c in competitors if c.get("homeAway") == "away"), {})

            matches.append(LiveMatch(
                id=event["id"],
                sport=sport,
                home_team=home_team.get("team", {}).get("displayName", "Unknown"),
                away_team=away_team.get("team", {}).get("displayName", "Unknown"),
                game_time=event.get("date", ""),
                status=event.get("status", {}).get("type", {}).get("description", "Unknown"),
                home_score=int(home_team.get("score", 0)),
                away_score=int(away_team.get("score", 0))
            ))
        return matches

    def _format_odds_data(self, api_data: List) -> List[OddsData]:
        if not isinstance(api_data, list):
            return []

        odds_list = []
        for game in api_data:
            for bookmaker in game.get("bookmakers", []):
                h2h_market = next((m for m in bookmaker.get("markets", []) if m["key"] == "h2h"), None)
                spreads_market = next((m for m in bookmaker.get("markets", []) if m["key"] == "spreads"), None)
                totals_market = next((m for m in bookmaker.get("markets", []) if m["key"] == "totals"), None)
                
                home_odds = 0
                away_odds = 0
                draw_odds = None
                
                if h2h_market and h2h_market.get("outcomes"):
                    outcomes = h2h_market["outcomes"]
                    home_outcome = next((o for o in outcomes if o.get("name") in [game.get("home_team"), "Home"]), None)
                    away_outcome = next((o for o in outcomes if o.get("name") in [game.get("away_team"), "Away"]), None)
                    draw_outcome = next((o for o in outcomes if o.get("name") == "Draw"), None)
                    
                    home_odds = home_outcome.get("price", 0) if home_outcome else 0
                    away_odds = away_outcome.get("price", 0) if away_outcome else 0
                    draw_odds = draw_outcome.get("price") if draw_outcome else None
                
                over_under = None
                if totals_market and totals_market.get("outcomes"):
                    over_outcome = next((o for o in totals_market["outcomes"] if o.get("name") == "Over"), None)
                    under_outcome = next((o for o in totals_market["outcomes"] if o.get("name") == "Under"), None)
                    
                    if over_outcome and under_outcome:
                        over_under = {
                            "total": float(over_outcome.get("point", 0)),
                            "over_odds": over_outcome.get("price", 0),
                            "under_odds": under_outcome.get("price", 0)
                        }

                odds_list.append(OddsData(
                    game_id=game["id"],
                    bookmaker=bookmaker["title"],
                    home_odds=home_odds,
                    away_odds=away_odds,
                    draw_odds=draw_odds,
                    over_under=over_under
                ))
        return odds_list

    def fetch_mybetstoday_predictions(self, min_confidence: int = 86, max_odds: Optional[float] = None, date: str = "today") -> List[Dict[str, Any]]:
        """
        Fetch soccer predictions from mybets.today with flexible filtering
        Args:
            min_confidence: Minimum confidence percentage (default 86 for odds <= 1.16)
            max_odds: Optional maximum odds filter (overrides min_confidence if set)
            date: Date filter - "today", "tomorrow", or specific date format (default "today")
        """
        # Convert max_odds to min_confidence if provided
        if max_odds is not None and max_odds > 0:
            min_confidence = int(100 / max_odds)
        
        # Build URL based on date parameter
        if date.lower() == "today" or date == "":
            url = "https://www.mybets.today/recommended-soccer-predictions/"
        elif date.lower() == "tomorrow":
            url = "https://www.mybets.today/recommended-soccer-predictions/tomorrow/"
        else:
            # For specific dates, format as needed (e.g., YYYY-MM-DD)
            url = f"https://www.mybets.today/recommended-soccer-predictions/{date}/"
        
        try:
            response = requests.get(
                url,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                },
                timeout=10
            )
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'lxml')
            predictions = []
            
            for link in soup.find_all('a', href=True):
                href = link.get('href', '')
                if href and 'match-prediction-analysis' in href:
                    text = link.get_text(strip=True)
                    
                    confidence_match = re.search(r'\((\d+)%\)', text)
                    if confidence_match:
                        confidence = int(confidence_match.group(1))
                        
                        if confidence >= min_confidence:
                            time_match = re.search(r'(\d+:\d+)', text)
                            game_time = time_match.group(1) if time_match else "Unknown"
                            
                            text_no_time = re.sub(r'^\d+:\d+', '', text)
                            
                            vs_match = re.search(r'\s*[Vv]s\s*', text_no_time)
                            if vs_match:
                                before_vs = text_no_time[:vs_match.start()]
                                after_vs = text_no_time[vs_match.end():]
                                
                                home_team = before_vs.strip()
                                
                                desc_start_match = re.search(
                                    r'(' + re.escape(before_vs.strip()) + r'|' + r'[A-Z][a-z]+\s+(have|won|will|excellent|Despite|Having|We\s+expect))',
                                    after_vs
                                )
                                
                                if desc_start_match:
                                    away_team = after_vs[:desc_start_match.start()].strip()
                                else:
                                    away_team = after_vs.strip()
                                
                                if home_team and away_team:
                               