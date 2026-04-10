const formatCurrency = (value) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);

const formatPercent = (value) => Number.isFinite(value) ? `${value.toFixed(1)}%` : '—';

// Мини-калькулятор потерь
const nowPriceEl = document.getElementById('now-price');
const futurePriceEl = document.getElementById('future-price');
const nowDownEl = document.getElementById('now-down');
const futureDownEl = document.getElementById('future-down');
const nowPaymentEl = document.getElementById('now-payment');
const futurePaymentEl = document.getElementById('future-payment');
const lossForm = document.getElementById('loss-calculator');
const lossResult = document.getElementById('loss-result');

if (lossForm) {
  lossForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(lossForm);
    const area = Number(formData.get('area')) || 0;
    const price = Number(formData.get('price')) || 0;
    const growth = Number(formData.get('growth')) || 0;

    const months = 3;
    const currentCost = area * price;
    const forecastCost = currentCost * Math.pow(1 + growth / 100, months);
    const forecastPricePerM2 = price * Math.pow(1 + growth / 100, months);
    const loss = Math.max(forecastCost - currentCost, 0);

    const downRate = 0.2;
    const baseRate = 0.065 / 12;
    const baseTermMonths = 20 * 12;
    const annuity = (principal) => baseRate === 0 ? principal / baseTermMonths : principal * (baseRate * Math.pow(1 + baseRate, baseTermMonths)) / (Math.pow(1 + baseRate, baseTermMonths) - 1);

    const nowDownPayment = currentCost * downRate;
    const futureDownPayment = forecastCost * downRate;
    const nowMonthly = annuity(currentCost - nowDownPayment);
    const futureMonthly = annuity(forecastCost - futureDownPayment);

    if (nowPriceEl) nowPriceEl.textContent = formatCurrency(price);
    if (futurePriceEl) futurePriceEl.textContent = formatCurrency(forecastPricePerM2);
    if (nowDownEl) nowDownEl.textContent = formatCurrency(nowDownPayment);
    if (futureDownEl) futureDownEl.textContent = formatCurrency(futureDownPayment);
    if (nowPaymentEl) nowPaymentEl.textContent = formatCurrency(nowMonthly);
    if (futurePaymentEl) futurePaymentEl.textContent = formatCurrency(futureMonthly);

    lossResult.innerHTML = `Если отложить покупку на 3 месяца, вы переплатите <strong>≈ ${formatCurrency(loss)}</strong>.`;
  });
}

// Финансовый калькулятор
const financeForm = document.getElementById('finance-form');
const roiEl = document.getElementById('roi');
const irrEl = document.getElementById('irr');
const npvEl = document.getElementById('npv');
const realReturnEl = document.getElementById('real-return');
const ownershipEl = document.getElementById('ownership');
const inflationBar = document.getElementById('inflation-bar');
const inflationSlider = document.getElementById('inflation-slider');
const rentSlider = document.getElementById('rent-slider');

const calculateFinance = () => {
  const formData = new FormData(financeForm);
  const price = (Number(formData.get('price')) || 0) * 1_000_000;
  const down = Number(formData.get('down')) / 100;
  const rate = Number(formData.get('rate')) / 100 / 12;
  const termYears = Number(formData.get('term'));
  const rent = (Number(formData.get('rent')) || 0) * 1000;
  const costs = (Number(formData.get('cost')) || 0) * 1000;
  const discount = Number(formData.get('discount')) / 100;
  const months = termYears * 12;

  const loanAmount = price * (1 - down);
  const monthlyPayment = rate === 0 ? loanAmount / months : loanAmount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
  const netCashflowMonthly = rent - costs - monthlyPayment;
  const annualNetCashflow = netCashflowMonthly * 12;
  const roi = price > 0 ? (annualNetCashflow / price) * 100 : 0;

  const npv = discount === 0
    ? annualNetCashflow * termYears - price
    : -price + annualNetCashflow * ((1 - Math.pow(1 + discount, -termYears)) / discount);

  let irr = 0;
  if (Math.abs(annualNetCashflow) > 1 && termYears > 0 && price > 0) {
    const irrApprox = Math.pow((annualNetCashflow + price) / price, 1 / termYears) - 1;
    if (Number.isFinite(irrApprox)) {
      irr = irrApprox * 100;
    }
  }

  const inflation = Number(inflationSlider.value) / 100;
  const rentGrowth = Number(rentSlider.value) / 100;
  const realReturn = (1 + roi / 100) / (1 + inflation) - 1;
  const ownershipIndex = down * 100 + (rentGrowth * 100) - inflation * 40;

  roiEl.textContent = formatPercent(roi);
  irrEl.textContent = formatPercent(irr);
  npvEl.textContent = formatCurrency(npv);
  realReturnEl.textContent = formatPercent(realReturn * 100);
  ownershipEl.textContent = ownershipIndex.toFixed(0);

  const inflationImpact = Math.min(Math.max(1 - inflation, 0.1), 1);
  inflationBar.style.height = `${inflationImpact * 100}%`;
};

if (financeForm) {
  financeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    calculateFinance();
  });

  inflationSlider.addEventListener('input', calculateFinance);
  rentSlider.addEventListener('input', calculateFinance);
  calculateFinance();
}

// Коммерческий калькулятор
const commercialForm = document.getElementById('commercial-form');
const buyPaybackEl = document.getElementById('buy-payback');
const buyCashEl = document.getElementById('buy-cash');
const rentSavingEl = document.getElementById('rent-saving');

if (commercialForm) {
  commercialForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(commercialForm);
    const purchase = (Number(formData.get('purchase')) || 0) * 1_000_000;
    const lease = (Number(formData.get('lease')) || 0) * 1000;
    const opcost = (Number(formData.get('opcost')) || 0) * 1000;
    const traffic = Number(formData.get('traffic')) / 100;

    const projectedRevenue = lease * (1 + traffic);
    const monthlyCash = projectedRevenue - opcost;
    const payback = monthlyCash > 0 ? purchase / (monthlyCash * 12) : Infinity;

    buyPaybackEl.textContent = payback === Infinity ? '—' : payback.toFixed(1);
    buyCashEl.textContent = formatCurrency(monthlyCash);
    rentSavingEl.textContent = formatCurrency(Math.max(opcost - lease, 0));
  });
}

// Методология модалка
const methodologyBtn = document.getElementById('methodology-btn');
const methodologyModal = document.getElementById('methodology-modal');
const modalClose = document.getElementById('modal-close');

const toggleModal = (visible) => {
  methodologyModal.setAttribute('aria-hidden', visible ? 'false' : 'true');
  if (visible) {
    modalClose.focus({ preventScroll: true });
  }
};

if (methodologyBtn && methodologyModal && modalClose) {
  methodologyBtn.addEventListener('click', () => toggleModal(true));
  modalClose.addEventListener('click', () => toggleModal(false));
  methodologyModal.addEventListener('click', (event) => {
    if (event.target === methodologyModal) {
      toggleModal(false);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleModal(false);
    }
  });
}

// Автоматический пересчёт начальных блоков
if (commercialForm) {
  commercialForm.dispatchEvent(new Event('submit'));
}
if (financeForm) {
  financeForm.dispatchEvent(new Event('submit'));
}
if (lossForm) {
  lossForm.dispatchEvent(new Event('submit'));
}
