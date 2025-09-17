# ai-services/models/aptitude.py

from typing import List, Dict

class AptitudeEngine:
    """
    Minimal, dependency-light aptitude engine.
    Produces next-question stubs and simple scoring so the API runs end-to-end.
    Replace with your adaptive/IRT logic later if needed.
    """

    def __init__(self):
        # Simple item bank (logical, numerical, spatial, verbal)
        # In real app, load from DB or JSON
        self.items = [
            {"id": "L1", "domain": "logical", "text": "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?", "answer": "Yes"},
            {"id": "N1", "domain": "numerical", "text": "What is 15% of 200?", "answer": "30"},
            {"id": "S1", "domain": "spatial", "text": "Rotate an L-shape 90° clockwise. Which orientation matches?", "answer": "C"},
            {"id": "V1", "domain": "verbal", "text": "Choose the synonym of 'benevolent'", "answer": "Kind"},
        ]

    def get_next_question(self, previous_answers: List[Dict], current_difficulty: int = 3) -> Dict:
        """
        Very simple next-item selection: return the next unseen item.
        previous_answers: [{id, correct: bool}]
        """
        answered_ids = {a.get("id") for a in previous_answers or []}
        for item in self.items:
            if item["id"] not in answered_ids:
                # Do not reveal correct answer here
                return {"id": item["id"], "domain": item["domain"], "text": item["text"], "difficulty": current_difficulty}
        return {"done": True}

    def calculate_scores(self, responses: List[Dict]) -> Dict:
        """
        responses: [{id, domain, correct: True/False}]
        Returns 0–100 per domain.
        """
        domain_totals = {"logical": 0, "numerical": 0, "spatial": 0, "verbal": 0}
        domain_counts = {"logical": 0, "numerical": 0, "spatial": 0, "verbal": 0}
        for r in responses or []:
            d = r.get("domain")
            if d in domain_totals:
                domain_counts[d] += 1
                domain_totals[d] += 1 if r.get("correct") else 0
        scores = {}
        for d in domain_totals:
            if domain_counts[d] > 0:
                scores[d] = round(100 * domain_totals[d] / domain_counts[d], 1)
            else:
                scores[d] = 50.0  # neutral default
        return scores

    def interpret_scores(self, scores: Dict) -> Dict:
        def level(x):
            return "High" if x >= 70 else "Medium" if x >= 40 else "Developing"
        return {
            "logical": level(scores.get("logical", 50)),
            "numerical": level(scores.get("numerical", 50)),
            "spatial": level(scores.get("spatial", 50)),
            "verbal": level(scores.get("verbal", 50)),
        }

    def identify_strengths(self, scores: Dict) -> list:
        strengths = [k for k, v in scores.items() if v >= 70]
        return strengths[:3]