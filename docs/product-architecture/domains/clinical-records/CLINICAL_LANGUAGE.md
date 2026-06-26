# Clinical Language

**Domain:** Clinical Records  
**Product:** DentalOperix  
**Purpose:** Ubiquitous Language for the Clinical Information Domain

## Core concepts

### Clinical Record

Longitudinal clinical record belonging to a patient. It concentrates clinical information generated during the patient's relationship with the clinic.

### Clinical Note

Individual clinical entry created by an authorized healthcare professional to document observations, findings, decisions or clinical evolution.

### Clinical Narrative

Narrative content of a Clinical Note. It represents the written clinical explanation created by the healthcare professional.

### Clinical History

Chronological view of the clinical entries belonging to a Clinical Record.

### Healthcare Professional

Authorized professional who can generate clinical information within a Clinical Record.

### Clinical Event

Relevant clinical occurrence recorded within the Clinical Record.

## Future clinical concepts

### Clinical Assessment

Clinical evaluation performed by a healthcare professional based on available patient information.

Status: future capability.

### Diagnosis

Structured clinical conclusion derived from assessment and evidence.

Status: future capability.

### Treatment Plan

Clinical strategy defined to address an identified patient condition or need.

Status: future capability.

### Dental Chart

Structured representation of the patient's dental state.

Status: future capability.

### Prescription

Clinical instruction for medication or therapeutic action, if formally authorized.

Status: future capability.

## Operational concepts

### Appointment Reference

Optional reference to an appointment that provides operational context for a clinical entry. It does not transfer ownership of the appointment to Clinical Records.

### Patient Reference

Reference to the patient identity owned by the Patients domain.

## Canonical terms

| Use | Avoid |
|---|---|
| Clinical Record | Patient Record |
| Clinical Note | Doctor Note |
| Clinical Narrative | Free Text |
| Healthcare Professional | User |
| Patient Reference | Patient Copy |
| Appointment Reference | Appointment Owner |

## Forbidden interpretations

- Clinical Records must not be interpreted as Patient Identity.
- Clinical Notes must not be interpreted as appointment notes.
- Appointment references must not imply appointment ownership.
- Clinical information must not be stored in Leads.
- Clinical Records must not redefine patient identity.

## Language rule

No domain entity should be implemented before its meaning is defined in this language document.
