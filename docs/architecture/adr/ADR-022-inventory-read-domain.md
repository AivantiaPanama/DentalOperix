# ADR-022 — Inventory Read Domain

## Status

Accepted

## Context

Read Model Platform v2 selected Inventory as the next expansion domain after Finance. Inventory is valuable for operational visibility, product availability, consumable tracking, and stock dashboards. However, stock movements, inventory adjustments, purchase orders, supplier orders, and reconciliation are transactional concerns and remain outside the first read-domain pilot.

## Decision

Introduce an isolated Inventory read domain with:

- `InventoryAggregateReadService`
- `ProductReadAdapter`
- `ConsumableReadAdapter`
- `StockLevelReadAdapter`
- `WarehouseReadAdapter`

Inventory v1 is read-only and owns only:

- Products
- Consumables
- StockLevels
- Warehouses

## Boundaries

Inventory must not import or depend on Patient, CRM, Billing, Clinical, Operations, or Finance aggregate services.

Inventory v1 must not include:

- StockMovements
- InventoryAdjustments
- PurchaseOrders
- SupplierOrders
- Reconciliation

## Fallback

Inventory follows the platform fallback standard:

```text
Read Model
↓
Inventory Projection
↓
Error
```

## Observability

Inventory must emit standard read-platform telemetry through `ReadObservabilityProvider`:

- ReadTelemetryEvent
- FallbackTelemetryEvent
- AggregateTelemetryEvent
- DomainTelemetryEvent

The telemetry domain is `Inventory`.

## Consequences

Inventory can participate in the read platform without becoming a source of truth for stock. Future stock movement or purchasing capabilities require separate qualification and must not be added to Inventory v1 without a new ADR.
