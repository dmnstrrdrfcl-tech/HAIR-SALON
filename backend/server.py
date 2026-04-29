from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="SERENDIPITY Salon API")
api_router = APIRouter(prefix="/api")


# ---------- Static catalog ----------
SERVICES = [
    {"id": "corte", "name": "Corte de Cabello", "description": "Cortes modernos y personalizados por estilistas expertos.", "duration": 45, "price": 35, "icon": "scissors"},
    {"id": "tinte", "name": "Tinte y Color", "description": "Coloración profesional, mechas, balayage y técnicas premium.", "duration": 120, "price": 95, "icon": "palette"},
    {"id": "peinado", "name": "Peinados", "description": "Peinados para eventos, bodas y ocasiones especiales.", "duration": 60, "price": 55, "icon": "sparkles"},
    {"id": "tratamiento", "name": "Tratamientos Capilares", "description": "Hidratación profunda, keratina y reparación capilar.", "duration": 75, "price": 70, "icon": "droplet"},
]

STYLISTS = [
    {"id": "sofia", "name": "Sofía Vega", "role": "Directora Creativa", "specialty": "Colorimetría & Balayage", "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80"},
    {"id": "mateo", "name": "Mateo Ríos", "role": "Master Barber", "specialty": "Cortes masculinos & Fade", "image": "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=600&auto=format&fit=crop&q=80"},
    {"id": "luna", "name": "Luna Castaño", "role": "Estilista Senior", "specialty": "Peinados de novia", "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80"},
    {"id": "diego", "name": "Diego Márquez", "role": "Especialista en Tratamientos", "specialty": "Keratina & Reparación", "image": "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=600&auto=format&fit=crop&q=80"},
]

TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "15:00", "16:00", "17:00", "18:00", "19:00"]

GALLERY = [
    {"id": "g1", "url": "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&auto=format&fit=crop&q=80", "title": "Corte Minimal", "category": "Corte"},
    {"id": "g2", "url": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&auto=format&fit=crop&q=80", "title": "Balayage Dorado", "category": "Color"},
    {"id": "g3", "url": "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&auto=format&fit=crop&q=80", "title": "Peinado Editorial", "category": "Peinado"},
    {"id": "g4", "url": "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1200&auto=format&fit=crop&q=80", "title": "Fade Preciso", "category": "Corte"},
    {"id": "g5", "url": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=1200&auto=format&fit=crop&q=80", "title": "Brillo Natural", "category": "Tratamiento"},
    {"id": "g6", "url": "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=1200&auto=format&fit=crop&q=80", "title": "Color Rosado", "category": "Color"},
    {"id": "g7", "url": "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=1200&auto=format&fit=crop&q=80", "title": "Ondas Suaves", "category": "Peinado"},
    {"id": "g8", "url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80", "title": "Estilo Urbano", "category": "Corte"},
]

TESTIMONIALS = [
    {"id": "t1", "name": "Carolina M.", "rating": 5, "text": "Una experiencia cinco estrellas. Sofía transformó completamente mi look. El lugar es hermoso y el trato impecable.", "service": "Balayage"},
    {"id": "t2", "name": "Andrés P.", "rating": 5, "text": "Mejor barbería de la ciudad. Mateo es un artista. Salgo renovado cada vez que voy.", "service": "Corte & Fade"},
    {"id": "t3", "name": "Valentina R.", "rating": 5, "text": "El peinado para mi boda fue un sueño. Luna entiende perfectamente lo que necesitas.", "service": "Peinado de novia"},
    {"id": "t4", "name": "Jorge L.", "rating": 5, "text": "Tratamiento de keratina excepcional. Mi cabello nunca se sintió tan saludable.", "service": "Keratina"},
    {"id": "t5", "name": "María F.", "rating": 5, "text": "Atmósfera elegante y profesional. Cada detalle cuidado. Totalmente recomendado.", "service": "Corte & Color"},
]


# ---------- Models ----------
class BookingCreate(BaseModel):
    service_id: str
    stylist_id: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    name: str
    email: EmailStr
    phone: str
    notes: Optional[str] = ""


class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    service_id: str
    stylist_id: str
    date: str
    time: str
    name: str
    email: str
    phone: str
    notes: str = ""
    status: str = "confirmed"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "SERENDIPITY Salon API"}


@api_router.get("/services")
async def get_services():
    return SERVICES


@api_router.get("/stylists")
async def get_stylists():
    return STYLISTS


@api_router.get("/gallery")
async def get_gallery():
    return GALLERY


@api_router.get("/testimonials")
async def get_testimonials():
    return TESTIMONIALS


@api_router.get("/bookings/availability")
async def get_availability(stylist_id: str, date: str):
    """Return list of available time slots for a given stylist+date."""
    booked = await db.bookings.find(
        {"stylist_id": stylist_id, "date": date, "status": "confirmed"},
        {"_id": 0, "time": 1},
    ).to_list(200)
    booked_times = {b["time"] for b in booked}
    return {
        "date": date,
        "stylist_id": stylist_id,
        "slots": [{"time": t, "available": t not in booked_times} for t in TIME_SLOTS],
    }


@api_router.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate):
    if payload.service_id not in {s["id"] for s in SERVICES}:
        raise HTTPException(status_code=400, detail="Servicio inválido")
    if payload.stylist_id not in {s["id"] for s in STYLISTS}:
        raise HTTPException(status_code=400, detail="Estilista inválido")
    if payload.time not in TIME_SLOTS:
        raise HTTPException(status_code=400, detail="Horario inválido")

    existing = await db.bookings.find_one(
        {"stylist_id": payload.stylist_id, "date": payload.date, "time": payload.time, "status": "confirmed"},
        {"_id": 0},
    )
    if existing:
        raise HTTPException(status_code=409, detail="Ese horario ya está reservado")

    booking = Booking(**payload.model_dump())
    doc = booking.model_dump()
    await db.bookings.insert_one(doc)
    return booking


@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings():
    items = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact(payload: ContactCreate):
    msg = ContactMessage(**payload.model_dump())
    await db.contact_messages.insert_one(msg.model_dump())
    return msg


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
