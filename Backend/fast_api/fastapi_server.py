from fastapi import FastAPI
from pydantic import BaseModel
import requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "gemma3:1b"

class PredictionRequest(BaseModel):
    field: str
    text: str


FIELD_SUGGESTIONS = {
    "email": ["@gmail", "@yahoo", ".com", "@outlook", "user", "name", "contact", "info", "support", "admin"],
    "linkedin": ["https://", "linkedin", "www.", "in/", "profile", "company", "school", "university", "org", "net"],
    "institution": ["Harvard", "MIT", "Stanford", "NTU", "Oxford", "Cambridge", "Yale","Princeton", "Columbia", "Berkeley","Arizona State University", "Auburn University", "Boston University","Brown University", "California Institute of Technology", "Carnegie Mellon University","Cornell University", "Dartmouth College", "Duke University","Emory University", "Florida State University", "George Washington University","Georgia Institute of Technology", "Harvey Mudd College", "Johns Hopkins University","King's College London", "Loyola University", "Michigan State University","Northwestern University", "Pennsylvania State University", "Purdue University" ,"National" ,"FAST"],
    "degree": ["B.Sc.", "M.Sc.", "Ph.D.", "B.A.", "M.Tech", "B.E.", "M.E.", "B.Tech","M.B.A.", "B.Com", "Ph.D", "BBA", "BSSE", "BSAI","M.Phil.", "LLB", "LLM", "D.Sc.", "M.Com", "B.Ed", "M.Ed","BDS", "MBBS", "DVM", "BCA", "MCA", "BFA", "MFA", "BASc", "MASc", "Data science" , "M.Sc Data science ", "B.SC Data Science"   "Organizational Leadership M.A.","Operations Research M.Sc." ,  "Neuroscience B.Sc."," M.Sc. Nanotechnology"],
    "CGPA": ["1.5", "1.6", "1.7", "1.8", "1.9", "2.0", "2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8", "2.9", "3.0", "3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8", "3.9", "4.0"],
    "graduationYear": ["2023", "2024", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015" , "2025" , "1991" , "2010" , "2000" , "1990" , "1980" , "1995" , "1996"],
    "skills": ["JavaScript", "Python", "React", "Web", "SQL", "Java", "C++", "Node.js", "AWS", "Docker","Devops", "Engineering", "Data", "Data Engineering", "Analyst", "Cybersecurity Basics","Backend Development", "Frontend Development", "Full stack developer","HTML", "CSS", "TypeScript", "MongoDB", "Express.js", "Kubernetes", "Git", "GitHub","REST API", "GraphQL", "CI/CD", "Agile Methodologies", "Machine Learning","Artificial Intelligence", "TensorFlow", "Pandas", "NumPy", "PostgreSQL","Linux", "Shell Scripting", "Firebase", "Bootstrap", "Next.js", "FastAPI", "Development" , "C" , "C#" ,"Agile Development", "API Integration", "Apache Kafka", "Android Development", "Ansible", "Apache Spark","Big Data", "Business Analysis", "Bash Scripting", "Bug Tracking", "Bootstrap Studio", "Business Intelligence", "Cloud Computing", "CRM Tools", "Computer Vision", "Cloud Architecture", "Continuous Integration", "Cross-platform Development","Data Visualization", "Django", "Design Thinking", "Database Management", "Data Cleaning", "Debugging","ETL Pipelines", "Elasticsearch", "E-commerce Development", "Entity Framework", "Embedded Systems", "EJS (Embedded JavaScript)","Figma", "Flask", "Firebase Authentication", "File System Management", "Frontend Architecture", "Functional Programming","Google Cloud Platform (GCP)", "Go (Golang)", "GUI Development", "Google Analytics", "Gatsby.js", "Game Development","Hadoop", "HTML5 Canvas", "Heroku", "HTTP Protocol", "Hashing Algorithms", "Hardware Troubleshooting","IoT (Internet of Things)", "Information Retrieval", "Infrastructure as Code (IaC)", "iOS Development", "Identity Access Management (IAM)", "Integration Testing"],
   "companyName": ["Apple", "Amazon", "ASUS", "Acer Inc", "Atlassian", "Adobe Systems", "Alibaba Group", "Arm Holdings","Baidu", "BlackBerry", "Broadcom Inc.", "Box Inc.", "BMC Software", "BuzzFeed", "Blue Yonder", "Booking.com","Cisco Systems", "Canonical Ltd.", "Coinbase", "Citrix Systems", "CrowdStrike", "Cognizant", "Capgemini", "Cloudflare","Dell Technologies", "Dropbox", "DigitalOcean", "Databricks", "DoorDash", "DocuSign", "Dassault Systèmes", "Domo Inc.","eBay", "Epic Games", "Elastic NV", "ESET", "Envato", "Ericsson", "Epson", "Evernote","Facebook (Meta)", "Fujitsu", "Figma", "Fortinet", "Flipkart", "Freshworks", "Fastly", "Fivetran","Google", "GitHub", "GitLab", "General Electric (GE)", "Grab", "Groupon", "Grammarly", "Gojek", "HP Inc.", "HCL Technologies", "Honeywell", "Huawei", "HubSpot", "Hitachi", "Helix", "HackerRank","IBM", "Intel", "Infosys", "Intuit", "iRobot", "Illumina", "Indeed", "Improbable"],
   "jobTitle": ["Software", "Engineer", "Developer", "Manager", "Analyst", "Architect", "Consultant","Designer", "Lead", "Director", "Programmer", "Technician", "Administrator","Data Scientist", "Web Developer", "Product Manager", "QA Engineer", "System Analyst","Machine Learning Engineer", "Project Coordinator", "ML Engineer", "Data Engineer","AI Engineer", "App Developer", "Application Support Analyst", "Automation Engineer", "Agile Coach","Backend Developer", "Business Analyst", "Blockchain Developer", "Business Intelligence Developer", "Build Engineer","Cloud Engineer", "Cybersecurity Analyst", "Customer Support Engineer", "Content Developer", "Computer Vision Engineer","DevOps Engineer", "Data Analyst", "Database Administrator", "Desktop Support Technician","Embedded Systems Engineer", "ETL Developer", "Email Marketing Specialist", "Enterprise Architect", "E-commerce Developer","Frontend Developer", "Full Stack Developer", "Firmware Engineer", "Functional Consultant", "Field Service Engineer","Game Developer", "Graphics Designer", "Growth Hacker", "GIS Analyst", "Go Developer", "Help Desk Technician", "Hardware Engineer", "Hadoop Developer", "HRIS Analyst", "Hybrid Cloud Engineer","IT Support Specialist", "Infrastructure Engineer", "Information Security Analyst", "Integration Developer", "iOS Developer"  "YouTube Content Strategist","Yield Optimization Analyst","YAML Configuration Specialist" "Xamarin Developer","XML Developer","X++ Developer"],
    "duration": ["Jan", "2023", "Dec", "2022", "May", "Jun", "Jul", "Aug", "Sep", "Oct" , "Apr" , "Feb" , "Nov" , "2020" , "1965" , "1989", "2012" , "2018" , "2016" , "2007" , "2005"],
    "certifications": ["AWS Certification", "Cisco certification", "Google certification", "Microsoft certification", "Certified", "PMP", "Scrum expert certification", "Agile development certification", "ITIL certification", "Security", "CompTIA", "CEH", "Oracle certification", "TOGAF certification", "CISM expert certification", "CISSP", "Six Sigma", "HubSpot", "Coursera Certificate", "edX", "GitHub Experts Certificate", "Red Hat", "IBM", "Adobe Certified Expert","Blockchain Certification by IBM", "Big Data Certification", "Business Analytics Certification", "Blue Prism Developer Certification", "Business Intelligence Certification", "Business Process Management Certification", "Basic Cybersecurity Certification", "Business Strategy Certification","Certified Ethical Hacker", "Certified Information Systems Auditor", "Certified Information Security Manager", "Certified Scrum Master","Cisco Certified Network Associate", "Certified Cloud Practitioner", "Certified DevOps Engineer", "Certified Agile Leadership","Data Science Professional Certificate", "Deep Learning Specialization", "Data Analyst Certification", "Docker Certified Associate", "DevOps Foundation Certification", "Design Thinking Certification", "Digital Marketing Certification", "Data Engineer Certification","Ethical Hacking Essentials", "Enterprise Architecture Certification", "edX Verified Certificate", "Elastic Stack Certification", "Embedded Systems Certification", "Executive Leadership Certificate", "E-commerce Analytics Certification", "Email Marketing Specialist Certification","Front-End Web Development Certification", "Full Stack Developer Certificate", "Firebase Developer Certification", "Financial Analyst Certification","Flutter Developer Certification", "Fundamentals of Project Management", "Foundational Cloud Certification", "Forensics Investigator Certification","Google Cloud Professional Certificate", "Git & GitHub Certification", "Google Analytics Certification", "Game Developer Certification","Google UX Design Certificate", "Google Data Engineer Certificate", "Google Ads Certification", "GraphQL Developer Certificate","HubSpot Inbound Marketing Certification", "HR Analytics Certification", "Hadoop Certification", "HTML5 Developer Certification", "Health Informatics Certificate", "HarvardX CS50 Certificate", "Hybrid Cloud Certification", "Healthcare Data Analyst Certificate","IBM Data Science Professional Certificate", "Information Systems Security Certification", "ITIL Foundation Certification", "Intro to Machine Learning", "Information Security Analyst Certification", "Identity and Access Management Certification", "Industrial IoT Certification", "Intermediate Python Certificate"],
    "hobbies": ["Reading", "Swimming", "Hiking", "Traveling", "Gaming", "Photography", "Cooking","Music", "Sports", "Art", "Watching", "movies", "Tv shows", "listening","to podcasts", "audiosbooks", "news", "watching news", "reading newspaper","Blogging", "Sketching", "Dancing", "Writing", "Gardening", "Volunteering","Cycling", "DIY crafts", "Meditation", "Bird watching", "Yoga" ,"football", "dishes","Books"],
}

def get_field_context(field: str) -> str:
    field_contexts = {
        "fullName": "This is a person's full name. Consider common names and their variations.",
        "email": "This is an email address. Consider common email patterns and domains.",
        "phoneNumber": "This is a phone number. Consider common phone number patterns and area codes.",
        "linkedin": "This is a LinkedIn profile URL. Consider common LinkedIn URL patterns.",
        "institution": "This is an educational institution. Consider universities, colleges, and schools.",
        "degree": "This is an academic degree. Consider common degree types and abbreviations.",
        "CGPA": "This is a CGPA score. Consider values between 1.5 and 4.0.",
        "graduationYear": "This is a graduation year. Consider recent years and common graduation patterns.",
        "skills": "This is a technical skill. Consider programming languages, tools, and technologies.",
        "companyName": "This is a company name. Consider well-known companies and organizations.",
        "jobTitle": "This is a job title. Consider common professional roles and positions.",
        "duration": "This is a time period. Consider months, years, and date ranges.",
        "certifications": "This is a professional certification. Consider common industry certifications.",
        "hobbies": "This is a hobby or interest. Consider common recreational activities and interests."
    }
    return field_contexts.get(field, "")

def predict_suggestion(field: str, text: str):
    if not text.strip():
        return []

    normalized_field = field.split('_')[-1] if '_' in field else field
    words = text.split()
    last_word = words[-1] if words else text

    
    if normalized_field in ["institution", "degree", "graduationYear", "companyName", "jobTitle", "duration", "skills", "certifications"]:
        if normalized_field in FIELD_SUGGESTIONS:
            matching_suggestions = [
                option for option in FIELD_SUGGESTIONS[normalized_field]
                if option.lower().startswith(last_word.lower()) and option.lower() != last_word.lower()
            ]
            return matching_suggestions[:6] 
        return []

  
    if normalized_field == "CGPA":
        try:
            current_value = float(last_word) if last_word else 1.4
            suggestions = []
            for i in range(6):
                next_value = min(4.0, current_value + (i + 1) * 0.1)
                suggestions.append(f"{next_value:.1f}")
            return suggestions
        except ValueError:
            return ["1.5", "1.6", "1.7", "1.8", "1.9", "2.0"]
        return []

    if normalized_field in FIELD_SUGGESTIONS:
        matching_suggestions = [
            option for option in FIELD_SUGGESTIONS[normalized_field]
            if option.lower().startswith(last_word.lower()) and option.lower() != last_word.lower()
        ]
        if matching_suggestions:
            return [matching_suggestions[0]]
    return []

@app.post("/predict")
async def predict(request: PredictionRequest):
    suggestions = predict_suggestion(request.field, request.text.strip())
    return {"suggestions": suggestions}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)