from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.routes import evidence, graph, analysis, clusters, settings as settings_router
from db.session import neo4j_driver, init_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Proper CORS configuration for production (Vercel / Firebase / Railway) and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=r"https://.*(\.railway\.app|\.web\.app|\.firebaseapp\.com|\.vercel\.app)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(evidence.router, prefix=f"{settings.API_V1_STR}/evidence", tags=["Evidence"])
app.include_router(graph.router, prefix=f"{settings.API_V1_STR}/graph", tags=["Graph Analytics"])
app.include_router(analysis.router, prefix=f"{settings.API_V1_STR}/analysis", tags=["Analysis"])
app.include_router(clusters.router, prefix=f"{settings.API_V1_STR}/clusters", tags=["Clusters"])
app.include_router(settings_router.router, prefix=f"{settings.API_V1_STR}/settings", tags=["Settings"])

@app.on_event("startup")
def startup_event():
    init_db()

@app.on_event("shutdown")
def shutdown_event():
    if neo4j_driver:
        neo4j_driver.close()

@app.get("/")
def root():
    return {"message": "PRISM API is running."}

@app.get("/health")
def health():
    return {"status": "healthy", "service": "PRISM API"}

