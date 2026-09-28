# #currently it has OCR+LLM Extraction Pre-Mock Test and Incentive Scheme Matching System!! 
# import os
# import json
# import easyocr
# import fitz  # PyMuPDF
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from pymongo import MongoClient
# from bson.objectid import ObjectId
# from google import genai
# from google.genai import types
# from email.message import EmailMessage
# from google.auth.transport.requests import Request
# from google.oauth2.credentials import Credentials
# from google_auth_oauthlib.flow import InstalledAppFlow
# from googleapiclient.discovery import build

# from langchain_core.output_parsers import JsonOutputParser
# from langchain_core.prompts import PromptTemplate
# from langchain_google_genai import ChatGoogleGenerativeAI

# from pydantic import BaseModel, Field

# app = Flask(__name__)
# CORS(app)

# # --- CONFIGURATION ---
# MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/mern_db")
# GEMINI_API_KEY = os.getenv("geminiapikey", "geminiapikey")

# if not GEMINI_API_KEY:
#     raise RuntimeError(
#         "GEMINI_API_KEY not found in .env"
#     )


# client = MongoClient(MONGODB_URI)
# db = client["mern_db"]
# business_profiles = db["business_profile"]

# ocr_reader = easyocr.Reader(['en'])
# ai_client = genai.Client(api_key=GEMINI_API_KEY)


# SENDER_EMAIL = os.getenv(
#     "SENDER_EMAIL",
#     "fahadsyed2705@gmail.com"
# )

# # --- MAHARASHTRA POLICIES & SCHEMES KNOWLEDGE BASE ---
# MAHARASHTRA_POLICIES = [
#     {
#         "id": "MH_EV_2021",
#         "name": "Electric Vehicle Policy 2021",
#         "file": "Electric Vehicle Policy 2021.pdf",
#         "sectors": ["Automotive", "Electric Vehicles", "Clean Energy"],
#         "msme_types": ["MICRO", "SMALL", "MEDIUM", "LARGE"],
#         "min_investment": 0,
#         "districts": "ALL"
#     },
#     {
#         "id": "MH_TEXTILE_2018_23",
#         "name": "Textile Policy 2018-2023",
#         "file": "Textile Policy 2018-2023.pdf",
#         "sectors": ["Textile", "Apparel", "Garments"],
#         "msme_types": ["MICRO", "SMALL", "MEDIUM"],
#         "min_investment": 1000000,
#         "districts": "ALL"
#     },
#     {
#         "id": "MH_IND_2019",
#         "name": "Maharashtra New Industrial Policy 2019",
#         "file": "Maharashtra New Industrial Policy 2019.pdf",
#         "sectors": ["Manufacturing", "Pharmaceuticals", "Engineering", "Chemicals"],
#         "msme_types": ["MICRO", "SMALL", "MEDIUM", "LARGE"],
#         "min_investment": 5000000,
#         "districts": "ALL"
#     },
#     {
#         "id": "MH_PSI_2019",
#         "name": "Maharashtra Package Scheme of Incentives 2019",
#         "file": "Maharashtra Package Scheme of Incentives 2019.pdf",
#         "sectors": ["Manufacturing", "Pharmaceuticals", "Textile", "Food Processing"],
#         "msme_types": ["MICRO", "SMALL", "MEDIUM", "LARGE"],
#         "min_investment": 10000000,
#         "districts": "ALL"
#     },
#     {
#         "id": "MH_STARTUP_2018",
#         "name": "Start-up-Policy 2018",
#         "file": "Start-up-Policy 2018.pdf",
#         "sectors": ["ALL"],
#         "msme_types": ["MICRO", "SMALL"],
#         "min_investment": 0,
#         "districts": "ALL"
#     },
#     {
#         "id": "MH_AERO_DEF_2018",
#         "name": "Aerospace and Defence Policy 2018",
#         "file": "Aerospace and Defence Policy 2018.pdf",
#         "sectors": ["Aerospace", "Defence", "Precision Engineering"],
#         "msme_types": ["SMALL", "MEDIUM", "LARGE"],
#         "min_investment": 20000000,
#         "districts": ["Nagpur", "Pune", "Nashik", "Palghar"]
#     }
# ]

# # --- UTILITY: OCR EXTRACTION ---
# def extract_text_from_file(file_path):
#     ext = file_path.split('.')[-1].lower()
#     text = ""
#     if ext in ['png', 'jpg', 'jpeg']:
#         results = ocr_reader.readtext(file_path, detail=0)
#         text = " ".join(results)
#     elif ext == 'pdf':
#         doc = fitz.open(file_path)
#         for page in doc:
#             text += page.get_text()
#         if len(text.strip()) < 50:  # Fallback to OCR if scanned PDF
#             for page_index in range(len(doc)):
#                 page = doc[page_index]
#                 pix = page.get_pixmap()
#                 img_bytes = pix.tobytes("png")
#                 res = ocr_reader.readtext(img_bytes, detail=0)
#                 text += " ".join(res)
#     return text


# # --- ENDPOINT 1: PRE-VALIDATION OF DOCUMENTS ---
# @app.route('/api/pre-validate-document', methods=['POST'])
# def pre_validate_document():
#     profile_id = request.form.get('profileId')
#     user_id = request.form.get('userId')
#     doc_file = request.files.get('document')

#     if not profile_id or not doc_file:
#         return jsonify({"error": "Missing profileId or document file"}), 400

#     # Fetch MongoDB Profile
#     profile = business_profiles.find_one({"profileId": profile_id})
#     if not profile:
#         return jsonify({"error": "Business profile not found"}), 404

#     # Convert Mongo Object to Dict string (drop ObjectId for JSON safely)
#     profile.pop('_id', None)
    
#     # Save temp uploaded file
#     temp_path = f"/tmp/{doc_file.filename}"
#     doc_file.save(temp_path)

#     # Perform OCR
#     extracted_text = extract_text_from_file(temp_path)
#     os.remove(temp_path)

#     # Prompt Engineering for Structured Gemini Evaluation
#     prompt = f"""
#     You are an official verification officer auditing business documents for Maharashtra Government approvals.
    
#     EXPECTED USER BUSINESS PROFILE (MongoDB Truth Data):
#     {json.dumps(profile, indent=2, default=str)}

#     EXTRACTED TEXT FROM UPLOADED DOCUMENT (via OCR):
#     {extracted_text}

#     TASK:
#     1. Compare the extracted document text against the business profile data (Check PAN, CIN/LLPIN, Business Name, Entity Type like Pvt Ltd vs LLP, Address, GSTIN, etc.).
#     2. Identify specific discrepancies or entity type mismatches (e.g. written as LLP when profile states Private Limited).
#     3. Calculate a Validation Match Score out of 100.
#     4. List exact actionable mistakes the user must correct before submitting to the official government portal.

#     Return JSON only with keys:
#     - "validationScore": number,
#     - "isEligibleForDirectSubmission": boolean,
#     - "foundMistakes": list of strings,
#     - "detailedAnalysis": string
#     """

#     response = ai_client.models.generate_content(
#         model='gemini-2.5-flash',
#         contents=prompt,
#         config=types.GenerateContentConfig(
#             response_mime_type="application/json"
#         )
#     )

#     return jsonify(json.loads(response.text)), 200


# # --- ENDPOINT 2: INCENTIVE & SCHEME MATCHING ---
# @app.route('/api/match-schemes', methods=['POST'])
# def match_schemes():
#     data = request.json or {}
#     business_name = data.get('businessName')
#     profile_id = data.get('profileId')
#     pan = data.get('pan')

#     if not (business_name and profile_id and pan):
#         return jsonify({"error": "Please provide businessName, profileId, and pan"}), 400

#     # Fetch MongoDB Unified Profile using 3 primary keys
#     profile = business_profiles.find_one({
#         "profileId": profile_id,
#         "businessName": business_name,
#         "pan": pan
#     })

#     if not profile:
#         return jsonify({"error": "Invalid business credentials. Profile match failed."}), 404

#     profile.pop('_id', None)

#     # Step 1: Rule Engine Filtering
#     matched_schemes = []
#     user_sector = profile.get("sector", "").lower()
#     user_investment = profile.get("investment", 0)
#     user_msme = profile.get("msmeCategory", "MICRO").upper()

#     for policy in MAHARASHTRA_POLICIES:
#         sector_match = "ALL" in policy["sectors"] or any(s.lower() in user_sector for s in policy["sectors"])
#         msme_match = user_msme in policy["msme_types"]
#         investment_match = user_investment >= policy["min_investment"]

#         if sector_match and msme_match and investment_match:
#             matched_schemes.append(policy)

#     # Step 2: AI Summarization & Synthesis for Matched Schemes
#     prompt = f"""
#     Given this Unified Business Profile:
#     {json.dumps(profile, indent=2, default=str)}

#     And these pre-matched Maharashtra Policies/Schemes:
#     {json.dumps(matched_schemes, indent=2)}

#     Generate a tailored breakdown for each matched scheme detailing:
#     1. Why this business qualifies under Maharashtra industrial norms.
#     2. Key monetary/tax incentives or land concessions they can claim based on their investment (₹{profile.get('investment')}) and worker count ({profile.get('workers')}).
#     3. Specific compliance prerequisites.

#     Return JSON array of objects with keys: "schemeId", "schemeName", "matchConfidence", "incentiveSummary", "eligibleBenefits".
#     """

#     ai_response = ai_client.models.generate_content(
#         model='gemini-2.5-flash',
#         contents=prompt,
#         config=types.GenerateContentConfig(
#             response_mime_type="application/json"
#         )
#     )

#     return jsonify({
#         "profile": {
#             "businessName": profile.get("businessName"),
#             "profileId": profile.get("profileId"),
#             "sector": profile.get("sector"),
#             "msmeCategory": profile.get("msmeCategory")
#         },
#         "matchedSchemes": json.loads(ai_response.text)
#     }), 200

# if __name__ == '__main__':
#     app.run(port=8000, debug=True)


import os
import json
import re
import base64

import easyocr
import fitz  # PyMuPDF

from flask import Flask, request, jsonify
from flask_cors import CORS

from pymongo import MongoClient
from bson.objectid import ObjectId

from google import genai
from google.genai import types

# ============================================================
# SLA ESCALATION IMPORTS
# ============================================================

from email.message import EmailMessage

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from pathlib import Path

from dotenv import load_dotenv
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from pydantic import BaseModel, Field


# ============================================================
# FLASK APP
# ============================================================

app = Flask(__name__)
CORS(app)


# ============================================================
# CONFIGURATION
# ============================================================

BACKEND_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BACKEND_DIR / ".env")

MONGODB_URI = (
    os.getenv("MONGODB_URI")
    or os.getenv("MONGO_URI")
    or "mongodb://localhost:27017/mern_db"
)

MAIN_DB_NAME = (
    os.getenv("MAIN_DB_NAME")
    or "BeeSetu"
)

GEMINI_API_KEY = (
    os.getenv("geminiapikey")
    or os.getenv("GEMINI_API_KEY")
    or "geminiapikey"
)

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY not found in .env"
    )


# ============================================================
# MONGODB
# ============================================================

client = MongoClient(MONGODB_URI)

db = client[MAIN_DB_NAME]

business_profiles = db["business_profiles"]


# ============================================================
# OCR
# ============================================================

ocr_reader = easyocr.Reader(['en'])


# ============================================================
# GEMINI CLIENT
# ============================================================

ai_client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ============================================================
# SLA ESCALATION - GMAIL CONFIGURATION
# ============================================================

SENDER_EMAIL = os.getenv(
    "SENDER_EMAIL",
    "fahadsyed2705@gmail.com"
)

SCOPES = [
    "https://www.googleapis.com/auth/gmail.send"
]

# credentials.json and token.json are kept beside app.py
BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

TOKEN_FILE = os.path.join(
    BASE_DIR,
    "token.json"
)

CREDENTIALS_FILE = os.path.join(
    BASE_DIR,
    "credentials.json"
)
'''documents looks goood thanksss KYA aint wokring  for now  add static cards of depts like apprvoals reqyired documents reuqired fro all for now!!!!!!!!!!and sho jpint inspectino shecduing where it coudl be possibel okayand my buiness prfiles have msmefastlane feature alsoooo show that not appilable where it is big indsurties liek chmicla ausot and all retaild and small gets a tick msme fast lane aisaa and msme nto fats lane gets red tcik hpver krne pe it shows not msme fast lane eliglbe  soo 3 relaetd to KYA statci but msme fast lane dynamic plss from mngodb also !!!!in future we will use temporal or celery whichver is easyy clearly showwwww haaaa joint inspection shcedulinggggggggggggg okay and kya's must be clearrrr big good cards that shows the flowand sla info there as weell as fees acc to inda mahrashtra 0226 rules necessary and SLA just modify the UI and okay reduce the manual intervention and on home page add a card and nowwwwwww also add a card fro incentive shcme matching in python code theer its is written most of teh code all the rule engine for that soo yaa add a card for taht also shwo buinness good cards whihc shceme theyu are applicabela nd show a link os that they can be redirected to orgincal document fro now keep th elink static make the ifnal changes i wont complain plsplssplsplslsslpsllps dude'''

# ============================================================
# MAHARASHTRA POLICIES & SCHEMES KNOWLEDGE BASE
# ============================================================

MAHARASHTRA_POLICIES = [

    {
        "id": "MH_EV_2021",
        "name": "Electric Vehicle Policy 2021",
        "file": "Electric Vehicle Policy 2021.pdf",
        "sectors": [
            "Automotive",
            "Electric Vehicles",
            "Clean Energy"
        ],
        "msme_types": [
            "MICRO",
            "SMALL",
            "MEDIUM",
            "LARGE"
        ],
        "min_investment": 0,
        "districts": "ALL"
    },

    {
        "id": "MH_TEXTILE_2018_23",
        "name": "Textile Policy 2018-2023",
        "file": "Textile Policy 2018-2023.pdf",
        "sectors": [
            "Textile",
            "Apparel",
            "Garments"
        ],
        "msme_types": [
            "MICRO",
            "SMALL",
            "MEDIUM"
        ],
        "min_investment": 1000000,
        "districts": "ALL"
    },

    {
        "id": "MH_IND_2019",
        "name": "Maharashtra New Industrial Policy 2019",
        "file": "Maharashtra New Industrial Policy 2019.pdf",
        "sectors": [
            "Manufacturing",
            "Pharmaceuticals",
            "Engineering",
            "Chemicals"
        ],
        "msme_types": [
            "MICRO",
            "SMALL",
            "MEDIUM",
            "LARGE"
        ],
        "min_investment": 5000000,
        "districts": "ALL"
    },

    {
        "id": "MH_PSI_2019",
        "name": "Maharashtra Package Scheme of Incentives 2019",
        "file": "Maharashtra Package Scheme of Incentives 2019.pdf",
        "sectors": [
            "Manufacturing",
            "Pharmaceuticals",
            "Textile",
            "Food Processing"
        ],
        "msme_types": [
            "MICRO",
            "SMALL",
            "MEDIUM",
            "LARGE"
        ],
        "min_investment": 10000000,
        "districts": "ALL"
    },

    {
        "id": "MH_STARTUP_2018",
        "name": "Start-up-Policy 2018",
        "file": "Start-up-Policy 2018.pdf",
        "sectors": [
            "ALL"
        ],
        "msme_types": [
            "MICRO",
            "SMALL"
        ],
        "min_investment": 0,
        "districts": "ALL"
    },

    {
        "id": "MH_AERO_DEF_2018",
        "name": "Aerospace and Defence Policy 2018",
        "file": "Aerospace and Defence Policy 2018.pdf",
        "sectors": [
            "Aerospace",
            "Defence",
            "Precision Engineering"
        ],
        "msme_types": [
            "SMALL",
            "MEDIUM",
            "LARGE"
        ],
        "min_investment": 20000000,
        "districts": [
            "Nagpur",
            "Pune",
            "Nashik",
            "Palghar"
        ]
    }
]


# ============================================================
# UTILITY: OCR EXTRACTION
# ============================================================

def extract_text_from_file(file_path):

    ext = file_path.split('.')[-1].lower()

    text = ""

    if ext in ['png', 'jpg', 'jpeg']:

        results = ocr_reader.readtext(
            file_path,
            detail=0
        )

        text = " ".join(results)

    elif ext == 'pdf':

        doc = fitz.open(file_path)

        for page in doc:

            text += page.get_text()

        # Fallback OCR for scanned PDF
        if len(text.strip()) < 50:

            for page_index in range(len(doc)):

                page = doc[page_index]

                pix = page.get_pixmap()

                img_bytes = pix.tobytes("png")

                res = ocr_reader.readtext(
                    img_bytes,
                    detail=0
                )

                text += " ".join(res)

    return text


# ============================================================
# ENDPOINT 1:
# PRE-VALIDATION OF DOCUMENTS
# ============================================================

@app.route(
    '/api/pre-validate-document',
    methods=['POST']
)
def pre_validate_document():

    profile_id = request.form.get(
        'profileId'
    )

    user_id = request.form.get(
        'userId'
    )

    doc_file = request.files.get(
        'document'
    )

    if not profile_id or not doc_file:

        return jsonify({
            "error":
                "Missing profileId or document file"
        }), 400


    # Fetch MongoDB Profile strictly for the authenticated user

    query = {"profileId": profile_id}
    if user_id:
        query["userId"] = str(user_id).strip()

    profile = business_profiles.find_one(query)

    if not profile:

        return jsonify({
            "error":
                "Business profile not found"
        }), 404


    # Remove Mongo ObjectId

    profile.pop(
        '_id',
        None
    )


    # Save temporary uploaded file

    temp_path = (
        f"/tmp/{doc_file.filename}"
    )

    doc_file.save(
        temp_path
    )


    # Perform OCR

    extracted_text = extract_text_from_file(
        temp_path
    )


    os.remove(
        temp_path
    )


    # Gemini validation prompt

    prompt = f"""

You are an official verification officer auditing business
documents for Maharashtra Government approvals.

EXPECTED USER BUSINESS PROFILE:

{json.dumps(
    profile,
    indent=2,
    default=str
)}

EXTRACTED TEXT FROM UPLOADED DOCUMENT:

{extracted_text}

TASK:

1. Compare extracted document text against business profile data.

2. Check PAN, CIN/LLPIN, Business Name, Entity Type,
   Address, GSTIN, etc.

3. Identify discrepancies.

4. Identify entity type mismatches.

5. Calculate a Validation Match Score out of 100.

6. List actionable mistakes the user must correct.

Return JSON only with keys:

- validationScore
- isEligibleForDirectSubmission
- foundMistakes
- detailedAnalysis

"""


    response = ai_client.models.generate_content(

        model='gemini-3.5-flash',

        contents=prompt,

        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )


    return jsonify(
        json.loads(response.text)
    ), 200


# ============================================================
# ENDPOINT 2:
# INCENTIVE & SCHEME MATCHING
# ============================================================

@app.route(
    '/api/match-schemes',
    methods=['POST']
)
def match_schemes():

    data = request.json or {}

    business_name = data.get(
        'businessName'
    )

    profile_id = data.get(
        'profileId'
    )

    user_id = data.get(
        'userId'
    )

    pan = data.get(
        'pan'
    )


    if not (
        business_name
        and profile_id
        and pan
    ):

        return jsonify({
            "error":
                "Please provide businessName, profileId, and pan"
        }), 400


    normalized_profile_id = str(profile_id).strip()
    normalized_business_name = str(business_name).strip()
    normalized_pan = str(pan).strip().upper()

    # Fetch MongoDB Unified Profile strictly for the active user
    profile_query = {
        "profileId": normalized_profile_id,
        "businessName": {
            "$regex": f"^{re.escape(normalized_business_name)}$",
            "$options": "i"
        },
        "pan": normalized_pan
    }
    if user_id:
        profile_query["userId"] = str(user_id).strip()

    profile = business_profiles.find_one(profile_query)


    if not profile:

        return jsonify({
            "error":
                "Invalid business credentials. Profile match failed."
        }), 404


    profile.pop(
        '_id',
        None
    )


    # Step 1: Rule Engine Filtering

    matched_schemes = []

    user_sector = profile.get(
        "sector",
        ""
    ).lower()

    user_investment = profile.get(
        "investment",
        0
    )

    user_msme = profile.get(
        "msmeCategory",
        "MICRO"
    ).upper()


    for policy in MAHARASHTRA_POLICIES:

        sector_match = (
            "ALL" in policy["sectors"]
            or any(
                s.lower() in user_sector
                for s in policy["sectors"]
            )
        )

        msme_match = (
            user_msme
            in policy["msme_types"]
        )

        investment_match = (
            user_investment
            >= policy["min_investment"]
        )


        if (
            sector_match
            and msme_match
            and investment_match
        ):

            matched_schemes.append(
                policy
            )


    # Step 2: Rule-based scheme cards without AI narration.
    # The result stays dynamic and is derived only from the real
    # Mongo business profile and policy thresholds.

    scheme_cards = []
    for policy in matched_schemes:
        sector_score = 35
        investment_score = min(30, max(0, int((user_investment / max(policy["min_investment"], 1)) * 20)))
        msme_score = 25 if user_msme in policy["msme_types"] else 10
        confidence = min(97, max(70, sector_score + investment_score + msme_score))

        benefit_map = {
            "MH_EV_2021": ["EV capital subsidy", "power tariff relief", "infrastructure support"],
            "MH_TEXTILE_2018_23": ["textile unit subsidy", "working capital support", "cluster incentives"],
            "MH_IND_2019": ["capital subsidy", "land assistance", "tax rebate support"],
            "MH_PSI_2019": ["state incentive support", "capital subsidy", "power and utility rebate"],
            "MH_STARTUP_2018": ["startup support", "innovation assistance", "market facilitation"],
            "MH_AERO_DEF_2018": ["defence manufacturing incentives", "land support", "technology upgrade assistance"]
        }

        scheme_cards.append({
            "schemeId": policy["id"],
            "schemeName": policy["name"],
            "matchConfidence": confidence,
            "incentiveSummary": "Matched by sector, investment and MSME criteria.",
            "eligibleBenefits": benefit_map.get(policy["id"], ["state incentive support"])
        })

    return jsonify({

        "profile": {

            "businessName":
                profile.get(
                    "businessName"
                ),

            "profileId":
                profile.get(
                    "profileId"
                ),

            "sector":
                profile.get(
                    "sector"
                ),

            "msmeCategory":
                profile.get(
                    "msmeCategory"
                )
        },

        "matchedSchemes":
            scheme_cards

    }), 200


# ============================================================
# ============================================================
# SLA ESCALATION ENGINE
# ============================================================
#
# FLOW:
#
# React
#   ↓
# POST /api/escalate
#   ↓
# Flask
#   ↓
# Gemini generates formal escalation email
#   ↓
# Gmail API
#   ↓
# Authority receives email
#   ↓
# Flask returns success to React
#
# IMPORTANT:
# This section is completely separate from:
# - OCR
# - Document pre-validation
# - Incentive matching
# - Existing MongoDB logic
#
# ============================================================


# ============================================================
# SLA EMAIL OUTPUT MODEL
# ============================================================

class EscalationEmailSchema(BaseModel):

    to: str = Field(
        description=
            "Designation of authority receiving escalation"
    )

    subject: str = Field(
        description=
            "Formal subject line"
    )

    body: str = Field(
        description=
            "Formal escalation email body"
    )


# ============================================================
# JSON PARSER FOR GEMINI
# ============================================================

escalation_parser = JsonOutputParser(
    pydantic_object=
        EscalationEmailSchema
)


# ============================================================
# GEMINI MODEL FOR ESCALATION
# ============================================================

escalation_model = ChatGoogleGenerativeAI(

    model="gemini-2.5-flash",

    api_key=GEMINI_API_KEY,

    temperature=0.1
)


# ============================================================
# ESCALATION EMAIL PROMPT
# ============================================================

escalation_template = PromptTemplate(

    input_variables=[
        "subject_of_mail",
        "email_id",
        "name",
        "link",
        "phone",
        "rec_name",
        "context_extracted_fdoc"
    ],

    partial_variables={
        "format_instructions":
            escalation_parser
            .get_format_instructions()
    },

    template="""

You are an expert executive communications
specialist writing official administrative
correspondence for an Indian government
approval-monitoring platform called BeSetu.

The purpose of this email is to escalate an
APPLICATION whose statutory/service-level
processing period has been breached.

The email is addressed to the designated
senior authority responsible for the
approval/escalation.

IMPORTANT:

1. Treat supplied approval information as
   authoritative.

2. NEVER invent an application number,
   date, amount, SLA, authority, department,
   legal provision, or factual event.

3. NEVER modify numerical values.

4. NEVER claim that an approval has legally
   become "deemed approved" unless supplied
   context explicitly states this.

5. SLA breach is NOT automatically the same
   as deemed approval.

6. Do not threaten the officer.

7. Do not accuse the department of negligence,
   corruption, misconduct, or intentional delay.

8. Do not make unsupported legal conclusions.

9. Respectfully request review and appropriate
   action.

10. Mention SLA breach clearly and factually.

11. Ask for necessary action/decision.

12. Keep the communication appropriate for
    official government correspondence.

13. Do not use markdown.

14. Do not use bullet points.

15. Do not use emojis.

16. Do not use unnecessary legal jargon.

17. Keep the email between 80 and 130 words.

End exactly with:

Yours faithfully,
{name}

SENDER INFORMATION:

Name: {name}
Phone: {phone}
LinkedIn: {link}

RECIPIENT DESIGNATION:

{rec_name}

TARGET EMAIL:

{email_id}

PROPOSED SUBJECT:

{subject_of_mail}

ESCALATION CONTEXT:

{context_extracted_fdoc}

The email should communicate:

- what approval is pending
- application identifier
- application submission date
- applicable SLA
- due date
- number of breached days
- current status
- respectful request for review/action

Do not add facts that are not supplied.

Return ONLY valid JSON.

{format_instructions}

"""
)


# ============================================================
# LCEL ESCALATION CHAIN
# ============================================================

escalation_chain = (
    escalation_template
    | escalation_model
    | escalation_parser
)


# ============================================================
# GMAIL AUTHENTICATION
# ============================================================

def get_gmail_service():

    creds = None


    # Existing OAuth token

    if os.path.exists(
        TOKEN_FILE
    ):

        creds = (
            Credentials
            .from_authorized_user_file(
                TOKEN_FILE,
                SCOPES
            )
        )


    # Refresh expired token

    if (
        creds
        and creds.expired
        and creds.refresh_token
    ):

        creds.refresh(
            Request()
        )


    # First-time authentication

    if not creds or not creds.valid:

        if not os.path.exists(
            CREDENTIALS_FILE
        ):

            raise FileNotFoundError(
                "credentials.json not found. "
                "Place credentials.json beside app.py."
            )


        flow = (
            InstalledAppFlow
            .from_client_secrets_file(
                CREDENTIALS_FILE,
                SCOPES
            )
        )


        creds = (
            flow.run_local_server(
                port=0
            )
        )


        # Save OAuth token

        with open(
            TOKEN_FILE,
            "w"
        ) as token:

            token.write(
                creds.to_json()
            )


    # Build Gmail service

    service = build(
        "gmail",
        "v1",
        credentials=creds
    )


    return service


# ============================================================
# SEND EMAIL THROUGH GMAIL API
# ============================================================

def send_escalation_email(
    service,
    recipient,
    subject,
    body
):

    message = EmailMessage()


    message.set_content(
        body
    )


    message["To"] = recipient

    message["From"] = SENDER_EMAIL

    message["Subject"] = subject


    encoded_message = (
        base64
        .urlsafe_b64encode(
            message.as_bytes()
        )
        .decode()
    )


    create_message = {
        "raw":
            encoded_message
    }


    sent_message = (
        service
        .users()
        .messages()
        .send(
            userId="me",
            body=create_message
        )
        .execute()
    )


    return sent_message


# ============================================================
# GENERATE SLA ESCALATION EMAIL
# ============================================================

def generate_escalation_email(
    data
):

    # Build factual context supplied by
    # BeSetu's SLA system.

    context_extracted_fdoc = f"""

Approval:
{data["approval_name"]}

Application ID:
{data["application_id"]}

Applicant:
{data["applicant_name"]}

Industry Category:
{data.get("industry_category", "Not provided")}

Capital Investment:
{data.get("capital_investment", "Not provided")}

Department:
{data["department"]}

Jurisdiction:
{data.get("jurisdiction", "Maharashtra")}

Application Date:
{data["application_date"]}

Statutory SLA:
{data["statutory_sla_days"]} days

Due Date:
{data["due_date"]}

Current Date:
{data["current_date"]}

Days Breached:
{data["days_breached"]}

Current Status:
{data["current_status"]}

Escalation Level:
{data["escalation_level"]}

"""


    subject = (
        "Request for Review of SLA-Breached "
        f"{data['approval_name']} Application "
        f"{data['application_id']}"
    )


    # Gemini creates the formal email.

    result = escalation_chain.invoke({

        "subject_of_mail":
            subject,

        "email_id":
            data["recipient_email"],

        "name":
            data["sender_name"],

        "link":
            data.get(
                "sender_link",
                "https://besetu.example"
            ),

        "phone":
            data.get(
                "sender_phone",
                "Not provided"
            ),

        "rec_name":
            data["escalation_level"],

        "context_extracted_fdoc":
            context_extracted_fdoc

    })


    return result


# ============================================================
# SLA ESCALATION API
# ============================================================
#
# React calls:
#
# POST http://localhost:8000/api/escalate
#
# The request body contains the actual SLA/application data.
#
# ============================================================

@app.route(
    '/api/escalate',
    methods=['POST']
)
def raise_escalation():

    try:

        data = request.get_json()


        # ----------------------------------------------------
        # Validate request body
        # ----------------------------------------------------

        if not data:

            return jsonify({

                "success":
                    False,

                "error":
                    "Request body is required"

            }), 400


        # ----------------------------------------------------
        # Required fields
        # ----------------------------------------------------

        required_fields = [

            "approval_name",

            "application_id",

            "applicant_name",

            "application_date",

            "statutory_sla_days",

            "due_date",

            "current_date",

            "days_breached",

            "current_status",

            "department",

            "escalation_level",

            "recipient_email",

            "sender_name"

        ]


        missing_fields = [

            field

            for field in required_fields

            if not data.get(field)

        ]


        if missing_fields:

            return jsonify({

                "success":
                    False,

                "error":
                    "Missing required fields",

                "missing":
                    missing_fields

            }), 400


        # ----------------------------------------------------
        # Verify SLA breach
        # ----------------------------------------------------

        try:

            days_breached = int(
                data["days_breached"]
            )

        except (
            ValueError,
            TypeError
        ):

            return jsonify({

                "success":
                    False,

                "error":
                    "days_breached must be a number"

            }), 400


        if days_breached <= 0:

            return jsonify({

                "success":
                    False,

                "error":
                    "Escalation can only be raised after an SLA breach"

            }), 400


        print("")
        print(
            "=========================================="
        )
        print(
            "       BEESETU SLA ESCALATION"
        )
        print(
            "=========================================="
        )


        print(
            f"Application : "
            f"{data['application_id']}"
        )

        print(
            f"Approval    : "
            f"{data['approval_name']}"
        )

        print(
            f"Days Breached : "
            f"{days_breached}"
        )

        print(
            f"Recipient : "
            f"{data['recipient_email']}"
        )


        # ----------------------------------------------------
        # STEP 1:
        # Generate official email using Gemini
        # ----------------------------------------------------

        print(
            "[1] Generating escalation email..."
        )


        email_data = (
            generate_escalation_email(
                data
            )
        )


        print(
            "[2] Email generated successfully"
        )


        print(
            f"Subject: "
            f"{email_data['subject']}"
        )


        # ----------------------------------------------------
        # STEP 2:
        # Authenticate Gmail
        # ----------------------------------------------------

        print(
            "[3] Authenticating Gmail..."
        )


        gmail_service = (
            get_gmail_service()
        )


        # ----------------------------------------------------
        # STEP 3:
        # Send email
        # ----------------------------------------------------

        print(
            "[4] Sending escalation email..."
        )


        sent_message = (
            send_escalation_email(

                service=
                    gmail_service,

                recipient=
                    data["recipient_email"],

                subject=
                    email_data["subject"],

                body=
                    email_data["body"]

            )
        )


        print(
            "[5] Escalation sent successfully"
        )


        print(
            f"Gmail Message ID: "
            f"{sent_message.get('id')}"
        )


        print(
            "=========================================="
        )


        # ----------------------------------------------------
        # STEP 4:
        # Return result to React
        # ----------------------------------------------------

        return jsonify({

            "success":
                True,

            "message":
                "SLA escalation email sent successfully",

            "application_id":
                data["application_id"],

            "recipient":
                data["recipient_email"],

            "subject":
                email_data["subject"],

            "email_body":
                email_data["body"],

            "gmail_message_id":
                sent_message.get("id"),

            "status":
                "ESCALATION_SENT"

        }), 200


    except Exception as error:

        print(
            "[SLA ESCALATION ERROR]",
            str(error)
        )


        return jsonify({

            "success":
                False,

            "error":
                "Failed to send SLA escalation",

            "details":
                str(error)

        }), 500


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route(
    '/api/health',
    methods=['GET']
)
def health_check():

    return jsonify({

        "success":
            True,

        "service":
            "BeSetu Python AI Services",

        "status":
            "running",

        "features": [

            "OCR",

            "Document Pre-Validation",

            "Incentive Scheme Matching",

            "SLA Escalation",

            "Gemini",

            "Gmail API"

        ]

    }), 200


# ============================================================
# APPLICATION START
# ============================================================

if __name__ == '__main__':

    print("")
    print(
        "=========================================="
    )
    print(
        "       BEESETU PYTHON AI SERVER"
    )
    print(
        "=========================================="
    )

    print(
        "OCR + Document Validation : ENABLED"
    )

    print(
        "Incentive Matching        : ENABLED"
    )

    print(
        "SLA Escalation            : ENABLED"
    )

    print(
        "Gemini                    : ENABLED"
    )

    print(
        "Gmail API                 : ENABLED"
    )

    print(
        "Server                    : http://localhost:8000"
    )

    print(
        "=========================================="
    )
    print("")


    app.run(
        port=8000,
        debug=True
    )