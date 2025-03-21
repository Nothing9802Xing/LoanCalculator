import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LoanResult, calculateLoan, LoanInput } from '../utils/loanCalculator';

interface LoanCalculatorProps {
  onCalculate: (result: LoanResult) => void;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ onCalculate }) => {
  const { t } = useTranslation();
  // 添加额外的状态来追踪利率的文本输入值
  const [rateInputText, setRateInputText] = useState({
    existingLoanRate: '5.80',
    newLoanRate: '4.50'
  });
  const [input, setInput] = useState<LoanInput>({
    userType: 'expat' as const,
    propertyValue: 0,
    propertyType: 'first' as const,
    monthlyIncome: 0,
    plannedRefinancePayment: 0,
    otherLoanPayments: 0,
    creditCardLimit: 0,
    loanType: 'new' as const,
    age: 30, // 默认年龄设为30岁
    // 转贷相关字段
    existingLoanBalance: 0,
    existingLoanRate: 0.058, // 默认年利率5.8%
    existingLoanTerm: 0,
    desiredCashout: 0,
    newLoanRate: 0.045, // 默认新贷款年利率4.5%
  });

  // 添加一个effect，仅在初始化时设置默认文本
  useEffect(() => {
    setRateInputText({
      existingLoanRate: '5.80',
      newLoanRate: '4.50'
    });
  }, []); // 空依赖数组，只在组件挂载时执行一次

  const handleInputChange = (field: keyof LoanInput, value: any) => {
    setInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理利率文本输入的专门函数
  const handleRateInputChange = (field: 'existingLoanRate' | 'newLoanRate', text: string) => {
    // 移除非数字字符，只保留数字和第一个小数点
    let cleanedText = '';
    let hasDecimal = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '.' && !hasDecimal) {
        cleanedText += char;
        hasDecimal = true;
      } else if (/\d/.test(char)) {
        cleanedText += char;
      }
    }
    
    // 限制小数点后最多两位
    if (hasDecimal) {
      const parts = cleanedText.split('.');
      if (parts[1] && parts[1].length > 2) {
        cleanedText = parts[0] + '.' + parts[1].substring(0, 2);
      }
    }
    
    // 更新文本输入状态 - 不自动添加小数位
    setRateInputText(prev => ({
      ...prev,
      [field]: cleanedText
    }));
    
    // 转换为数值并更新到实际输入中（除以100转换为小数）
    let numValue = 0;
    if (cleanedText !== '' && cleanedText !== '.') {
      numValue = parseFloat(cleanedText) / 100;
    }
    
    handleInputChange(field, numValue);
  };

  // 格式化利率显示 - 只在需要时使用
  const formatRateForDisplay = (rate: number): string => {
    // 将小数乘以100并保留两位小数
    return (rate * 100).toFixed(2);
  };

  // 当计算按钮点击时，确保利率值正确并格式化显示
  const handleCalculate = () => {
    // 确保利率数据正确格式化
    const updatedInput = { ...input };
    
    // 如果文本为空但需要使用默认值
    if (rateInputText.existingLoanRate === '' || rateInputText.existingLoanRate === '.') {
      setRateInputText(prev => ({ ...prev, existingLoanRate: '5.80' }));
      updatedInput.existingLoanRate = 0.058;
    } else {
      // 格式化显示，但保持用户输入的值
      setRateInputText(prev => ({ 
        ...prev, 
        existingLoanRate: formatRateForDisplay(updatedInput.existingLoanRate || 0)
      }));
    }
    
    if (rateInputText.newLoanRate === '' || rateInputText.newLoanRate === '.') {
      setRateInputText(prev => ({ ...prev, newLoanRate: '4.50' }));
      updatedInput.newLoanRate = 0.045;
    } else {
      // 格式化显示，但保持用户输入的值
      setRateInputText(prev => ({ 
        ...prev, 
        newLoanRate: formatRateForDisplay(updatedInput.newLoanRate || 0)
      }));
    }
    
    const result = calculateLoan(updatedInput);
    onCalculate(result);
  };

  // 是否显示转贷特定字段
  const showRefinanceFields = input.loanType === 'refinance';

  return (
    <div className="loan-calculator">
      <div className="input-group">
        <label>{t('userType')}</label>
        <select
          value={input.userType}
          onChange={(e) => handleInputChange('userType', e.target.value)}
        >
          <option value="expat">{t('expat')}</option>
          <option value="local">{t('local')}</option>
        </select>
      </div>

      <div className="input-group">
        <label>{t('loanType')}</label>
        <select
          value={input.loanType}
          onChange={(e) => handleInputChange('loanType', e.target.value)}
        >
          <option value="new">{t('new')}</option>
          <option value="refinance">{t('refinance')}</option>
          <option value="cashout">{t('cashout')}</option>
          <option value="combined">{t('combined')}</option>
        </select>
      </div>

      <div className="input-group">
        <label>{t('propertyValue')}</label>
        <input
          type="number"
          value={input.propertyValue}
          onChange={(e) => handleInputChange('propertyValue', Number(e.target.value))}
          placeholder={t('enterPropertyValue')}
        />
      </div>

      <div className="input-group">
        <label>{t('propertyType')}</label>
        <select
          value={input.propertyType}
          onChange={(e) => handleInputChange('propertyType', e.target.value)}
        >
          <option value="first">{t('first')}</option>
          <option value="second">{t('second')}</option>
          <option value="offPlan">{t('offPlan')}</option>
        </select>
      </div>
      
      <div className="input-group">
        <label>{t('age')}</label>
        <input
          type="number"
          min="18"
          max="80"
          value={input.age}
          onChange={(e) => handleInputChange('age', Number(e.target.value))}
          placeholder={t('enterAge')}
        />
        <small className="notice">{t('ageNotice')}</small>
      </div>

      <div className="input-group">
        <label>{t('monthlyIncome')}</label>
        <input
          type="number"
          value={input.monthlyIncome}
          onChange={(e) => handleInputChange('monthlyIncome', Number(e.target.value))}
          placeholder={t('enterMonthlyIncome')}
        />
      </div>

      <div className="input-group">
        <label>{t('plannedRefinancePayment')}</label>
        <input
          type="number"
          value={input.plannedRefinancePayment}
          onChange={(e) => handleInputChange('plannedRefinancePayment', Number(e.target.value))}
          placeholder={t('enterPlannedRefinancePayment')}
        />
        <small className="notice">{t('plannedRefinancePaymentNotice')}</small>
      </div>

      <div className="input-group debt-inputs">
        <div className="debt-input-column">
          <label>{t('otherLoanPayments')}</label>
          <input
            type="number"
            value={input.otherLoanPayments}
            onChange={(e) => handleInputChange('otherLoanPayments', Number(e.target.value))}
            placeholder={t('enterOtherLoanPayments')}
          />
          <small className="notice">{t('otherLoanPaymentsNotice')}</small>
        </div>
        
        <div className="debt-input-column">
          <label>{t('creditCardLimit')}</label>
          <input
            type="number"
            value={input.creditCardLimit}
            onChange={(e) => handleInputChange('creditCardLimit', Number(e.target.value))}
            placeholder={t('enterCreditCardLimit')}
          />
          <small className="notice">{t('creditCardLimitNotice')}</small>
        </div>
      </div>

      {/* 转贷特有字段 */}
      {showRefinanceFields && (
        <div className="refinance-fields">
          <div className="input-group">
            <label>{t('existingLoanBalance')}</label>
            <input
              type="number"
              value={input.existingLoanBalance}
              onChange={(e) => handleInputChange('existingLoanBalance', Number(e.target.value))}
              placeholder={t('enterExistingLoanBalance')}
            />
          </div>

          <div className="input-group debt-inputs">
            <div className="debt-input-column">
              <label>{t('existingLoanRate')}</label>
              <div className="rate-input-container">
                <input
                  type="text"
                  value={rateInputText.existingLoanRate}
                  onChange={(e) => handleRateInputChange('existingLoanRate', e.target.value)}
                  placeholder={t('enterExistingLoanRate')}
                />
                <span className="percent-sign">%</span>
              </div>
            </div>
            
            <div className="debt-input-column">
              <label>{t('existingLoanTerm')}</label>
              <input
                type="number"
                min="0"
                max="35"
                value={input.existingLoanTerm || 0}
                onChange={(e) => handleInputChange('existingLoanTerm', Number(e.target.value))}
                placeholder={t('enterExistingLoanTerm')}
              />
            </div>
          </div>

          <div className="input-group">
            <label>{t('desiredCashout')}</label>
            <input
              type="number"
              value={input.desiredCashout || 0}
              onChange={(e) => handleInputChange('desiredCashout', Number(e.target.value))}
              placeholder={t('enterDesiredCashout')}
            />
          </div>
          
          <small className="notice refinance-notice">{t('refinanceNotice')}</small>
        </div>
      )}

      <div className="input-group">
        <label>{t('newLoanRate')}</label>
        <div className="rate-input-container">
          <input
            type="text"
            value={rateInputText.newLoanRate}
            onChange={(e) => handleRateInputChange('newLoanRate', e.target.value)}
            placeholder={t('enterNewLoanRate')}
          />
          <span className="percent-sign">%</span>
        </div>
        <small className="notice">{t('newLoanRateNotice')}</small>
      </div>

      <button onClick={handleCalculate}>{t('calculate')}</button>
    </div>
  );
};

export default LoanCalculator; 