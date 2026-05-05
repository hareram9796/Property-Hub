from fastapi import APIRouter
from models import EnquiryIn

router = APIRouter()

enquiries = []

@router.post("/")
def send_enquiry(data: EnquiryIn):
    enquiries.append(data.dict())
    return {"message": "Enquiry received! We will contact you shortly.", "id": len(enquiries)}

@router.get("/")
def get_enquiries():
    return enquiries
