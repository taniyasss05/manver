/**
 * Логика интерактивного взаимодействия сайта MANVER:
 * - Рендеринг и фильтрация каталога из 20 товаров
 * - Калькулятор площади (м²) и стоимости сетей/основ
 * - Обработка заявок без корзины (по номеру телефона)
 * - Формирование прямого заказа в WhatsApp
 * - Сохранение заявок в localStorage для коллег и админ-просмотр
 */

// 1. Отключаем авто-восстановление позиции скролла браузером (iOS Safari, Android Chrome, WebView),
// чтобы при открытии ссылки страница не «уезжала» анимированно в самый низ к предыдущему месту просмотра
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// 2. Если в адресе нет явного якоря, гарантированно стартуем с самого верха
if (!window.location.hash) {
  window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.hash) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
  applyDynamicContent();
  initIcons();
  initCatalog();
  initCalculator();
  initPhoneMasks();
  initModals();
  initForms();
  initMobileMenu();
  initSmoothScroll();
  renderLeadsCount();
});

// Плавный скролл активируется только после завершения рендеринга страницы,
// чтобы исключить ложные автопрокрутки на мобильных устройствах
window.addEventListener('load', () => {
  if (!window.location.hash) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
  setTimeout(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, 200);
});

function applyDynamicContent() {
  if (!window.MANVER_CONTENT) return;
  const c = window.MANVER_CONTENT.contacts;
  if (c) {
    if (c.phone) {
      document.querySelectorAll('a[href^="tel:"]').forEach(el => {
        el.href = `tel:${c.phoneRaw || c.phone.replace(/[^0-9+]/g, '')}`;
        if (el.innerText.includes('+7') || el.innerText.includes('8 (')) {
          el.innerText = c.phone;
        }
      });
    }
    if (c.telegram) {
      document.querySelectorAll('a[href*="t.me"]').forEach(el => {
        el.href = c.telegram;
      });
    }
    if (c.max) {
      document.querySelectorAll('a[href*="max.ru"]').forEach(el => {
        el.href = c.max;
      });
    }
  }
}

// Инициализация иконок Lucide
function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// КАТАЛОГ 12 ХОДОВЫХ ТОВАРОВ MANVER
// -------------------------------------------------------------
function initCatalog() {
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid || !window.MANVER_PRODUCTS) return;

  // Строго 12 товаров для лаконичной и ровной сетки 3х4 (по 4 в строке на ПК)
  const productsToRender = window.MANVER_PRODUCTS.slice(0, 12);

  grid.innerHTML = productsToRender.map(product => {
    return `
      <div class="product-card bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-emerald-700 transition-all duration-300">
        <div>
          <!-- Фотография товара (увеличенная, сочная) -->
          <div class="product-card-img-wrap relative w-full overflow-hidden bg-stone-900 border-b border-stone-100 group">
            <img src="${product.image || 'assets/images/camo_weave_detail_hd.jpg'}" 
                 onerror="if(!this.dataset.retried){this.dataset.retried='1';var f=this.src.split('/').pop().split('?')[0];this.src=f;}else if(this.dataset.retried==='1'){this.dataset.retried='2';this.src='assets/images/camo_weave_detail_hd.jpg';}else{this.onerror=null;this.src='camo_weave_detail_hd.jpg';}"
                 alt="${product.name}" 
                 class="w-full h-full object-cover object-center transition duration-700 ease-out group-hover:scale-105"
                 loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/10 to-transparent pointer-events-none"></div>
            
            <span class="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md ${product.badgeColor}">
              ${product.badge}
            </span>
            <span class="absolute bottom-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-stone-900/80 backdrop-blur-xs text-white shadow-sm border border-white/15">
              ${product.categoryName}
            </span>
          </div>

          <!-- Название товара (лаконично, без описания и характеристик) -->
          <div class="p-4 sm:p-5 pb-1">
            <h3 class="text-sm sm:text-[15px] font-bold text-stone-900 leading-snug min-h-[42px] line-clamp-2">
              ${product.name}
            </h3>
          </div>
        </div>

        <!-- Нижний блок: Стоимость и кнопки (Заказать + Telegram + MAX) -->
        <div class="p-4 sm:p-5 pt-0">
          <div class="pt-2.5 pb-3 border-t border-stone-100 flex items-baseline justify-between">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Стоимость:</span>
              <div class="flex items-baseline gap-1 mt-0.5">
                <span class="text-xl sm:text-2xl font-black text-[#15432A] tracking-tight">${product.pricePerM2} ₽</span>
                <span class="text-xs text-stone-500 font-medium">/ м²</span>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <button onclick="openOrderModal('${encodeURIComponent(product.name)}', ${product.pricePerM2})" 
              class="w-full py-2.5 px-3 rounded-xl bg-[#15432A] hover:bg-[#1c5535] text-white font-bold text-xs sm:text-[13px] transition shadow-xs hover:shadow flex items-center justify-center gap-1.5 group">
              <span>Заказать</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"></i>
            </button>
            
            <div class="grid grid-cols-2 gap-2">
              <button onclick="sendToTelegramProduct('${encodeURIComponent(product.name)}', ${product.pricePerM2})"
                class="py-2 px-2 rounded-xl bg-sky-50/80 hover:bg-sky-100 text-sky-950 font-bold text-[11px] sm:text-xs transition border border-sky-200/80 flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs" title="Написать в Telegram">
                <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="12" fill="#24A1DE"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.4 12c3.4-1.5 5.7-2.5 6.9-3 3.3-1.4 4-1.6 4.5-1.6.1 0 .3 0 .4.1.1.1.2.2.2.4 0 .1 0 .3-.1.5-.2 1.9-1 6.5-1.4 8.6-.2.9-.5 1.2-.8 1.2-.7.1-1.2-.5-1.9-.9-1.1-.7-1.7-1.1-2.7-1.8-1.2-.8-.4-1.2.3-1.9.2-.2 3.2-3 3.3-3.2 0 0 0-.1-.1-.2-.1 0-.2 0-.2 0-.1 0-1.8 1.1-5.1 3.3-.5.3-.9.5-1.3.5-.4 0-1.3-.2-1.9-.4-.8-.2-1.3-.4-1.3-.8 0-.2.3-.4.9-.7z" fill="white"/>
                </svg>
                <span>Telegram</span>
              </button>
              
              <button onclick="sendToMaxProduct('${encodeURIComponent(product.name)}', ${product.pricePerM2})"
                class="py-2 px-2 rounded-xl bg-purple-50/80 hover:bg-purple-100 text-purple-950 font-bold text-[11px] sm:text-xs transition border border-purple-200/80 flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs" title="Написать в MAX">
                <img src="assets/images/max_messenger_logo.svg" alt="MAX" class="w-3.5 h-3.5 shrink-0 rounded-[3px]">
                <span>MAX</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  initIcons();
}

// -------------------------------------------------------------
// ИНТЕРАКТИВНЫЙ КАЛЬКУЛЯТОР РАЗМЕРА И СТОИМОСТИ (м²)
// -------------------------------------------------------------
const CALC_PRICES = {
  standard_net: 280,
  heavy_net: 480,
  double_net: 520,
  base_only: 140,
  base_framed: 210
};

function initCalculator() {
  const widthInput = document.getElementById('calcWidth');
  const lengthInput = document.getElementById('calcLength');
  const widthSlider = document.getElementById('calcWidthSlider');
  const lengthSlider = document.getElementById('calcLengthSlider');
  const typeSelect = document.getElementById('calcType');
  const eyeletsCheck = document.getElementById('calcEyelets');

  if (!widthInput || !lengthInput) return;

  // Синхронизация инпута и слайдера ширины
  widthInput.addEventListener('input', () => {
    widthSlider.value = widthInput.value;
    calculateTotal();
  });
  widthSlider.addEventListener('input', () => {
    widthInput.value = widthSlider.value;
    calculateTotal();
  });

  // Синхронизация инпута и слайдера длины
  lengthInput.addEventListener('input', () => {
    lengthSlider.value = lengthInput.value;
    calculateTotal();
  });
  lengthSlider.addEventListener('input', () => {
    lengthInput.value = lengthSlider.value;
    calculateTotal();
  });

  typeSelect.addEventListener('change', calculateTotal);
  const colorSelect = document.getElementById('calcColor');
  if (colorSelect) colorSelect.addEventListener('change', calculateTotal);
  if (eyeletsCheck) eyeletsCheck.addEventListener('change', calculateTotal);

  // Первоначальный расчет
  calculateTotal();
}

function calculateTotal() {
  const width = parseFloat(document.getElementById('calcWidth')?.value) || 0;
  const length = parseFloat(document.getElementById('calcLength')?.value) || 0;
  const typeKey = document.getElementById('calcType')?.value || 'standard_net';

  const area = Math.round(width * length * 10) / 10;
  let baseM2Price = CALC_PRICES[typeKey] || 280;

  // Сумма чисто за метры (люверсы входят в стоимость)
  let rawTotal = area * baseM2Price;

  // Система скидок:
  // - до 90 м²: базовая цена (0%)
  // - от 90 м²: 5% скидка
  // - от 180 м² и выше: 10% скидка (на весь объем без ограничений)
  let discountPercent = 0;
  let discountBadge = 'Базовая цена';

  if (area >= 180) {
    discountPercent = 10;
    discountBadge = 'Скидка 10% (от 180 м²)';
  } else if (area >= 90) {
    discountPercent = 5;
    discountBadge = 'Скидка 5% (от 90 м²)';
  } else {
    discountPercent = 0;
    discountBadge = 'Базовая цена';
  }

  const discountAmount = Math.round(rawTotal * (discountPercent / 100));
  const finalPrice = Math.max(0, Math.round(rawTotal - discountAmount));

  // Вывод в DOM
  const areaEl = document.getElementById('calcResultArea');
  const priceM2El = document.getElementById('calcResultPriceM2');
  const totalEl = document.getElementById('calcResultTotal');
  const discountEl = document.getElementById('calcDiscountBadge');
  const leadTimeEl = document.getElementById('calcLeadTime');

  if (areaEl) areaEl.innerText = `${area} м²`;
  if (priceM2El) priceM2El.innerText = `${baseM2Price} ₽/м²`;
  if (totalEl) totalEl.innerText = `${finalPrice.toLocaleString('ru-RU')} ₽`;
  
  if (discountEl) {
    discountEl.innerText = discountBadge;
    if (discountPercent > 0) {
      discountEl.className = 'inline-block text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 shadow-xs tracking-tight';
    } else {
      discountEl.className = 'inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200';
    }
  }

  if (leadTimeEl) {
    if (area >= 100) {
      leadTimeEl.innerText = 'Оптовая партия: отгрузка со склада за 24 часа';
    } else if (area <= 30) {
      leadTimeEl.innerText = 'В наличии на складе (отгрузка сегодня)';
    } else {
      leadTimeEl.innerText = 'Изготовление под заказ: 1–2 рабочих дня';
    }
  }

  // Управление расцветкой в калькуляторе
  const isBase = typeKey.startsWith('base_');
  const colorWrapper = document.getElementById('calcColorWrapper');
  const colorSelect = document.getElementById('calcColor');
  const colorBadge = document.getElementById('calcColorBadge');
  const selectedColorText = document.getElementById('calcSelectedColorText');
  const colorSummaryRow = document.getElementById('calcColorSummaryRow');

  if (colorWrapper) {
    if (isBase) {
      colorWrapper.classList.add('opacity-40', 'pointer-events-none');
      if (colorBadge) colorBadge.innerText = 'Не требуется';
      if (selectedColorText) selectedColorText.innerText = 'Основа (без маскировки)';
    } else {
      colorWrapper.classList.remove('opacity-40', 'pointer-events-none');
      const currentColor = colorSelect ? colorSelect.value : 'Бор';
      if (colorBadge) colorBadge.innerText = currentColor;
      if (selectedColorText) selectedColorText.innerText = currentColor;
    }
  }
}

// Выбор цвета из витрины расцветок
window.selectColor = function(colorName) {
  const typeSelect = document.getElementById('calcType');
  const colorSelect = document.getElementById('calcColor');
  if (typeSelect && typeSelect.value.startsWith('base_')) {
    typeSelect.value = 'standard_net';
  }
  if (colorSelect) {
    let matched = false;
    for (let opt of colorSelect.options) {
      if (opt.value === colorName || opt.value.endsWith(colorName) || colorName.endsWith(opt.value)) {
        colorSelect.value = opt.value;
        matched = true;
        break;
      }
    }
    if (!matched) colorSelect.value = colorName;
  }
  calculateTotal();
  const calcSection = document.getElementById('calculator');
  if (calcSection) {
    calcSection.scrollIntoView({ behavior: 'smooth' });
    const colorWrapper = document.getElementById('calcColorWrapper');
    if (colorWrapper) {
      colorWrapper.classList.add('ring-2', 'ring-emerald-700', 'rounded-2xl', 'p-1', 'transition-all');
      setTimeout(() => {
        colorWrapper.classList.remove('ring-2', 'ring-emerald-700', 'p-1');
      }, 1500);
    }
  }
};

// Выбор размера из блока «Прочная основа»
window.selectCalcSize = function(width, length) {
  const widthInput = document.getElementById('calcWidth');
  const lengthInput = document.getElementById('calcLength');
  const widthSlider = document.getElementById('calcWidthSlider');
  const lengthSlider = document.getElementById('calcLengthSlider');

  if (widthInput && lengthInput) {
    widthInput.value = width;
    lengthInput.value = length;
    if (widthSlider) widthSlider.value = width;
    if (lengthSlider) lengthSlider.value = length;
    calculateTotal();
  }

  const calcSection = document.getElementById('calculator');
  if (calcSection) {
    calcSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// Быстрый заказ из калькулятора
window.orderFromCalculator = function() {
  const width = document.getElementById('calcWidth')?.value;
  const length = document.getElementById('calcLength')?.value;
  const area = document.getElementById('calcResultArea')?.innerText;
  const total = document.getElementById('calcResultTotal')?.innerText;
  const typeSelect = document.getElementById('calcType');
  const typeName = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : 'Маскировочная сеть';
  const colorSelect = document.getElementById('calcColor');
  const isBase = typeSelect && typeSelect.value.startsWith('base_');
  const colorText = (!isBase && colorSelect) ? `Цвет: ${colorSelect.value}, ` : '';

  const orderTitle = `${typeName} (${colorText}Размер: ${width}×${length} м, ${area})`;
  openOrderModal(encodeURIComponent(orderTitle), total);
};

// Отправка данных калькулятора прямо в Telegram
window.sendCalculatorToTelegram = function() {
  const width = document.getElementById('calcWidth')?.value;
  const length = document.getElementById('calcLength')?.value;
  const area = document.getElementById('calcResultArea')?.innerText;
  const total = document.getElementById('calcResultTotal')?.innerText;
  const discountBadge = document.getElementById('calcDiscountBadge')?.innerText || '';
  const typeSelect = document.getElementById('calcType');
  const typeName = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : 'Маскировочная сеть';
  const colorSelect = document.getElementById('calcColor');
  const isBase = typeSelect && typeSelect.value.startsWith('base_');
  const colorLine = (!isBase && colorSelect) ? `\n• Расцветка: ${colorSelect.value}` : '';

  const text = `Здравствуйте! Хочу заказать в MANVER:\n• Позиция: ${typeName}${colorLine}\n• Размеры: ${width} × ${length} м (${area})\n• Предварительный расчет калькулятора: ${total}${discountBadge ? ' (' + discountBadge + ')' : ''}\nПодскажите по наличию и срокам доставки.`;
  const url = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/manver_nets')}&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};
window.sendCalculatorToWhatsApp = window.sendCalculatorToTelegram;

// Отправка данных калькулятора в MAX
window.sendCalculatorToMax = function() {
  const width = document.getElementById('calcWidth')?.value;
  const length = document.getElementById('calcLength')?.value;
  const area = document.getElementById('calcResultArea')?.innerText;
  const total = document.getElementById('calcResultTotal')?.innerText;
  const discountBadge = document.getElementById('calcDiscountBadge')?.innerText || '';
  const typeSelect = document.getElementById('calcType');
  const typeName = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : 'Маскировочная сеть';
  const colorSelect = document.getElementById('calcColor');
  const isBase = typeSelect && typeSelect.value.startsWith('base_');
  const colorLine = (!isBase && colorSelect) ? `\n• Расцветка: ${colorSelect.value}` : '';

  const text = `Здравствуйте! Хочу заказать в MANVER:\n• Позиция: ${typeName}${colorLine}\n• Размеры: ${width} × ${length} м (${area})\n• Расчет калькулятора: ${total}${discountBadge ? ' (' + discountBadge + ')' : ''}\nПодскажите наличие и сроки.`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  const maxUrl = (window.MANVER_CONTENT && window.MANVER_CONTENT.contacts && window.MANVER_CONTENT.contacts.max) || 'https://max.ru/u/manver';
  window.open(maxUrl, '_blank');
};

// Отправка заявки из модального окна в мессенджеры
window.sendModalToTelegram = function() {
  const product = document.getElementById('orderModalProductTitle')?.innerText || 'Маскировочная сеть';
  const dim = document.querySelector('#orderModal input[name="dimensions"]')?.value;
  const text = `Здравствуйте! Интересует заказ «${product}»${dim ? ' (' + dim + ')' : ''}. Подскажите наличие нужных размеров и условия доставки.`;
  const url = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/manver_nets')}&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};

window.sendModalToMax = function() {
  const product = document.getElementById('orderModalProductTitle')?.innerText || 'Маскировочная сеть';
  const dim = document.querySelector('#orderModal input[name="dimensions"]')?.value;
  const text = `Здравствуйте! Интересует заказ «${product}»${dim ? ' (' + dim + ')' : ''}.`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  const maxUrl = (window.MANVER_CONTENT && window.MANVER_CONTENT.contacts && window.MANVER_CONTENT.contacts.max) || 'https://max.ru/u/manver';
  window.open(maxUrl, '_blank');
};

// -------------------------------------------------------------
// МОДАЛЬНЫЕ ОКНА И ЗАКАЗ В 1 КЛИК
// -------------------------------------------------------------
let activeProductName = '';
let activeProductPrice = '';

window.openOrderModal = function(nameEncoded, price) {
  const name = decodeURIComponent(nameEncoded);
  activeProductName = name;
  activeProductPrice = price;

  const modal = document.getElementById('orderModal');
  const titleEl = document.getElementById('orderModalProductTitle');
  const hiddenInput = document.getElementById('orderModalProductInput');
  const sizeSelect = document.getElementById('orderModalSize');

  if (titleEl) titleEl.innerText = name;
  if (hiddenInput) hiddenInput.value = name;

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
};

window.closeOrderModal = function() {
  const modal = document.getElementById('orderModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
};

window.openCallModal = function() {
  const modal = document.getElementById('callModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
};

window.closeCallModal = function() {
  const modal = document.getElementById('callModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
};

// Отправка в Telegram по товару
window.sendToTelegramProduct = function(nameEncoded, price) {
  const name = decodeURIComponent(nameEncoded);
  const text = `Здравствуйте! Интересует позиция «${name}» (${price} ₽/м²). Подскажите наличие нужных размеров и условия доставки.`;
  const url = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/manver_nets')}&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
};
window.sendToWhatsAppProduct = window.sendToTelegramProduct;

// Отправка в MAX по товару
window.sendToMaxProduct = function(nameEncoded, price) {
  const name = decodeURIComponent(nameEncoded);
  const maxUrl = (window.MANVER_CONTENT && window.MANVER_CONTENT.contacts && window.MANVER_CONTENT.contacts.max) || 'https://max.ru/u/manver';
  window.open(maxUrl, '_blank');
};

// -------------------------------------------------------------
// МАСКА НОМЕРА ТЕЛЕФОНА +7 (XXX) XXX-XX-XX
// -------------------------------------------------------------
function initPhoneMasks() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', onPhoneInput);
    input.addEventListener('focus', onPhoneFocus);
    input.addEventListener('keydown', onPhoneKeyDown);
  });
}

function getPhoneDigits(val) {
  return val.replace(/\D/g, '');
}

function onPhoneFocus(e) {
  if (!e.target.value) {
    e.target.value = '+7 (';
  }
}

function onPhoneKeyDown(e) {
  if (e.keyCode === 8 && getPhoneDigits(e.target.value).length <= 1) {
    e.target.value = '';
  }
}

function onPhoneInput(e) {
  const input = e.target;
  let digits = getPhoneDigits(input.value);

  if (!digits) {
    input.value = '';
    return;
  }

  if (['7', '8', '9'].includes(digits[0])) {
    if (digits[0] === '9') digits = '7' + digits;
    const firstDigit = '+7';
    let formatted = firstDigit + ' (';

    if (digits.length > 1) {
      formatted += digits.substring(1, 4);
    }
    if (digits.length >= 5) {
      formatted += ') ' + digits.substring(4, 7);
    }
    if (digits.length >= 8) {
      formatted += '-' + digits.substring(7, 9);
    }
    if (digits.length >= 10) {
      formatted += '-' + digits.substring(9, 11);
    }
    input.value = formatted;
  } else {
    input.value = '+' + digits.substring(0, 15);
  }
}

// -------------------------------------------------------------
// ОБРАБОТКА ФОРМ И СОХРАНЕНИЕ ЗАЯВОК (localStorage)
// -------------------------------------------------------------
function initForms() {
  const allForms = document.querySelectorAll('form[data-lead-form]');
  allForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(form);
    });
  });
}

function handleFormSubmit(form) {
  const formData = new FormData(form);
  const data = {
    id: Date.now(),
    date: new Date().toLocaleString('ru-RU'),
    name: formData.get('name') || 'Клиент',
    phone: formData.get('phone') || '',
    task: formData.get('task') || '',
    dimensions: formData.get('dimensions') || '',
    product: formData.get('product') || activeProductName || 'Общий расчет',
    source: form.dataset.formName || 'Форма на сайте'
  };

  if (!data.phone || data.phone.length < 10) {
    alert('Пожалуйста, введите корректный номер телефона для связи.');
    return;
  }

  // Сохраняем в память браузера (localStorage)
  const existingLeads = JSON.parse(localStorage.getItem('manver_leads') || '[]');
  existingLeads.unshift(data);
  localStorage.setItem('manver_leads', JSON.stringify(existingLeads));

  // Отправляем заявку в панель управления на сервер (data/leads.json)
  try {
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        type: data.source,
        details: [
          data.product ? `Товар: ${data.product}` : '',
          data.dimensions ? `Размер: ${data.dimensions}` : '',
          data.task ? `Задача: ${data.task}` : ''
        ].filter(Boolean).join(' | ') || 'Заявка с сайта'
      })
    }).catch(() => {});
  } catch (err) {}

  // Закрываем модалки, если были открыты
  closeOrderModal();
  closeCallModal();

  // Показываем окно успеха
  showSuccessModal(data);
  form.reset();
  renderLeadsCount();
}

function showSuccessModal(leadData) {
  const successModal = document.getElementById('successModal');
  const phoneText = document.getElementById('successPhoneText');
  if (phoneText) phoneText.innerText = leadData.phone;

  if (successModal) {
    successModal.classList.remove('hidden');
    successModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

window.closeSuccessModal = function() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
};

// -------------------------------------------------------------
// ПАНЕЛЬ ПРОСМОТРА ЗАЯВОК (ДЛЯ КОЛЛЕГ И ТЕСТИРОВАНИЯ)
// -------------------------------------------------------------
function renderLeadsCount() {
  const leads = JSON.parse(localStorage.getItem('manver_leads') || '[]');
  const badges = document.querySelectorAll('.leads-counter-badge');
  badges.forEach(b => {
    b.innerText = leads.length;
    b.style.display = leads.length > 0 ? 'inline-flex' : 'none';
  });
}

window.openLeadsAdminModal = function() {
  const modal = document.getElementById('leadsAdminModal');
  const listEl = document.getElementById('leadsAdminList');
  const leads = JSON.parse(localStorage.getItem('manver_leads') || '[]');

  if (listEl) {
    if (leads.length === 0) {
      listEl.innerHTML = `
        <div class="text-center py-10 text-stone-500">
          <i data-lucide="inbox" class="w-10 h-10 mx-auto mb-2 text-stone-400"></i>
          <p class="font-medium">Заявок пока нет</p>
          <p class="text-xs mt-1">Оставьте тестовую заявку в любой форме сайта, чтобы проверить сохранение.</p>
        </div>
      `;
    } else {
      listEl.innerHTML = leads.map(l => `
        <div class="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs space-y-1.5">
          <div class="flex justify-between items-center text-stone-500 text-[11px]">
            <span>${l.date}</span>
            <span class="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">${l.source}</span>
          </div>
          <div class="text-sm font-bold text-stone-900">${l.name} • <a href="tel:${l.phone}" class="text-emerald-700 underline">${l.phone}</a></div>
          <div class="text-stone-700"><span class="font-semibold text-stone-900">Интерес:</span> ${l.product}</div>
          ${l.task ? `<div class="text-stone-600"><span class="font-semibold text-stone-900">Объект:</span> ${l.task}</div>` : ''}
          ${l.dimensions ? `<div class="text-stone-600"><span class="font-semibold text-stone-900">Размеры:</span> ${l.dimensions}</div>` : ''}
        </div>
      `).join('');
    }
  }

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    initIcons();
  }
};

window.closeLeadsAdminModal = function() {
  const modal = document.getElementById('leadsAdminModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.clearAllLeads = function() {
  if (confirm('Очистить список сохраненных тестовых заявок?')) {
    localStorage.removeItem('manver_leads');
    renderLeadsCount();
    openLeadsAdminModal();
  }
};

// Мобильное меню
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }
}

// Плавный переход по внутренним ссылкам-якорям с автоматическим закрытием мобильного меню
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          const menu = document.getElementById('mobileMenu');
          if (menu && !menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
          }
        }
      }
    });
  });
}

function initModals() {
  // Закрытие по клику на фон
  const modals = ['orderModal', 'callModal', 'successModal', 'leadsAdminModal'];
  modals.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          el.classList.add('hidden');
          el.classList.remove('flex');
          document.body.style.overflow = '';
        }
      });
    }
  });
}
