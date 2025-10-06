version: "3.9"

services:
  frontend:
    build: ./apps/frontend
    container_name: frontend
    ports:
      - "5000:5000"
    depends_on:
      - backend
    environment:
      - BACKEND_URL=http://backend:3001

  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile   # Node API
    container_name: backend
    ports:
      - "3001:3001"
    environment:
      - ML_URL=http://ml:8000

  ml:
    build:
      context: ./apps/backend/ml
      dockerfile: Dockerfile   # FastAPI service
    container_name: ml
    ports:
      - "8000:8000"