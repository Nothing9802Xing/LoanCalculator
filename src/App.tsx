import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';
import LoanCalculator from './components/LoanCalculator';
import LanguageSwitcher from './components/LanguageSwitcher';
import StarryBackground from './components/StarryBackground';
import { LoanResult } from './utils/loanCalculator';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [result, setResult] = useState<LoanResult | null>(null);

  const handleCalculate = (result: LoanResult) => {
    setResult(result);
  };

  return (
    <div className="app" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <StarryBackground />
      <header>
        <h1>{t('appTitle')}</h1>
        <LanguageSwitcher />
      </header>
      
      <main>
        <LoanCalculator onCalculate={handleCalculate} />
        
        {result && (
          <div className="result">
            <h2>{t('result')}</h2>
            <div className="result-item">
              <span>{t('maxLoanAmount')}:</span>
              <span>AED {(result.maxLoanAmount || 0).toLocaleString()}</span>
            </div>
            <div className="result-item">
              <span>{t('maxLoanTerm')}:</span>
              <span>{result.maxLoanTerm || 0} {t('years')}</span>
            </div>
            <div className="result-item">
              <span>{t('monthlyPayment')}:</span>
              <span>AED {(result.monthlyPayment || 0).toLocaleString()}</span>
            </div>
            <div className="result-item">
              <span>{t('newLoanRate')}:</span>
              <span>{((result.input.newLoanRate || 0.045) * 100).toFixed(2)}%</span>
            </div>
            
            {result.refinanceAnalysis && (
              <div className="refinance-analysis">
                <h3>{t('refinanceAnalysis')}</h3>
                <div className="result-item">
                  <span>{t('existingLoanRate')}:</span>
                  <span>{((result.input.existingLoanRate || 0.058) * 100).toFixed(2)}%</span>
                </div>
                <div className="result-item">
                  <span>{t('newLoanRate')}:</span>
                  <span>{((result.input.newLoanRate || 0.045) * 100).toFixed(2)}%</span>
                </div>
                
                {/* 建议转贷利率阈值 */}
                <div className="result-item suggested-rate">
                  <span>{t('suggestedRateThreshold')}:</span>
                  <span>{(result.refinanceAnalysis.suggestedRateThreshold * 100).toFixed(2)}%</span>
                </div>
                <small className="notice refinance-threshold-notice">{t('suggestedRateNotice')}</small>
                
                <div className="result-item">
                  <span>{t('cashoutAmount')}:</span>
                  <span>AED {(result.refinanceAnalysis.cashoutAmount || 0).toLocaleString()}</span>
                </div>
                <div className="result-item">
                  <span>{t('monthlySavings')}:</span>
                  <span>AED {(result.refinanceAnalysis.monthlySavings || 0).toLocaleString()}</span>
                </div>
                <div className="result-item">
                  <span>{t('totalSavings')}:</span>
                  <span>AED {(result.refinanceAnalysis.totalSavings || 0).toLocaleString()}</span>
                </div>
                <div className="result-item">
                  <span>{t('netBenefit')}:</span>
                  <span>AED {(result.refinanceAnalysis.netBenefit || 0).toLocaleString()}</span>
                </div>
                <div className="result-item">
                  <span>{t('breakEvenMonths')}:</span>
                  <span>{result.refinanceAnalysis.breakEvenMonths || 0} {t('months')}</span>
                </div>
              </div>
            )}
            
            <div className="fees">
              <h3>{t('fees')}</h3>
              <div className="result-item">
                <span>{t('evaluationFee')}:</span>
                <span>AED {(result.fees.evaluation || 0).toLocaleString()}</span>
              </div>
              <div className="result-item">
                <span>{t('registrationFee')}:</span>
                <span>AED {(result.fees.registration || 0).toLocaleString()}</span>
              </div>
              <div className="result-item">
                <span>{t('transferFee')}:</span>
                <span>AED {(result.fees.transfer || 0).toLocaleString()}</span>
              </div>
              <div className="result-item">
                <span>{t('bankFee')}:</span>
                <span>AED {(result.fees.bankFee || 0).toLocaleString()}</span>
              </div>
              
              {/* 转贷特有费用 */}
              {result.fees.earlyRepayment !== undefined && (
                <div className="result-item">
                  <span>{t('earlyRepaymentFee')}:</span>
                  <span>AED {(result.fees.earlyRepayment || 0).toLocaleString()}</span>
                </div>
              )}
              
              {result.fees.mortgageDischarge !== undefined && (
                <div className="result-item">
                  <span>{t('mortgageDischarge')}:</span>
                  <span>AED {(result.fees.mortgageDischarge || 0).toLocaleString()}</span>
                </div>
              )}
              
              {/* 总费用 */}
              <div className="result-item total-fees">
                <span>{t('totalFees')}:</span>
                <span>AED {Object.values(result.fees || {})
                  .filter(fee => typeof fee === 'number')
                  .reduce((sum, fee) => sum + (fee || 0), 0)
                  .toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App; 