import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appTitle: 'Dubai Mortgage Loan Calculator',
      userType: 'User Type',
      local: 'Local Resident',
      expat: 'Expatriate',
      propertyValue: 'Property Value',
      enterPropertyValue: 'Enter property value',
      propertyType: 'Property Type',
      first: 'First Property',
      second: 'Second Property',
      offPlan: 'Off-Plan Property',
      monthlyIncome: 'Monthly Income',
      enterMonthlyIncome: 'Enter monthly income',
      existingLoanPayment: 'Existing Loan Payment',
      enterExistingLoanPayment: 'Enter existing loan monthly payment',
      existingLoanPaymentNotice: 'Include car loans, personal loans, etc.',
      creditCardLimit: 'Credit Card Limit',
      enterCreditCardLimit: 'Enter total credit card limit',
      creditCardLimitNotice: '5% of limit will be calculated as monthly obligation',
      totalMonthlyDebt: 'Total Monthly Debt',
      loanType: 'Loan Type',
      new: 'New Purchase',
      refinance: 'Balance Transfer',
      cashout: 'Cash Out',
      combined: 'Combined Loan',
      calculate: 'Calculate',
      result: 'Calculation Result',
      maxLoanAmount: 'Maximum Loan Amount',
      maxLoanTerm: 'Maximum Loan Term',
      years: 'years',
      months: 'months',
      monthlyPayment: 'Monthly Payment',
      fees: 'Fees',
      evaluationFee: 'Evaluation Fee',
      registrationFee: 'Registration Fee',
      transferFee: 'Transfer Fee',
      bankFee: 'Bank Processing Fee',
      totalFees: 'Total Fees',
      age: 'Your Age',
      enterAge: 'Enter your age',
      ageNotice: 'Note: Loan term will end at max age of 65 for expats, 70 for locals',
      existingLoanBalance: 'Existing Loan Balance',
      enterExistingLoanBalance: 'Enter remaining balance of current loan',
      existingLoanRate: 'Current Interest Rate',
      enterExistingLoanRate: 'Enter current loan interest rate (%)',
      newLoanRate: 'New Loan Interest Rate',
      enterNewLoanRate: 'Enter new loan interest rate (%)',
      newLoanRateNotice: 'Used for calculating monthly payment and savings',
      existingLoanTerm: 'Remaining Loan Term',
      enterExistingLoanTerm: 'Enter remaining loan term in years',
      desiredCashout: 'Desired Cashout Amount',
      enterDesiredCashout: 'Enter desired amount to cash out',
      refinanceAnalysis: 'Balance Transfer Analysis',
      cashoutAmount: 'Available Cashout Amount',
      monthlySavings: 'Monthly Savings',
      totalSavings: 'Total Savings Over Loan Term',
      netBenefit: 'Net Benefit',
      breakEvenMonths: 'Break-Even Point (Months)',
      earlyRepaymentFee: 'Early Repayment Fee',
      mortgageDischarge: 'Mortgage Discharge Fee',
      refinanceNotice: 'Enter current loan details for accurate balance transfer analysis',
      suggestedRateThreshold: 'Suggested Rate Threshold for Balance Transfer',
      suggestedRateNotice: 'Balance transfer is recommended when new interest rate is below this threshold',
    },
  },
  ar: {
    translation: {
      appTitle: 'حاسبة قروض دبي العقارية',
      userType: 'نوع المستخدم',
      local: 'مقيم محلي',
      expat: 'مقيم أجنبي',
      propertyValue: 'قيمة العقار',
      enterPropertyValue: 'أدخل قيمة العقار',
      propertyType: 'نوع العقار',
      first: 'عقار أول',
      second: 'عقار ثانٍ',
      offPlan: 'عقار قيد الإنشاء',
      monthlyIncome: 'الدخل الشهري',
      enterMonthlyIncome: 'أدخل الدخل الشهري',
      existingLoanPayment: 'دفعات القروض الحالية',
      enterExistingLoanPayment: 'أدخل الدفعة الشهرية للقروض الحالية',
      existingLoanPaymentNotice: 'تشمل قروض السيارات والقروض الشخصية إلخ',
      creditCardLimit: 'حد بطاقة الائتمان',
      enterCreditCardLimit: 'أدخل الحد الإجمالي لبطاقة الائتمان',
      creditCardLimitNotice: 'سيتم احتساب 5٪ من الحد كالتزام شهري',
      totalMonthlyDebt: 'إجمالي الديون الشهرية',
      loanType: 'نوع القرض',
      new: 'شراء جديد',
      refinance: 'تحويل الرصيد',
      cashout: 'سحب نقدي',
      combined: 'قرض مجمع',
      calculate: 'احسب',
      result: 'نتيجة الحساب',
      maxLoanAmount: 'الحد الأقصى لمبلغ القرض',
      maxLoanTerm: 'الحد الأقصى لمدة القرض',
      years: 'سنوات',
      months: 'شهور',
      monthlyPayment: 'الدفعة الشهرية',
      fees: 'الرسوم',
      evaluationFee: 'رسوم التقييم',
      registrationFee: 'رسوم التسجيل',
      transferFee: 'رسوم التحويل',
      bankFee: 'رسوم المعالجة المصرفية',
      totalFees: 'إجمالي الرسوم',
      age: 'عمرك',
      enterAge: 'أدخل عمرك',
      ageNotice: 'ملاحظة: تنتهي مدة القرض عند بلوغ العمر الأقصى 65 للوافدين، 70 للمقيمين المحليين',
      existingLoanBalance: 'رصيد القرض الحالي',
      enterExistingLoanBalance: 'أدخل الرصيد المتبقي من القرض الحالي',
      existingLoanRate: 'معدل الفائدة الحالي',
      enterExistingLoanRate: 'أدخل معدل فائدة القرض الحالي (%)',
      newLoanRate: 'معدل فائدة القرض الجديد',
      enterNewLoanRate: 'أدخل معدل فائدة القرض الجديد (%)',
      newLoanRateNotice: 'يستخدم لحساب الدفعة الشهرية والتوفير',
      existingLoanTerm: 'المدة المتبقية للقرض',
      enterExistingLoanTerm: 'أدخل المدة المتبقية للقرض بالسنوات',
      desiredCashout: 'المبلغ النقدي المطلوب',
      enterDesiredCashout: 'أدخل المبلغ المطلوب للسحب النقدي',
      refinanceAnalysis: 'تحليل تحويل الرصيد',
      cashoutAmount: 'المبلغ النقدي المتاح',
      monthlySavings: 'التوفير الشهري',
      totalSavings: 'إجمالي التوفير على مدة القرض',
      netBenefit: 'صافي الفائدة',
      breakEvenMonths: 'نقطة التعادل (أشهر)',
      earlyRepaymentFee: 'رسوم السداد المبكر',
      mortgageDischarge: 'رسوم فك الرهن العقاري',
      refinanceNotice: 'أدخل تفاصيل القرض الحالي للحصول على تحليل دقيق لتحويل الرصيد',
      suggestedRateThreshold: 'معدل الفائدة المقترح لتحويل الرصيد',
      suggestedRateNotice: 'يُنصح بتحويل الرصيد عندما يكون معدل الفائدة الجديد أقل من هذا الحد',
    },
  },
  zh: {
    translation: {
      appTitle: '迪拜房贷计算器',
      userType: '用户类型',
      local: '本地居民',
      expat: '外籍人士',
      propertyValue: '房产价值',
      enterPropertyValue: '请输入房产价值',
      propertyType: '房产类型',
      first: '首套房产',
      second: '二套房产',
      offPlan: '期房',
      monthlyIncome: '月收入',
      enterMonthlyIncome: '请输入月收入',
      existingLoanPayment: '现有贷款月供',
      enterExistingLoanPayment: '请输入现有贷款月供',
      existingLoanPaymentNotice: '包括车贷、个人贷款等',
      creditCardLimit: '信用卡额度',
      enterCreditCardLimit: '请输入信用卡总额度',
      creditCardLimitNotice: '额度的5%将被计算为月债务',
      totalMonthlyDebt: '每月总债务',
      loanType: '贷款类型',
      new: '新购买',
      refinance: '转贷',
      cashout: '提取现金',
      combined: '组合贷款',
      calculate: '计算',
      result: '计算结果',
      maxLoanAmount: '最大贷款金额',
      maxLoanTerm: '最长贷款期限',
      years: '年',
      months: '月',
      monthlyPayment: '月供',
      fees: '相关费用',
      evaluationFee: '评估费',
      registrationFee: '登记费',
      transferFee: '转让费',
      bankFee: '银行手续费',
      totalFees: '总费用',
      age: '您的年龄',
      enterAge: '请输入您的年龄',
      ageNotice: '注意：贷款期限将在外籍人士65岁、本地居民70岁时结束',
      existingLoanBalance: '现有贷款余额',
      enterExistingLoanBalance: '请输入当前贷款的剩余本金',
      existingLoanRate: '当前贷款利率',
      enterExistingLoanRate: '请输入当前贷款的年利率(%)',
      newLoanRate: '新贷款利率',
      enterNewLoanRate: '请输入新贷款的年利率(%)',
      newLoanRateNotice: '用于计算月供和节省金额',
      existingLoanTerm: '剩余贷款期限',
      enterExistingLoanTerm: '请输入剩余贷款期限(年)',
      desiredCashout: '希望套现金额',
      enterDesiredCashout: '请输入希望额外提取的现金金额',
      refinanceAnalysis: '转贷分析',
      cashoutAmount: '可套现金额',
      monthlySavings: '月供节省',
      totalSavings: '贷款期内总节省',
      netBenefit: '净收益',
      breakEvenMonths: '收支平衡点（月数）',
      earlyRepaymentFee: '提前还款费',
      mortgageDischarge: '抵押解除费',
      refinanceNotice: '输入当前贷款详情以获得准确的转贷分析',
      suggestedRateThreshold: '建议转贷利率阈值',
      suggestedRateNotice: '当新贷款利率低于此阈值时，建议进行转贷',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 