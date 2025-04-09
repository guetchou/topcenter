
export interface PricingModel {
  baseAgentPrice: number;
  setupFee: number;
  supportFee: number;
  crmFee: number;
  multilingualFee: number;
  yearlyDiscount: number;
}

export const defaultPricingModel: PricingModel = {
  baseAgentPrice: 85000, // FCFA per agent per month
  setupFee: 250000, // FCFA
  supportFee: 150000, // FCFA per month
  crmFee: 200000, // FCFA per month
  multilingualFee: 300000, // FCFA per month
  yearlyDiscount: 0.15, // 15% discount for yearly subscription
};

export interface ServiceCatalogItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  basePrice: number;
}
