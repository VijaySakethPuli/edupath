# ai-services/models/personality.py

from typing import Dict, List

class PersonalityAnalyzer:
    """
    Lightweight placeholder for personality/interest interpretations.
    """

    def interpret_interests(self, profile: Dict[str, float]) -> List[str]:
        # profile has keys: realistic, investigative, artistic, social, enterprising, conventional (0–100)
        tips = []
        top = sorted(profile.items(), key=lambda x: x[1], reverse=True)[:3]
        for k, v in top:
            if k == "investigative":
                tips.append("Enjoys problem-solving and analysis; STEM and research pathways may fit well.")
            elif k == "realistic":
                tips.append("Prefers hands-on, practical tasks; engineering, operations, or technical trades can fit.")
            elif k == "artistic":
                tips.append("Values creativity and expression; design, media, or content roles may suit.")
            elif k == "social":
                tips.append("Likes helping and collaborating; teaching, counseling, or community roles can align.")
            elif k == "enterprising":
                tips.append("Enjoys leading and influencing; business, entrepreneurship, or management paths may fit.")
            elif k == "conventional":
                tips.append("Organized and detail-focused; finance, analysis, or administrative roles may suit.")
        return tips or ["Balanced profile; explore multiple streams to discover preferences."]