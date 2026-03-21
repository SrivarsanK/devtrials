# Project Structure

This project follows a standard layout tailored for GSD (Get-Shit-Done) workflows and domain-driven design, encompassing configuration, documentation, and source code.

## Root Directory

* **`README.md`**: Main project overview and instructions.
* **`REQUIREMENTS.md`**: Detailed business and technical requirements.
* **`DESIGN.md`**: Core design concepts, UI/UX specifications, and architecture notes.
* **`.planning/`**: Contains GSD planning artifacts, codebase maps (like this file), phases, and milestones.
  * **`codebase/`**: Holds the mapped documentation (`STACK.md`, `INTEGRATIONS.md`, `ARCHITECTURE.md`, `STRUCTURE.md`).

## System & Tooling

* **`bin/`**: Contains executable scripts for project management or deployment.
* **`commands/`**: Might contain CLI command definitions for the project tooling.
* **`get-shit-done/`** (or `.agents/` workflows): Contains templates, scripts, and workflows used by the AI coding agent.
  * **`references/`**: Technical references and standards.
  * **`templates/`**: Boilerplate templates for new modules or files.
  * **`workflows/`**: Defined processes (like `/gsd-map-codebase`).

## Source Code (Expected Layout)

While the implementation is still in early phases, the `src/` directory (when created) is expected to follow this structure:

* **`src/`**
  * **`frontend/`**: Next.js application for Worker PWA and Insurer Dashboard.
    * `components/`: Reusable React components.
    * `pages/` or `app/`: Next.js routing.
    * `lib/`: Utility functions and API clients.
    * `styles/`: Global CSS and Tailwind configurations.
  * **`backend/`**: Node.js/Express core services.
    * `controllers/`: Request handlers.
    * `services/`: Business logic.
    * `models/`: Database schemas (Prisma/TypeORM).
    * `routes/`: API endpoint definitions.
  * **`ml-service/`**: Python FastAPI application for inference.
    * `main.py`: Entry point.
    * `models/`: Pre-trained models (.pkl, .h5).
    * `api/`: FastAPI routes.
    * `utils/`: Data preprocessing scripts.
