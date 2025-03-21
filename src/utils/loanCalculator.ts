export interface LoanInput {
  userType: 'local' | 'expat';
  propertyValue: number;
  propertyType: 'first' | 'second' | 'offPlan';
  monthlyIncome: number;
  existingLoanPayment: number; // 现有贷款月还款额
  creditCardLimit: number; // 信用卡额度
  loanType: 'new' | 'refinance' | 'cashout' | 'combined';
  age: number;
  // 添加转贷相关字段
  existingLoanBalance?: number; // 现有贷款余额
  existingLoanRate?: number; // 现有贷款利率
  existingLoanTerm?: number; // 现有贷款剩余期限
  desiredCashout?: number; // 希望套现金额
  newLoanRate?: number; // 新贷款利率
}

export interface LoanResult {
  maxLoanAmount: number;
  maxLoanTerm: number;
  monthlyPayment: number;
  totalMonthlyDebt: number; // 总月债务
  fees: {
    evaluation: number;
    registration: number;
    transfer: number;
    bankFee: number;
    earlyRepayment?: number; // 提前还款费
    mortgageDischarge?: number; // 抵押解除费
  };
  // 转贷相关结果
  refinanceAnalysis?: {
    cashoutAmount: number; // 可套现金额
    monthlySavings: number; // 月供节省
    totalSavings: number; // 总节省金额
    netBenefit: number; // 净收益
    breakEvenMonths: number; // 收支平衡月数
    suggestedRateThreshold: number; // 建议转贷的利率阈值
  };
  input: LoanInput; // 保存原始输入数据，用于显示利率等信息
}

export const calculateLoan = (input: LoanInput): LoanResult => {
  // 计算总月债务（现有贷款 + 信用卡最低还款）
  const totalMonthlyDebt = calculateTotalMonthlyDebt(input);
  
  // 计算最大贷款金额
  const maxLoanAmount = calculateMaxLoanAmount(input, totalMonthlyDebt);
  
  // 计算最长贷款期限
  const maxLoanTerm = calculateMaxLoanTerm(input);
  
  // 获取用户设置的新贷款利率（默认为4.5%）
  const newLoanRate = input.newLoanRate !== undefined ? input.newLoanRate : 0.045;
  
  // 计算月供
  const monthlyPayment = calculateMonthlyPayment(maxLoanAmount, maxLoanTerm, newLoanRate);
  
  // 计算相关费用
  const fees = calculateFees(input, maxLoanAmount);

  // 基础结果
  const result: LoanResult = {
    maxLoanAmount,
    maxLoanTerm,
    monthlyPayment,
    totalMonthlyDebt,
    fees,
    input, // 保存输入数据
  };

  // 如果是转贷类型，添加转贷分析
  if (input.loanType === 'refinance' && input.existingLoanBalance) {
    result.refinanceAnalysis = calculateRefinanceAnalysis(input, maxLoanAmount, maxLoanTerm, fees);
  }

  return result;
};

// 计算总月债务
const calculateTotalMonthlyDebt = (input: LoanInput): number => {
  const { existingLoanPayment, creditCardLimit } = input;
  
  // 信用卡额度的5%折算为最低月还款额
  const creditCardMinPayment = creditCardLimit * 0.05;
  
  // 总月债务 = 现有贷款月还款额 + 信用卡最低还款额
  return existingLoanPayment + creditCardMinPayment;
};

const calculateMaxLoanAmount = (input: LoanInput, totalMonthlyDebt: number): number => {
  const { userType, propertyValue, monthlyIncome, propertyType, loanType, existingLoanBalance, desiredCashout } = input;
  
  // 根据外籍人士抵押贷款专项计算手册确定最高 LTV
  let maxLoanToValue;
  
  // 外籍人士适用规则
  if (userType === 'expat') {
    if (propertyType === 'first') {
      // 首套住宅，根据房产价值确定 LTV
      if (propertyValue <= 5000000) {
        maxLoanToValue = 0.80; // 首套 ≤500万AED：80%
      } else {
        maxLoanToValue = 0.70; // 首套 >500万AED：70%
      }
    } else if (propertyType === 'second') {
      maxLoanToValue = 0.60; // 投资房产（第二套）：60%
    } else if (propertyType === 'offPlan') {
      maxLoanToValue = 0.50; // 期房：50%
    } else {
      maxLoanToValue = 0.70; // 默认情况
    }
  } else {
    // 本地居民适用规则（保留原来的逻辑，但实际应该根据文档更新）
    maxLoanToValue = 0.80;
  }
  
  // 月供不超过月收入的50%
  const maxMonthlyPayment = monthlyIncome * 0.5 - totalMonthlyDebt;
  
  // 根据月供计算最大贷款金额，使用计算得出的贷款期限
  const calculatedTerm = calculateMaxLoanTerm(input);
  const maxLoanByIncome = maxMonthlyPayment * 12 * calculatedTerm;
  
  // 基于LTV的贷款额度上限
  const maxLoanByLTV = propertyValue * maxLoanToValue;
  
  // 针对转贷计算
  if (loanType === 'refinance' && existingLoanBalance) {
    // 如果是转贷，需要确保新贷款金额至少覆盖现有贷款余额
    // 公式：新贷款额 = Min(现有贷款余额 + 套现金额, 评估价值 × 适用LTV)
    const desiredAmount = existingLoanBalance + (desiredCashout || 0);
    return Math.min(desiredAmount, maxLoanByLTV, maxLoanByIncome);
  }
  
  // 取较小值
  return Math.min(maxLoanByLTV, maxLoanByIncome);
};

const calculateMaxLoanTerm = (input: LoanInput): number => {
  const { userType, propertyType, age } = input;
  
  // 按照文档规定，贷款到期时不得超过65周岁
  const maxAge = userType === 'expat' ? 65 : 70; // 外籍人士最长到65岁，本地居民到70岁
  
  // 计算基于年龄的最大贷款期限
  const maxTermByAge = Math.max(0, maxAge - age);
  
  // 按照文档规定，最长贷款期限为25年
  const maxDocTerm = 25;
  
  // 取较小值，确保不超过文档中规定的最长期限
  return Math.min(maxDocTerm, maxTermByAge);
};

const calculateMonthlyPayment = (loanAmount: number, loanTerm: number, interestRate?: number): number => {
  // 贷款期限为0时，月供设为0
  if (loanTerm <= 0 || loanAmount <= 0) return 0;
  
  // 基准利率
  const baseRate = interestRate !== undefined ? interestRate : 0.035; // 3.5%或传入的特定利率
  
  // 压力测试标准：基准利率 + 2%（仅在未指定利率时使用压力测试）
  const rate = interestRate !== undefined ? baseRate : baseRate + 0.02; // 压力测试利率为5.5%
  
  const monthlyRate = rate / 12;
  const numberOfPayments = loanTerm * 12;
  
  // 使用等额本息公式计算月供
  return (
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
};

// 计算转贷分析结果
const calculateRefinanceAnalysis = (
  input: LoanInput, 
  newLoanAmount: number, 
  newLoanTerm: number,
  fees: Record<string, number>
): any => {
  if (!input.existingLoanBalance || !input.existingLoanRate || !input.existingLoanTerm) {
    return null;
  }
  
  const { existingLoanBalance, existingLoanRate, existingLoanTerm, desiredCashout = 0, newLoanRate = 0.045 } = input;
  
  // 确保利率值有效
  const safeExistingRate = existingLoanRate || 0.058; // 默认5.8%
  const safeNewRate = newLoanRate || 0.045; // 默认4.5%
  
  // 计算可套现金额
  const cashoutAmount = Math.max(0, newLoanAmount - existingLoanBalance);
  
  // 计算当前月供
  const currentMonthlyPayment = calculateMonthlyPayment(
    existingLoanBalance, 
    existingLoanTerm, 
    safeExistingRate
  );
  
  // 计算新贷款月供（使用用户指定的新贷款利率）
  const newMonthlyPayment = calculateMonthlyPayment(newLoanAmount, newLoanTerm, safeNewRate);
  
  // 月供节省
  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
  
  // 总节省（按照新贷款期限计算）
  const totalSavings = monthlySavings * newLoanTerm * 12;
  
  // 总费用 - 使用类型安全的方式计算总费用
  let totalFees = 0;
  Object.keys(fees).forEach(key => {
    const fee = fees[key];
    if (typeof fee === 'number') {
      totalFees += fee;
    }
  });
  
  // 净收益
  const netBenefit = totalSavings - totalFees;
  
  // 收支平衡点（月数）
  const breakEvenMonths = totalFees / monthlySavings;
  
  // 计算建议转贷的利率阈值
  // 如果新利率低于这个阈值，转贷是有利的
  // 基于转贷费用和净收益计算
  const suggestedRateThreshold = calculateSuggestedRateThreshold(
    existingLoanBalance,
    safeExistingRate,
    existingLoanTerm,
    totalFees
  );
  
  return {
    cashoutAmount,
    monthlySavings,
    totalSavings,
    netBenefit,
    breakEvenMonths: Math.ceil(breakEvenMonths),
    suggestedRateThreshold, // 添加建议转贷的利率阈值
  };
};

// 计算建议转贷的利率阈值
const calculateSuggestedRateThreshold = (
  loanBalance: number,
  currentRate: number,
  remainingTerm: number,
  totalFees: number
): number => {
  // 当前贷款的月供
  const currentMonthlyPayment = calculateMonthlyPayment(loanBalance, remainingTerm, currentRate);
  
  // 月供金额 = 贷款本金 * 月利率 * (1+月利率)^期数 / ((1+月利率)^期数 - 1)
  // 我们需要求解月利率，使得转贷后的总成本（包括费用）与当前贷款相等
  
  // 简化计算：假设新利率需要比当前利率低出足够的差值，使得在剩余期限内产生的节省能抵消转贷费用
  // 每月节省1%利率大约相当于每10万贷款节省83.3 AED
  const monthlyPaymentReductionPercentage = totalFees / (loanBalance * remainingTerm * 12) * 100;
  
  // 建议的新利率阈值 = 当前利率 - 需要降低的利率百分比
  // 至少降低0.5%才有意义，因为有手续费和其他成本
  let suggestedRate = Math.max(currentRate - (monthlyPaymentReductionPercentage / 100) - 0.005, 0.01);
  
  // 为了安全起见，再降低0.25%以确保有足够的收益
  suggestedRate = Math.max(suggestedRate - 0.0025, 0.01);
  
  return suggestedRate;
};

const calculateFees = (input: LoanInput, loanAmount: number) => {
  const { propertyValue, loanType, existingLoanBalance } = input;
  
  // 根据文档的费用明细规范计算费用
  
  // 房产评估费：固定2,500-3,000 AED
  const evaluation = 3000;
  
  // 抵押登记费：贷款额×0.25% + 290 AED
  const registration = loanAmount * 0.0025 + 290;
  
  // 银行手续费：贷款额×1%（封顶10,000 AED）
  let bankFee = loanAmount * 0.01;
  bankFee = Math.min(bankFee, 10000);
  
  // 基础费用对象
  const fees: any = {
    evaluation,
    registration,
    bankFee,
    transfer: 0, // 默认设为0，确保始终有值
  };
  
  // 根据贷款类型计算不同的费用
  if (loanType === 'new') {
    // 新购买：转让费为房产价值的2%
    fees.transfer = propertyValue * 0.02;
  } else if (loanType === 'refinance' && existingLoanBalance) {
    // 转贷：转让费为房产价值的1%
    fees.transfer = propertyValue * 0.01;
    
    // 提前还款费：现有贷款余额的1%（封顶10,000 AED）
    fees.earlyRepayment = Math.min(existingLoanBalance * 0.01, 10000);
    
    // DLD抵押解除费：固定1,300-1,600 AED
    fees.mortgageDischarge = 1500;
  } else if (loanType === 'cashout') {
    // 套现：转让费为房产价值的1.5%
    fees.transfer = propertyValue * 0.015;
  } else if (loanType === 'combined') {
    // 组合贷款：转让费为房产价值的2.5%
    fees.transfer = propertyValue * 0.025;
  }
  
  return fees;
}; 