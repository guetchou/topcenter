
import React from "react";
import { QuoteForm } from "@/components/deploy/QuoteForm";
import { QuoteResult } from "@/components/deploy/QuoteResult";

interface QuotationTabProps {
  packageConfig: {
    agentCount: number[];
    servicePeriod: string;
    callVolume: string;
    includeSupport: boolean;
    includeCRM: boolean;
    multilingual: boolean;
  };
  setPackageConfig: (config: any) => void;
  onProceedToDeployment: () => void;
}

const QuotationTab: React.FC<QuotationTabProps> = ({
  packageConfig,
  setPackageConfig,
  onProceedToDeployment
}) => {
  const businessInfo = {
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: '',
    employees: [10],
    budget: '10000-50000'
  };

  const quoteResult = {
    basePrice: 5000,
    setup: 1000,
    additionalFeatures: 2000,
    total: 8000
  };

  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle business info changes
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setPackageConfig({ ...packageConfig, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setPackageConfig({ ...packageConfig, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setPackageConfig({ ...packageConfig, [name]: checked });
  };

  const generateQuote = () => {
    console.log('Generating quote...');
  };

  const resetForm = () => {
    console.log('Resetting form...');
  };

  const downloadQuote = () => {
    console.log('Downloading quote...');
  };

  return (
    <div className="space-y-8">
      <QuoteForm 
        businessInfo={businessInfo}
        setBusinessInfo={() => {}}
        packageConfig={packageConfig}
        setPackageConfig={setPackageConfig}
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
          setActiveTab={onProceedToDeployment}
        />
      )}
    </div>
  );
};

export default QuotationTab;
