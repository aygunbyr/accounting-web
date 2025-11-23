export interface FixedAssetListItemDto {
  id: number;
  code: string;
  name: string;
  purchaseDateUtc: string;      // ISO string
  purchasePrice: string;        // BE decimal -> string
  usefulLifeYears: number;
  depreciationRatePercent: string; // BE decimal -> string
}

export interface FixedAssetDetailDto {
  id: number;
  code: string;
  name: string;
  purchaseDateUtc: string;
  purchasePrice: string;
  usefulLifeYears: number;
  depreciationRatePercent: string;
  isDeleted: boolean;
  rowVersionBase64: string;
  createdAtUtc: string;
  updatedAtUtc: string | null;
  deletedAtUtc: string | null;
}

export interface ListFixedAssetsQuery {
  pageNumber?: number;
  pageSize?: number;
  search?: string | null;
  includeDeleted?: boolean;
}

export interface CreateFixedAssetCommand {
  code: string;
  name: string;
  purchaseDateUtc: string; // UTC ISO
  purchasePrice: string;   // input'tan string, BE decimal
  usefulLifeYears: number;
}

export interface UpdateFixedAssetCommand {
  id: number;
  rowVersionBase64: string;
  code: string;
  name: string;
  purchaseDateUtc: string;
  purchasePrice: string;
  usefulLifeYears: number;
}

export interface DeleteFixedAssetCommand {
  id: number;
  rowVersionBase64: string;
}