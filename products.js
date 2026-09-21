/**
 * Каталог 20 ходовых товаров и сетевых основ MANVER
 * Автоматически синхронизировано через панель управления MANVER Admin
 */

const PRODUCTS = [
  {
    "id": 1,
    "name": "Маскировочная сеть «Хвойный лес» (Темная хвоя)",
    "category": "forest",
    "categoryName": "Лес и хвоя",
    "pricePerM2": 390,
    "shading": "80%",
    "baseType": "Капроновая нить 1.2 мм, ячейка 50х50",
    "inStockSizes": [
      "2×3 м",
      "3×5 м",
      "3×6 м",
      "4×6 м",
      "4×6 м",
      "4×6 м",
      "4×6 м",
      "4×6 м",
      "4×6 м",
      "4×6 м",
      "4×6 м",
      "4×6 м",
      "4×6 м"
    ],
    "badge": "Хит продаж",
    "badgeColor": "bg-emerald-700 text-white",
    "description": "Классическая расцветка под густой сосновый и еловый лес. Волновой рез без бликов.",
    "colorPalette": [
      "#1B3B22",
      "#2B4C27",
      "#132516"
    ],
    "imageType": "forest_dark",
    "image": "assets/images/products/upload_20260921_225317_36bf22.jpeg"
  },
  {
    "id": 2,
    "name": "Маскировочная сеть «Мох / Олива»",
    "category": "forest",
    "categoryName": "Лес и хвоя",
    "pricePerM2": 420,
    "shading": "85%",
    "baseType": "Полиамидная основа 1.4 мм, ячейка 50х50",
    "inStockSizes": [
      "2×3 м",
      "3×3 м",
      "3×6 м",
      "6×8 м",
      "Под заказ"
    ],
    "badge": "Для СВО и охоты",
    "badgeColor": "bg-amber-800 text-white",
    "description": "Универсальный зеленый паттерн средней полосы РФ. Отлично сливается с подлеском и кустарником.",
    "colorPalette": [
      "#48532B",
      "#353F1F",
      "#626B38"
    ],
    "imageType": "moss_olive",
    "image": "assets/images/products/upload_20260921_225319_2bddae.jpeg"
  },
  {
    "id": 3,
    "name": "Маскировочная сеть «Мультикам (Multicam)»",
    "category": "tactical",
    "categoryName": "Тактические и камо",
    "pricePerM2": 450,
    "shading": "85%",
    "baseType": "Полиамид 1.4 мм + окантовка 6 мм",
    "inStockSizes": [
      "2×3 м",
      "3×5 м",
      "4×6 м",
      "6×9 м",
      "Под заказ"
    ],
    "badge": "Армейский стандарт",
    "badgeColor": "bg-stone-800 text-white",
    "description": "Многозональный камуфляж: градиенты зелени, оливы, хаки и светло-коричневого. Не демаскирует с воздуха.",
    "colorPalette": [
      "#796E50",
      "#4A5237",
      "#9E906E",
      "#302E24"
    ],
    "imageType": "multicam",
    "image": "assets/images/products/upload_20260921_225439_61cc5e.jpeg"
  },
  {
    "id": 4,
    "name": "Маскировочная сеть «Пиксель / ЕМР Лето»",
    "category": "tactical",
    "categoryName": "Тактические и камо",
    "pricePerM2": 440,
    "shading": "85%",
    "baseType": "Капрон 1.4 мм, ячейка 50х50 мм",
    "inStockSizes": [
      "3×3 м",
      "3×6 м",
      "4×6 м",
      "Под заказ"
    ],
    "badge": "По стандарту МО",
    "badgeColor": "bg-emerald-900 text-white",
    "description": "Уставной цифровой камуфляж для укрытия техники, блиндажей и полевых позиций.",
    "colorPalette": [
      "#233B23",
      "#3C4B27",
      "#1A2514"
    ],
    "imageType": "pixel_emr",
    "image": "assets/images/products/upload_20260921_225443_b14452.jpeg"
  },
  {
    "id": 5,
    "name": "Маскировочная сеть «Сухая трава / Сухостой»",
    "category": "steppe",
    "categoryName": "Степь и осень",
    "pricePerM2": 410,
    "shading": "80%",
    "baseType": "Капроновая нить 1.2 мм",
    "inStockSizes": [
      "2×3 м",
      "3×5 м",
      "3×6 м",
      "Под заказ"
    ],
    "badge": "В наличии",
    "badgeColor": "bg-amber-600 text-white",
    "description": "Идеально для открытых полей, пожухлой травы, камышовых зарослей и позднеосеннего ландшафта.",
    "colorPalette": [
      "#A59263",
      "#BFAC7D",
      "#796940"
    ],
    "imageType": "dry_grass",
    "image": "assets/images/products/prod_dry_grass.jpg"
  },
  {
    "id": 6,
    "name": "Маскировочная сеть «Грязь / Чернозем / Окоп»",
    "category": "steppe",
    "categoryName": "Степь и осень",
    "pricePerM2": 420,
    "shading": "85%",
    "baseType": "Усиленная основа 1.4 мм",
    "inStockSizes": [
      "3×5 м",
      "3×6 м",
      "4×6 м",
      "6×8 м",
      "Под заказ"
    ],
    "badge": "Спецзаказ",
    "badgeColor": "bg-stone-700 text-white",
    "description": "Смешанный темный земляной тон: коричневый, хаки, темно-серый. Разработан для фортификаций и сырого грунта.",
    "colorPalette": [
      "#3D342A",
      "#4B4336",
      "#29241E"
    ],
    "imageType": "mud_trench",
    "image": "assets/images/products/prod_forest_dark.jpg"
  },
  {
    "id": 7,
    "name": "Маскировочная сеть «Степь / Пустыня / Песок»",
    "category": "steppe",
    "categoryName": "Степь и осень",
    "pricePerM2": 390,
    "shading": "75%",
    "baseType": "Полиамидная дель 1.2 мм",
    "inStockSizes": [
      "2×3 м",
      "3×6 м",
      "4×8 м",
      "Под заказ"
    ],
    "badge": "В наличии",
    "badgeColor": "bg-amber-700 text-white",
    "description": "Песчано-бежевые тона для песчаных карьеров, глинистых почв, пляжных навесов и южных регионов.",
    "colorPalette": [
      "#D4C49E",
      "#B8A57A",
      "#E4D7B5"
    ],
    "imageType": "desert_sand",
    "image": "assets/images/products/prod_forest_dark.jpg"
  },
  {
    "id": 8,
    "name": "Маскировочная сеть «Камыш / Болото»",
    "category": "steppe",
    "categoryName": "Степь и осень",
    "pricePerM2": 430,
    "shading": "80%",
    "baseType": "Капрон 1.2 мм с пропиткой",
    "inStockSizes": [
      "2×3 м",
      "3×4 м",
      "3×6 м",
      "Под заказ"
    ],
    "badge": "Для охотников",
    "badgeColor": "bg-yellow-800 text-white",
    "description": "Специализированная сеть для маскировки лодок, скрадков и засидок на водоплавающую дичь.",
    "colorPalette": [
      "#7D734E",
      "#5B5A33",
      "#A89B6E"
    ],
    "imageType": "reed_swamp",
    "image": "assets/images/products/prod_forest_dark.jpg"
  },
  {
    "id": 9,
    "name": "Маскировочная сеть «Зима / Чистый снег»",
    "category": "winter",
    "categoryName": "Зимние сети",
    "pricePerM2": 430,
    "shading": "80%",
    "baseType": "Белая полиамидная основа 1.4 мм",
    "inStockSizes": [
      "3×5 м",
      "3×6 м",
      "4×6 м",
      "6×9 м",
      "Под заказ"
    ],
    "badge": "Сезонный хит",
    "badgeColor": "bg-sky-700 text-white",
    "description": "Белоснежное полотно с мягкими серыми тенями. Не желтеет на морозе и не твердеет при -45°C.",
    "colorPalette": [
      "#F4F7F6",
      "#DEE5E5",
      "#CBD5D7"
    ],
    "imageType": "winter_snow",
    "image": "assets/images/products/prod_winter_snow.jpg"
  },
  {
    "id": 10,
    "name": "Маскировочная сеть «Зимний лес / Оттепель»",
    "category": "winter",
    "categoryName": "Зимние сети",
    "pricePerM2": 440,
    "shading": "85%",
    "baseType": "Капрон 1.4 мм, ячейка 50х50 мм",
    "inStockSizes": [
      "3×5 м",
      "3×6 м",
      "4×6 м",
      "Под заказ"
    ],
    "badge": "В наличии",
    "badgeColor": "bg-slate-700 text-white",
    "description": "Пятнистая черно-бело-серая гамма для заснеженного леса со стволами деревьев и проталинами.",
    "colorPalette": [
      "#FFFFFF",
      "#2F3337",
      "#8C9297"
    ],
    "imageType": "winter_forest",
    "image": "assets/images/products/prod_winter_forest.jpg"
  },
  {
    "id": 11,
    "name": "Маскировочная сеть «Дубовый лес 3D» (Объемная листва)",
    "category": "forest",
    "categoryName": "Лес и хвоя",
    "pricePerM2": 470,
    "shading": "90%",
    "baseType": "Усиленный полиамид 1.8 мм",
    "inStockSizes": [
      "2×3 м",
      "3×6 м",
      "4×6 м",
      "Под заказ"
    ],
    "badge": "Максимальное затенение",
    "badgeColor": "bg-emerald-800 text-white",
    "description": "3D-перфорация с эффектом живой колышущейся листвы. Идеальна для навесов, беседок и глухой маскировки.",
    "colorPalette": [
      "#243C1D",
      "#3B5829",
      "#1D2817"
    ],
    "imageType": "oak_3d",
    "image": "assets/images/products/prod_forest_dark.jpg"
  },
  {
    "id": 12,
    "name": "Сеть для забора и беседки «Комфорт 85%» (Хаки/Олива)",
    "category": "forest",
    "categoryName": "Лес и хвоя",
    "pricePerM2": 380,
    "shading": "85%",
    "baseType": "Капроновая сетка + шнур по периметру",
    "inStockSizes": [
      "1.5×5 м",
      "2×5 м",
      "2×10 м",
      "2×15 м",
      "Под заказ"
    ],
    "badge": "Для дачи и забора",
    "badgeColor": "bg-teal-700 text-white",
    "description": "Специальные размеры под стандартные секции заборов (рабица, 3D-сетка, профнастил). Защита от чужих глаз.",
    "colorPalette": [
      "#334D2E",
      "#48623D",
      "#22351E"
    ],
    "imageType": "fence_shade",
    "image": "assets/images/products/prod_forest_dark.jpg"
  },
  {
    "id": 13,
    "name": "Сеть для террасы и навеса «Песочный беж 80%»",
    "category": "steppe",
    "categoryName": "Степь и осень",
    "pricePerM2": 390,
    "shading": "80%",
    "baseType": "Светлая полиамидная основа 1.2 мм",
    "inStockSizes": [
      "2×3 м",
      "3×4 м",
      "3×5 м",
      "4×6 м",
      "Под заказ"
    ],
    "badge": "Уютный теневой навес",
    "badgeColor": "bg-amber-700 text-white",
    "description": "Мягкий рассеянный солнечный свет, не нагревается на палящем солнце, не шумит на ветру.",
    "colorPalette": [
      "#DFD3B6",
      "#C4B48F",
      "#ECE3CB"
    ],
    "imageType": "terrace_beige",
    "image": "assets/images/products/prod_forest_dark.jpg"
  },
  {
    "id": 14,
    "name": "Промышленная маскировочная сеть «Ангар / Склад»",
    "category": "tactical",
    "categoryName": "Тактические и камо",
    "pricePerM2": 370,
    "shading": "75%",
    "baseType": "Полиамидный каркас с шагом 50 мм",
    "inStockSizes": [
      "6×9 м",
      "9×12 м",
      "12×18 м",
      "Любой размер"
    ],
    "badge": "Крупный опт",
    "badgeColor": "bg-zinc-800 text-white",
    "description": "Большие форматы полотен для укрытия производственных территорий, спецтехники, стройплощадок и складов.",
    "colorPalette": [
      "#2E3D2F",
      "#3B4738",
      "#4A5245"
    ],
    "imageType": "industrial_large",
    "image": "assets/images/products/prod_forest_dark.jpg"
  },
  {
    "id": 15,
    "name": "Маскировочная сеть «Тайга Heavy Duty» (Шнур 6 мм)",
    "category": "forest",
    "categoryName": "Лес и хвоя",
    "pricePerM2": 480,
    "shading": "85%",
    "baseType": "Капрон 1.8 мм, шнур 6 мм, усиленные петли",
    "inStockSizes": [
      "3×6 м",
      "4×6 м",
      "6×6 м",
      "Под заказ"
    ],
    "badge": "Экстра-прочность",
    "badgeColor": "bg-green-900 text-white",
    "description": "Сеть с двойной прошивкой и силовой окантовкой для жестких условий эксплуатации и сильных ветров.",
    "colorPalette": [
      "#1F331A",
      "#2E4726",
      "#142111"
    ],
    "imageType": "taiga_heavy",
    "image": "assets/images/products/prod_forest_dark.jpg"
  },
  {
    "id": 16,
    "name": "Двусторонняя маскировочная сеть «Лес / Степь 2-в-1»",
    "category": "tactical",
    "categoryName": "Тактические и камо",
    "pricePerM2": 520,
    "shading": "90%",
    "baseType": "Двусторонняя сшивка на полиамидной основе",
    "inStockSizes": [
      "3×5 м",
      "3×6 м",
      "4×6 м",
      "Под заказ"
    ],
    "badge": "2 расцветки в одной",
    "badgeColor": "bg-orange-800 text-white",
    "description": "Одна сторона зеленая (хвоя/мох), вторая сторона сухая трава/песок. Достаточно перевернуть полотно при смене сезона.",
    "colorPalette": [
      "#2A4222",
      "#9E8C5B",
      "#394E2F",
      "#BAA776"
    ],
    "imageType": "double_sided",
    "image": "assets/images/products/prod_forest_dark.jpg"
  },
  {
    "id": 17,
    "name": "Антибликовая матовая сеть «Спецназ Матт»",
    "category": "tactical",
    "categoryName": "Тактические и камо",
    "pricePerM2": 540,
    "shading": "90%",
    "baseType": "Полиамид 1.8 мм, черный матовый шнур",
    "inStockSizes": [
      "2×3 м",
      "3×6 м",
      "4×6 м",
      "Под заказ"
    ],
    "badge": "Не шуршит, без блика",
    "badgeColor": "bg-neutral-900 text-white",
    "description": "Специальная пропитка против солнечных бликов и ИК-отражения. Повышенная стойкость к истиранию.",
    "colorPalette": [
      "#232822",
      "#31382F",
      "#1A1D19"
    ],
    "imageType": "specnaz_matte",
    "image": "assets/images/products/prod_forest_dark.jpg"
  },
  {
    "id": 18,
    "name": "Основа капроновая узловая 50×50 мм (нить 1.2 мм)",
    "category": "bases",
    "categoryName": "Основы для сетей",
    "pricePerM2": 120,
    "shading": "Основа",
    "baseType": "100% полиамид, разрыв 45 кгс",
    "inStockSizes": [
      "Рулон 3×50 м",
      "Рулон 6×50 м",
      "На отрез от 10 м²"
    ],
    "badge": "Для плетения",
    "badgeColor": "bg-blue-800 text-white",
    "description": "Сетеполотно (дель) для плетения маскировочных сетей волонтерами, цехами и мастерскими. Зеленый или хаки цвет.",
    "colorPalette": [
      "#2D5237",
      "#1E3B26"
    ],
    "imageType": "base_light",
    "image": "assets/images/products/prod_forest_dark.jpg"
  },
  {
    "id": 19,
    "name": "Основа полиамидная усиленная 50×50 мм (нить 1.8 мм)",
    "category": "bases",
    "categoryName": "Основы для сетей",
    "pricePerM2": 160,
    "shading": "Основа",
    "baseType": "Высокопрочный капрон, разрыв 75 кгс",
    "inStockSizes": [
      "Рулон 3×50 м",
      "3×25 м",
      "На отрез под ваш размер"
    ],
    "badge": "Усиленная нить",
    "badgeColor": "bg-indigo-800 text-white",
    "description": "Сверхпрочная основа, устойчивая к зацепам, ветровым нагрузкам и морозу. Не гниет в сырости.",
    "colorPalette": [
      "#1B3C27",
      "#112417"
    ],
    "imageType": "base_heavy",
    "image": "assets/images/products/prod_base_heavy.jpg"
  },
  {
    "id": 20,
    "name": "Сетевой каркас окантованный (шнур 5-6 мм + петли)",
    "category": "bases",
    "categoryName": "Основы для сетей",
    "pricePerM2": 210,
    "shading": "Основа с окантовкой",
    "baseType": "Полиамид 1.4 мм + шнур по периметру с петлями",
    "inStockSizes": [
      "3×6 м",
      "4×6 м",
      "6×8 м",
      "Любой размер под ключ"
    ],
    "badge": "Готовый каркас",
    "badgeColor": "bg-purple-800 text-white",
    "description": "Полностью готовая к оплетению основа с прошитым силовым шнуром по всему периметру и петлями через каждые 50 см.",
    "colorPalette": [
      "#1E472A",
      "#2B633D"
    ],
    "imageType": "base_framed",
    "image": "assets/images/products/prod_forest_dark.jpg"
  }
];

window.MANVER_PRODUCTS = PRODUCTS;
