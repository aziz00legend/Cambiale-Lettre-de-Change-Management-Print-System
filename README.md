# 📄 Cambiale — Lettre de Change Management & Print System

A full-stack enterprise application for managing and printing **Lettres de Change** (Bills of Exchange) — financial instruments used in Tunisian banking and commercial operations.

---

## 📌 Overview

This system digitizes and automates the complete lifecycle of a Lettre de Change: from issuing and managing bank/subsidiary/account structures, to creating cambiale records with full relational data, previewing them overlaid on the official PDF template, and triggering a tracked one-time print.

---

## 🧩 Features

### 🏦 Bank Hierarchy Management
- Full CRUD for **Banks**, **Subsidiary Banks**, and **Comptes (Accounts)**
- Hierarchical drill-down: Bank → Subsidiary → Compte, navigated via full-screen sidebars
- Code-immutability enforcement on edit (bank codes and subsidiary codes are locked after creation)
- **RIB validation** with modulo-97 checksum verification during compte creation

### 👥 Beneficiary Management
- Manage drawer / pay-to-order-of pairs used on cambiale documents
- Live search/filter across all beneficiaries

### 📋 Cambiale Management
- Create cambiales with: amount, operation date, protestable flag, creation location (Tunisian governorate), donor account, and beneficiary
- Full detail view with collapsible panels: Bank Info, Subsidiary Info, Beneficiary Info, Donor Info
- Soft-delete protection: printed cambiales cannot be deleted
- Governorate-aware autocomplete for creation location

### 🖨️ PDF Generation & Print
- **Preview mode**: loads the official *Lettre de Change* PDF template and overlays all dynamic fields (RIB, names, dates, amounts, locations) using `pdf-lib` — no server round-trip
- **Print mode**: generates a data-only PDF and sends it to the browser print dialog
- **Amount in letters** field auto-populated by the backend
- Print tracking: once printed, the cambiale is marked `isPrinted = true`, locking further prints and deletion
- Zoom and page navigation controls in the PDF viewer

---

## 🛠️ Tech Stack

### Frontend
| Technology | Role |
|---|---|
| Angular | SPA framework |
| PrimeNG | UI component library (tables, dialogs, sidebars, autocomplete) |
| pdf-lib | Client-side PDF template filling & generation |
| ng2-pdf-viewer | In-browser PDF preview |

### Backend
| Technology | Role |
|---|---|
| Spring Boot | REST/GraphQL API server |
| Spring GraphQL | GraphQL endpoint with field-level query projection |
| Neo4j | Graph database — models bank → subsidiary → compte relationships natively |
| Spring Data Neo4j | OGM / repository layer |

---

## 🗄️ Data Model (Graph)

```
(Bank)-[:HAS_SUBSIDIARY]->(SubsidiaryBank)-[:HAS_COMPTE]->(Compte)
(Cambiale)-[:DONOR]->(Compte)
(Cambiale)-[:BENEFICIARY]->(Beneficiary)
(Cambiale)-[:ISSUED_BY]->(SubsidiaryBank)
```

Neo4j's graph model naturally represents the hierarchical bank structure and the multi-entity relationships on each cambiale without complex JOIN tables.

---

## 🔌 GraphQL API (key operations)

```graphql
# Queries
query { getAllBanks { id name codeBank abbreviation image } }
query { getSubsidiaryBanksByBankId(bankId: "1") { id name codeSubsidiary location } }
query { getComptesBySubsidiaryBankId(id: "5") { id rib name cin city location codePostal } }
query { getAllBeneficiaries { id drawer payToOrderOf } }
query { getCambiales { id referenceCode amount operationDateFr protestable creationLocation isPrinted } }
query { getCambialeById(id: "3", fields: ["amount","amountInLetters","donorAccountRib",...]) { ... } }

# Mutations
mutation { saveBank(input: { name: "...", codeBank: "01", abbreviation: "..." }) { id } }
mutation { updateBank(input: { id: "1", name: "...", image: "..." }) { id } }
mutation { deleteBank(id: "1") }
mutation { saveCambiale(input: { ... }) { id } }
mutation { printCambiale(id: "3") }   # marks isPrinted = true
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Neo4j 5.x (local or Aura)
- Angular CLI

### Backend Setup

```bash
git clone https://github.com/your-username/cambiale-backend.git
cd cambiale-backend
```

Configure `src/main/resources/application.properties`:
```properties
spring.neo4j.uri=bolt://localhost:7687
spring.neo4j.authentication.username=neo4j
spring.neo4j.authentication.password=your_password
spring.graphql.graphiql.enabled=true
```

```bash
./mvnw spring-boot:run
```

GraphiQL playground available at: `http://localhost:8080/graphiql`

### Frontend Setup

```bash
git clone https://github.com/your-username/cambiale-frontend.git
cd cambiale-frontend
npm install
ng serve
```

App runs at: `http://localhost:4200`

Place the official PDF template at:
```
src/assets/Lettre de Change.pdf
```

---

## ✨ Key Implementation Details

- **Field-level GraphQL projection** — the `getCambialeById` query accepts a dynamic `fields` list, so the frontend fetches only the data it needs (list view vs. detail view vs. print view).
- **RIB Modulo-97 validation** — the frontend validates the full 20-digit Tunisian RIB checksum before allowing compte creation, matching the ISO 7064 standard.
- **Client-side PDF filling** — `pdf-lib` overlays text directly onto the scanned template PDF at precise coordinates, producing a print-ready document entirely in the browser without any server-side PDF library.
- **Print-once lock** — once `printCambiale` is called, the record is immutable: the delete button is disabled and the print button becomes a preview-only button.

---

## 📜 License

MIT License — see `LICENSE` for details.
