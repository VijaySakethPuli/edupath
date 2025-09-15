import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
from typing import Dict, List, Optional
import json

class CareerRecommendationEngine:
    def __init__(self):
        self.career_data = self._load_career_data()
        self.stream_data = self._load_stream_data()
        self.scaler = StandardScaler()
        
    def _load_career_data(self):
        """Load career database with RIASEC profiles and requirements"""
        return [
            {
                "id": "software_engineer",
                "name": "Software Engineer",
                "riasec_profile": {"realistic": 20, "investigative": 90, "artistic": 30, "social": 20, "enterprising": 40, "conventional": 60},
                "required_aptitude": {"logical": 85, "numerical": 70, "spatial": 60, "verbal": 50},
                "education_path": ["Science", "Computer Science", "B.Tech/B.E."],
                "salary_range": "₹6-25 LPA",
                "job_market": "Excellent",
                "description": "Design and develop software applications and systems"
            },
            {
                "id": "data_scientist", 
                "name": "Data Scientist",
                "riasec_profile": {"realistic": 30, "investigative": 95, "artistic": 20, "social": 30, "enterprising": 50, "conventional": 80},
                "required_aptitude": {"logical": 90, "numerical": 95, "spatial": 40, "verbal": 60},
                "education_path": ["Science", "Mathematics/Statistics", "B.Sc/B.Tech"],
                "salary_range": "₹8-30 LPA",
                "job_market": "Excellent",
                "description": "Analyze complex data to help organizations make decisions"
            },
            {
                "id": "graphic_designer",
                "name": "Graphic Designer", 
                "riasec_profile": {"realistic": 40, "investigative": 30, "artistic": 95, "social": 40, "enterprising": 60, "conventional": 30},
                "required_aptitude": {"logical": 50, "numerical": 40, "spatial": 85, "verbal": 60},
                "education_path": ["Arts/Science", "Fine Arts/Design", "BFA/B.Des"],
                "salary_range": "₹3-12 LPA",
                "job_market": "Good",
                "description": "Create visual concepts to communicate ideas and inspire"
            },
            {
                "id": "teacher",
                "name": "Teacher",
                "riasec_profile": {"realistic": 20, "investigative": 60, "artistic": 50, "social": 95, "enterprising": 40, "conventional": 60},
                "required_aptitude": {"logical": 70, "numerical": 60, "spatial": 30, "verbal": 90},
                "education_path": ["Any", "Subject Specialization", "B.Ed"],
                "salary_range": "₹3-8 LPA",
                "job_market": "Good", 
                "description": "Educate and guide students in academic subjects"
            },
            {
                "id": "business_analyst",
                "name": "Business Analyst",
                "riasec_profile": {"realistic": 20, "investigative": 80, "artistic": 30, "social": 60, "enterprising": 85, "conventional": 70},
                "required_aptitude": {"logical": 80, "numerical": 85, "spatial": 40, "verbal": 80},
                "education_path": ["Commerce/Science", "Business/Economics", "BBA/B.Com"],
                "salary_range": "₹5-18 LPA",
                "job_market": "Excellent",
                "description": "Analyze business processes and recommend improvements"
            }
        ]
    
    def _load_stream_data(self):
        """Load stream information with career mappings"""
        return {
            "Science": {
                "subjects": ["Physics", "Chemistry", "Mathematics", "Biology"],
                "career_paths": ["Engineering", "Medicine", "Research", "Technology"],
                "entrance_exams": ["JEE", "NEET", "BITSAT"],
                "suitable_interests": ["investigative", "realistic"],
                "description": "For students interested in understanding how things work"
            },
            "Commerce": {
                "subjects": ["Economics", "Accountancy", "Business Studies", "Mathematics"],
                "career_paths": ["Business", "Finance", "CA", "Banking"],
                "entrance_exams": ["CA Foundation", "CS", "CMA"],
                "suitable_interests": ["enterprising", "conventional"],
                "description": "For students interested in business and economics"
            },
            "Arts": {
                "subjects": ["Literature", "History", "Geography", "Political Science"],
                "career_paths": ["Civil Services", "Law", "Journalism", "Teaching"],
                "entrance_exams": ["CLAT", "JMI", "BHU"],
                "suitable_interests": ["social", "artistic"],
                "description": "For students interested in society, culture, and humanities"
            }
        }
    
    def recommend_careers(self, interests: Dict, aptitude: Optional[Dict] = None, 
                         personality: Optional[Dict] = None, class_level: int = 10) -> List[Dict]:
        """Generate career recommendations using hybrid approach"""
        
        recommendations = []
        
        for career in self.career_data:
            # Calculate interest similarity
            interest_similarity = self._calculate_similarity(interests, career["riasec_profile"])
            
            # Calculate aptitude match if available
            aptitude_match = 0.5  # default neutral score
            if aptitude and career.get("required_aptitude"):
                aptitude_match = self._calculate_aptitude_match(aptitude, career["required_aptitude"])
            
            # Combined score
            combined_score = (interest_similarity * 0.7) + (aptitude_match * 0.3)
            
            # Add contextual factors for class level
            if class_level <= 10:
                # Boost careers that are easier to understand for younger students
                if career["id"] in ["teacher", "graphic_designer"]:
                    combined_score += 0.1
            
            recommendations.append({
                "career": career,
                "fit_score": round(combined_score * 100, 1),
                "interest_match": round(interest_similarity * 100, 1),
                "aptitude_match": round(aptitude_match * 100, 1),
                "reasons": self._generate_reasons(interests, career, interest_similarity)
            })
        
        # Sort by fit score and return top 10
        recommendations.sort(key=lambda x: x["fit_score"], reverse=True)
        return recommendations[:10]
    
    def recommend_streams(self, interests: Dict, aptitude: Optional[Dict] = None, 
                         class_level: int = 10) -> List[Dict]:
        """Recommend academic streams based on interests and aptitude"""
        
        stream_scores = {}
        
        for stream_name, stream_info in self.stream_data.items():
            score = 0
            reasons = []
            
            # Interest-based scoring
            for suitable_interest in stream_info["suitable_interests"]:
                if suitable_interest in interests:
                    interest_score = interests[suitable_interest] / 100
                    score += interest_score
                    if interest_score > 0.6:
                        reasons.append(f"High {suitable_interest} interest ({interests[suitable_interest]:.0f}%)")
            
            # Aptitude-based scoring (if available)
            if aptitude:
                if stream_name == "Science":
                    aptitude_score = (aptitude["logical"] + aptitude["numerical"]) / 200
                    score += aptitude_score
                    if aptitude_score > 0.7:
                        reasons.append("Strong logical and numerical abilities")
                        
                elif stream_name == "Commerce":
                    aptitude_score = (aptitude["numerical"] + aptitude["verbal"]) / 200
                    score += aptitude_score
                    if aptitude_score > 0.7:
                        reasons.append("Good numerical and verbal skills")
                        
                elif stream_name == "Arts":
                    aptitude_score = aptitude["verbal"] / 100
                    score += aptitude_score
                    if aptitude_score > 0.7:
                        reasons.append("Excellent verbal abilities")
            
            # Normalize score
            score = score / (len(stream_info["suitable_interests"]) + (1 if aptitude else 0))
            
            stream_scores[stream_name] = {
                "stream": stream_name,
                "info": stream_info,
                "fit_score": round(score * 100, 1),
                "reasons": reasons,
                "career_examples": self._get_stream_career_examples(stream_name)
            }
        
        # Sort by fit score
        sorted_streams = sorted(stream_scores.values(), key=lambda x: x["fit_score"], reverse=True)
        return sorted_streams
    
    def _calculate_similarity(self, profile1: Dict, profile2: Dict) -> float:
        """Calculate cosine similarity between two profiles"""
        keys = set(profile1.keys()) & set(profile2.keys())
        if not keys:
            return 0.0
            
        vec1 = np.array([profile1[k] for k in keys])
        vec2 = np.array([profile2[k] for k in keys])
        
        return cosine_similarity([vec1], [vec2])
    
    def _calculate_aptitude_match(self, student_aptitude: Dict, required_aptitude: Dict) -> float:
        """Calculate how well student's aptitude matches career requirements"""
        matches = []
        for skill, required_level in required_aptitude.items():
            if skill in student_aptitude:
                # Convert to 0-1 scale and calculate match
                student_level = student_aptitude[skill] / 100
                required_level = required_level / 100
                match = 1 - abs(student_level - required_level)
                matches.append(match)
        
        return sum(matches) / len(matches) if matches else 0.5
    
    def _generate_reasons(self, interests: Dict, career: Dict, similarity: float) -> List[str]:
        """Generate human-readable reasons for career recommendation"""
        reasons = []
        
        # Find top matching interests
        career_interests = career["riasec_profile"]
        for interest, student_score in interests.items():
            career_score = career_interests.get(interest, 0)
            if student_score > 60 and career_score > 60:
                reasons.append(f"Your {interest} interests align well with this career")
        
        if similarity > 0.8:
            reasons.append("Excellent overall personality match")
        elif similarity > 0.6:
            reasons.append("Good personality fit for this role")
        
        return reasons[:3]  # Top 3 reasons
    
    def _get_stream_career_examples(self, stream_name: str) -> List[str]:
        """Get example careers for each stream"""
        stream_careers = {
            "Science": ["Software Engineer", "Data Scientist", "Doctor", "Research Scientist"],
            "Commerce": ["Business Analyst", "Chartered Accountant", "Investment Banker", "Entrepreneur"],
            "Arts": ["Teacher", "Lawyer", "Journalist", "Civil Servant"]
        }
        return stream_careers.get(stream_name, [])