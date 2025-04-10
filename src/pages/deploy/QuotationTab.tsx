
import React from "react";
import { QuoteForm } from "@/components/deploy/QuoteForm";
import { QuoteResult } from "@/components/deploy/QuoteResult";

interface QuotationTabProps {
  businessInfo: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    industry: string;
    employees: number[];
    budget: string;
  };
  packageConfig: {
    agentCount: number[];
    servicePeriod: string;
    callVolume: string;
    includeSupport: boolean;
    includeCRM: boolean;
    multilingual: boolean;
  };
  quoteResult: {
    basePrice: number;
    setup: number;
    additionalFeatures: number;
    total: number;
  } | null;
  handleBusinessInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSliderChange: (name: string, value: number[]) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  generateQuote: () => void;
  resetForm: () => void;
  downloadQuote: () => void;
  setActiveTab: (tab: string) => void;
}

const QuotationTab: React.FC<QuotationTabProps> = ({
  businessInfo,
  packageConfig,
  quoteResult,
  handleBusinessInfoChange,
  handleSliderChange,
  handleSelectChange,
  handleSwitchChange,
  generateQuote,
  resetForm,
  downloadQuote,
  setActiveTab
}) => {
  return (
    <div className="space-y-8">
      <QuoteForm 
        businessInfo={businessInfo}
        setBusinessInfo={() => {}} // This prop is not used in the component
        packageConfig={packageConfig}
        setPackageConfig={() => {}} // This prop is not used in the component
        generateQuote={generateQuote}
        resetForm={resetForm}
        handleBusinessInfoChange={handleBusinessInfoChange}
        handleSliderChange={handleSliderChange}
        handleSelectChange={handleSelectChange}
        handleSwitchChange={handleSwitchChange}
      />
      
      {quoteResult && (
        <QuoteResult 
          quoteResult={quoteResult}
          packageConfig={packageConfig}
          downloadQuote={downloadQuote}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};

export default QuotationTab;
