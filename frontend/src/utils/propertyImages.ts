// Встроенные SVG изображения для каждого типа недвижимости
// Работают на любом устройстве без интернета и внешних запросов

const APARTMENT_SVG = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="aptGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#357ABD;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#aptGrad)"/>
  <g opacity="0.9">
    <!-- Здание -->
    <rect x="80" y="60" width="240" height="200" fill="#fff" opacity="0.2"/>
    <rect x="100" y="80" width="200" height="180" fill="#fff" opacity="0.15"/>

    <!-- Окна -->
    <rect x="120" y="100" width="35" height="35" fill="#fff" opacity="0.5"/>
    <rect x="165" y="100" width="35" height="35" fill="#fff" opacity="0.5"/>
    <rect x="210" y="100" width="35" height="35" fill="#fff" opacity="0.5"/>
    <rect x="255" y="100" width="35" height="35" fill="#fff" opacity="0.5"/>

    <rect x="120" y="145" width="35" height="35" fill="#fff" opacity="0.5"/>
    <rect x="165" y="145" width="35" height="35" fill="#fff" opacity="0.5"/>
    <rect x="210" y="145" width="35" height="35" fill="#fff" opacity="0.5"/>
    <rect x="255" y="145" width="35" height="35" fill="#fff" opacity="0.5"/>

    <rect x="120" y="190" width="35" height="35" fill="#fff" opacity="0.5"/>
    <rect x="165" y="190" width="35" height="35" fill="#fff" opacity="0.5"/>
    <rect x="210" y="190" width="35" height="35" fill="#fff" opacity="0.5"/>
    <rect x="255" y="190" width="35" height="35" fill="#fff" opacity="0.5"/>
  </g>

  <!-- Иконка дома -->
  <g transform="translate(180, 240)">
    <path d="M20 10 L0 25 L5 25 L5 40 L35 40 L35 25 L40 25 Z" fill="#fff" opacity="0.8"/>
    <rect x="15" y="30" width="10" height="10" fill="#4A90E2"/>
  </g>

  <text x="200" y="280" font-family="Arial, sans-serif" font-size="18" fill="#fff" text-anchor="middle" font-weight="bold">КВАРТИРА</text>
</svg>
`)}`;

const HOUSE_SVG = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="houseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#52C41A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3FA016;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#houseGrad)"/>

  <!-- Дом -->
  <g opacity="0.9">
    <!-- Крыша -->
    <polygon points="200,70 100,140 300,140" fill="#fff" opacity="0.3"/>
    <polygon points="200,80 120,135 280,135" fill="#fff" opacity="0.2"/>

    <!-- Стены -->
    <rect x="120" y="135" width="160" height="120" fill="#fff" opacity="0.25"/>

    <!-- Окна -->
    <rect x="140" y="155" width="30" height="30" fill="#52C41A" opacity="0.6"/>
    <rect x="185" y="155" width="30" height="30" fill="#52C41A" opacity="0.6"/>
    <rect x="230" y="155" width="30" height="30" fill="#52C41A" opacity="0.6"/>

    <!-- Дверь -->
    <rect x="175" y="200" width="50" height="55" fill="#fff" opacity="0.4"/>

    <!-- Труба -->
    <rect x="230" y="60" width="20" height="40" fill="#fff" opacity="0.3"/>
  </g>

  <!-- Иконка -->
  <g transform="translate(180, 240)">
    <polygon points="20,0 0,15 5,15 5,30 35,30 35,15 40,15" fill="#fff" opacity="0.8"/>
    <rect x="15" y="20" width="10" height="10" fill="#52C41A"/>
  </g>

  <text x="200" y="280" font-family="Arial, sans-serif" font-size="18" fill="#fff" text-anchor="middle" font-weight="bold">ДОМ</text>
</svg>
`)}`;

const OFFICE_SVG = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="officeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#FF9500;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#E67E00;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#officeGrad)"/>

  <!-- Офисное здание -->
  <g opacity="0.9">
    <!-- Здание -->
    <rect x="80" y="40" width="240" height="220" fill="#fff" opacity="0.2"/>
    <rect x="100" y="55" width="200" height="205" fill="#fff" opacity="0.15"/>

    <!-- Сетка окон -->
    <rect x="115" y="70" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="150" y="70" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="185" y="70" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="220" y="70" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="255" y="70" width="25" height="25" fill="#fff" opacity="0.5"/>

    <rect x="115" y="105" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="150" y="105" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="185" y="105" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="220" y="105" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="255" y="105" width="25" height="25" fill="#fff" opacity="0.5"/>

    <rect x="115" y="140" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="150" y="140" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="185" y="140" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="220" y="140" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="255" y="140" width="25" height="25" fill="#fff" opacity="0.5"/>

    <rect x="115" y="175" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="150" y="175" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="185" y="175" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="220" y="175" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="255" y="175" width="25" height="25" fill="#fff" opacity="0.5"/>

    <rect x="115" y="210" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="150" y="210" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="185" y="210" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="220" y="210" width="25" height="25" fill="#fff" opacity="0.5"/>
    <rect x="255" y="210" width="25" height="25" fill="#fff" opacity="0.5"/>
  </g>

  <!-- Иконка -->
  <g transform="translate(165, 240)">
    <rect x="0" y="5" width="70" height="50" fill="#fff" opacity="0.8" rx="2"/>
    <rect x="7" y="12" width="12" height="12" fill="#FF9500" opacity="0.7"/>
    <rect x="22" y="12" width="12" height="12" fill="#FF9500" opacity="0.7"/>
    <rect x="37" y="12" width="12" height="12" fill="#FF9500" opacity="0.7"/>
    <rect x="52" y="12" width="12" height="12" fill="#FF9500" opacity="0.7"/>
    <rect x="7" y="27" width="12" height="12" fill="#FF9500" opacity="0.7"/>
    <rect x="22" y="27" width="12" height="12" fill="#FF9500" opacity="0.7"/>
    <rect x="37" y="27" width="12" height="12" fill="#FF9500" opacity="0.7"/>
    <rect x="52" y="27" width="12" height="12" fill="#FF9500" opacity="0.7"/>
  </g>

  <text x="200" y="280" font-family="Arial, sans-serif" font-size="18" fill="#fff" text-anchor="middle" font-weight="bold">ОФИС</text>
</svg>
`)}`;

const RETAIL_SVG = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="retailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#9C27B0;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7B1FA2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#retailGrad)"/>

  <!-- Магазин -->
  <g opacity="0.9">
    <!-- Здание -->
    <rect x="70" y="90" width="260" height="170" fill="#fff" opacity="0.2"/>
    <rect x="85" y="105" width="230" height="155" fill="#fff" opacity="0.15"/>

    <!-- Витрина -->
    <rect x="100" y="130" width="90" height="110" fill="#fff" opacity="0.4"/>
    <rect x="210" y="130" width="90" height="110" fill="#fff" opacity="0.4"/>

    <!-- Навес -->
    <rect x="70" y="90" width="260" height="30" fill="#fff" opacity="0.3"/>

    <!-- Вход -->
    <rect x="160" y="180" width="80" height="60" fill="#9C27B0" opacity="0.4"/>
  </g>

  <!-- Иконка корзины -->
  <g transform="translate(170, 240)">
    <rect x="0" y="10" width="60" height="40" fill="#fff" opacity="0.8" rx="4"/>
    <circle cx="15" cy="55" r="5" fill="#fff" opacity="0.8"/>
    <circle cx="45" cy="55" r="5" fill="#fff" opacity="0.8"/>
    <path d="M10 10 L15 30 L45 30 L50 10" fill="none" stroke="#9C27B0" stroke-width="2" opacity="0.8"/>
  </g>

  <text x="200" y="280" font-family="Arial, sans-serif" font-size="16" fill="#fff" text-anchor="middle" font-weight="bold">ТОРГОВАЯ ПЛОЩАДЬ</text>
</svg>
`)}`;

// Placeholder изображения для разных типов недвижимости
// Встроенные SVG - работают на ЛЮБОМ устройстве без интернета
export const getPropertyImage = (propertyType: string): string => {
  const images: Record<string, string> = {
    'Квартира': APARTMENT_SVG,
    'Дом': HOUSE_SVG,
    'Офис': OFFICE_SVG,
    'Торговая площадь': RETAIL_SVG,
    'Коммерческая': OFFICE_SVG,
  };
  return images[propertyType] || APARTMENT_SVG;
};
