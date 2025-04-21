# Pan-African Payment SDK Architecture

This document provides a detailed explanation of the SDK's architecture, components, and workflows.

## System Overview

The Pan-African Payment SDK is designed as a modular, extensible system that facilitates mobile-money payments for Kenyan SMEs, with support for multiple payment methods and premium services.

The architecture is organized into the following core components:

1. **Core Services** - The fundamental building blocks of the system
2. **Payment Methods** - Integrations with various payment providers
3. **Integrations** - SDK packages for different platforms
4. **Premium Services** - Value-added features available as add-ons
5. **Management** - Administrative tools and user interfaces

## Architecture Diagram

```mermaid
flowchart TB
  subgraph External
    Client[Client / POS / Web App]
    Daraja[Safaricom Daraja API]
  end

  Client -->|HTTPS / SDK| API["API Gateway\n(Express + Middleware)"]
  API --> Core[Core Services]
  Core --> Fees["Fee Service\n(calculateFees)"]
  Core --> Auth["Auth Service\n(API Key/JWT)"]
  Core --> Txn["Transaction Service\n(ID gen + store)"]

  subgraph Providers
    MPesa[M-Pesa]
    Airtel[Airtel Money]
    MTN[MTN Money]
    Card[Card Gateway]
    Bank[Bank Transfer]
  end

  Core --> Providers
  Providers --> Daraja

  subgraph Data
    DB[(PostgreSQL/MongoDB)]
    Cache[(Redis)]
    Logs[(Logging)]
  end

  Core --> DB
  Core --> Cache
  Core --> Logs

  subgraph Management
    Dashboard[Merchant Dashboard]
    Admin[Admin Console]
  end

  Dashboard --> API
  Admin --> API
```
