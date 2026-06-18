import type { ProductReadModel } from "@/server/read-models/worksheet-read-models";

export type ProductReadDto = {
  productId: string;
  sku?: string;
  productName: string;
  category?: string;
  status: string;
  unit?: string;
  source: string;
  isMock: boolean;
  notes?: string;
};

function normalize(value: string | undefined | null) {
  return (value ?? "").trim();
}

function readTimestamp(product: ProductReadModel) {
  const timestamp = Date.parse(product.updatedAt || product.createdAt || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isUsableProduct(product: ProductReadModel) {
  return Boolean(normalize(product.productId) && normalize(product.productName));
}

function toProductDto(product: ProductReadModel): ProductReadDto {
  return {
    productId: normalize(product.productId),
    ...(normalize(product.sku) ? { sku: normalize(product.sku) } : {}),
    productName: normalize(product.productName),
    ...(normalize(product.category) ? { category: normalize(product.category) } : {}),
    status: normalize(product.status),
    ...(normalize(product.unit) ? { unit: normalize(product.unit) } : {}),
    source: normalize(product.source) || "read-model",
    isMock: product.isMock,
    ...(normalize(product.notes) ? { notes: normalize(product.notes) } : {}),
  };
}

export function readProducts(products: ProductReadModel[]): ProductReadDto[] {
  return products
    .filter(isUsableProduct)
    .sort((left, right) => readTimestamp(right) - readTimestamp(left))
    .map(toProductDto);
}
