import asyncio
import json
import random
from pathlib import Path
import sys

# Adjust path so we can import from app
sys.path.append(str(Path(__file__).parent.parent))

from app.main import _index_files, chat, metrics
from app.schemas import ChatRequest

SAMPLE_DOCS = [
    ("onboarding_guide.md", """# New Hire Onboarding
Welcome to the company! Please ensure you have requested access to the VPN.
Your first week will be mostly training. Remember to check the internal wiki.
The standard laptop replacement cycle is 3 years.
"""),
    ("architecture_notes.txt", """System Architecture v2
We use a microservices approach. The user service is written in Go.
The billing service runs on Node.js. Databases are primarily PostgreSQL.
Message queuing is handled by RabbitMQ. All services deploy to Kubernetes.
"""),
    ("support_faq.txt", """Q: How do I reset my password?
A: Go to the self-service portal at /reset.

Q: Who do I contact for payroll?
A: Email payroll-team@company.internal.

Q: Are pets allowed in the office?
A: Only certified service animals are permitted inside the building.
"""),
]

SAMPLE_QUESTIONS = [
    "How do I reset my password?",
    "What language is the user service written in?",
    "When do I get a new laptop?",
    "Can I bring my dog to work?",
    "Where is the billing service deployed?",
    "Who do I email for payroll issues?"
]

async def seed():
    print("Seeding database...")
    
    # 1. Upload mock documents
    files = [(name, content.encode("utf-8")) for name, content in SAMPLE_DOCS]
    try:
        await _index_files(files)
        print(f"Indexed {len(files)} documents.")
    except Exception as e:
        print(f"Error indexing files: {e}")
        return

    # 2. Simulate chats
    print("Simulating chat interactions...")
    num_chats = random.randint(15, 25)
    for _ in range(num_chats):
        q = random.choice(SAMPLE_QUESTIONS)
        req = ChatRequest(question=q, top_k=3, history=[])
        await chat(req)
        
    print(f"Simulated {num_chats} chat sessions.")
    print(f"Current Metrics: {json.dumps(metrics, indent=2)}")
    print("Done seeding data!")

if __name__ == "__main__":
    asyncio.run(seed())
