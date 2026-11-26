/* ==========================================================================
   MBP Nutrition — Product Catalog, Recipes & Customer Reviews Data
   ========================================================================== */

window.MBP_DATA = {
  products: [
    {
      id: "whey-protein-isolate",
      name: "MBP Whey Protein Isolate",
      shortName: "Whey Protein Isolate",
      category: "Proteins",
      badge: "Bestseller",
      badgeStyle: "orange",
      image: "images/product-whey-isolate.jpg",
      benefit: "Ultra-filtered 90% isolate for rapid muscle recovery with zero bloating.",
      description:
        "Cold-processed whey protein isolate crafted for athletes and busy professionals who refuse hidden gums, soy fillers, or added sugars. Delivers 25g fast-absorbing complete protein and 5.5g naturally occurring BCAAs per 30g scoop.",
      highlights: ["25g Protein / scoop", "0g Added Sugar", "5.5g BCAAs", "Fast Absorption"],
      nutrition: [
        { label: "Protein", value: "25g" },
        { label: "Sugar", value: "0g" },
        { label: "Calories", value: "118 kcal" }
      ],
      ingredients: "Cold-Filtered Whey Protein Isolate (90%), Natural Cocoa / Vanilla Bean Extract, Sunflower Lecithin, Digestive Enzyme Blend (Papain & Bromelain), Monk Fruit Extract.",
      certifications: "FSSAI Certified • ISO-22000 GMP • Eurofins Heavy-Metal & Amino-Profile Tested",
      variants: [
        { label: "Rich Chocolate • 1 kg", price: 2499, compareAt: 2899, servings: "33 Servings" },
        { label: "Vanilla • 1 kg", price: 2499, compareAt: 2899, servings: "33 Servings" },
        { label: "Rich Chocolate • 2 kg", price: 4599, compareAt: 5399, servings: "66 Servings" },
        { label: "Vanilla • 2 kg", price: 4599, compareAt: 5399, servings: "66 Servings" }
      ],
      reviews: [
        {
          id: "rev-w1",
          author: "Aarav Deshmukh",
          role: "University Track Sprinter, 22",
          rating: 5,
          date: "2026-10-18",
          result: "+12% faster post-sprint recovery",
          comment: "Mixes cleanly in 10 seconds with cold water and zero foam. Best part is zero stomach heaviness before my evening classes."
        },
        {
          id: "rev-w2",
          author: "Neha Kulkarni",
          role: "Product Manager & Marathoner, 28",
          rating: 5,
          date: "2026-11-02",
          result: "Hits 100g daily protein effortlessly",
          comment: "Rich Chocolate tastes like real dark cocoa without that artificial sucralose aftertaste. My daily post-run staple."
        },
        {
          id: "rev-w3",
          author: "Rohan Verma",
          role: "Strength Athlete, 24",
          rating: 5,
          date: "2026-11-11",
          result: "Lean strength gain over 8 weeks",
          comment: "Having third-party batch COA transparency gave me confidence to switch. Vanilla blends unbelievably well in oats too."
        }
      ]
    },
    {
      id: "micronized-creatine",
      name: "MBP Micronized Creatine Monohydrate",
      shortName: "Micronized Creatine",
      category: "Performance",
      badge: "Pure 200-Mesh",
      badgeStyle: "emerald",
      image: "images/product-creatine.svg",
      benefit: "Pharmaceutical-grade 200-mesh creatine for explosive strength and mental clarity.",
      description:
        "100% pure, unflavored 200-mesh micronized creatine monohydrate engineered for instant solubility with zero gritty residue. Supports ATP regeneration during heavy lifts, sprints, and high-focus workdays.",
      highlights: ["3g Pure Creatine", "0g Sugar", "200-Mesh Micronized", "100% Lab Tested"],
      nutrition: [
        { label: "Creatine", value: "3000mg" },
        { label: "Sugar", value: "0g" },
        { label: "Calories", value: "0 kcal" }
      ],
      ingredients: "100% Pure Micronized Creatine Monohydrate (200-Mesh). Zero anti-caking fillers, zero dyes, zero flavorings.",
      certifications: "FSSAI Certified • GMP Facility • Purity HPLC Verified 99.9%",
      variants: [
        { label: "Unflavored • 300g", price: 999, compareAt: 1249, servings: "100 Servings" },
        { label: "Unflavored • 500g", price: 1499, compareAt: 1899, servings: "166 Servings" }
      ],
      reviews: [
        {
          id: "rev-c1",
          author: "Kabir Malhotra",
          role: "Powerlifter & FinTech Analyst, 26",
          rating: 5,
          date: "2026-10-29",
          result: "+15 kg on squat working sets in 6 weeks",
          comment: "Finally a creatine that actually dissolves completely in my morning pre-workout slush without settling at the bottom."
        },
        {
          id: "rev-c2",
          author: "Siddharth Nair",
          role: "CrossFit Competitor, 23",
          rating: 5,
          date: "2026-11-08",
          result: "Sustained energy across double sessions",
          comment: "Zero bloating, super fine powder, and 100 servings in the 300g tub makes it unmatched value."
        }
      ]
    },
    {
      id: "organic-plant-protein",
      name: "MBP Organic Plant Protein",
      shortName: "Organic Plant Protein",
      category: "Proteins",
      badge: "100% Vegan",
      badgeStyle: "emerald",
      image: "images/product-plant-protein.svg",
      benefit: "Smooth Pea & Brown Rice blend in Cafe Mocha — dairy-free, gut-friendly fuel.",
      description:
        "Complete amino-acid plant protein combining organic yellow pea isolate and sprouted brown rice protein in a barista-inspired Cafe Mocha profile. Sweetened cleanly with monk fruit and fortified with digestive enzymes.",
      highlights: ["24g Plant Protein", "0g Sugar", "Pea & Brown Rice", "Gut-Friendly"],
      nutrition: [
        { label: "Protein", value: "24g" },
        { label: "Sugar", value: "0g" },
        { label: "Calories", value: "125 kcal" }
      ],
      ingredients: "Organic Yellow Pea Protein Isolate, Sprouted Brown Rice Protein, Arabica Coffee Extract, Organic Cocoa, Prebiotic Chicory Fiber, Monk Fruit Extract, Digestive Enzymes.",
      certifications: "FSSAI Certified • Vegan & Soy-Free • GMP Certified Batch Tested",
      variants: [
        { label: "Cafe Mocha • 1 kg", price: 2199, compareAt: 2599, servings: "30 Servings" },
        { label: "Cafe Mocha • 500g", price: 1199, compareAt: 1399, servings: "15 Servings" }
      ],
      reviews: [
        {
          id: "rev-p1",
          author: "Ananya Iyer",
          role: "UX Designer & Pilates Athlete, 27",
          rating: 5,
          date: "2026-10-22",
          result: "Replaced 4pm sugary iced coffee",
          comment: "Most vegan proteins taste chalky. Cafe Mocha tastes like a clean iced mocha and keeps me full through back-to-back design sprints."
        },
        {
          id: "rev-p2",
          author: "Devika Menon",
          role: "Endurance Cyclist, 25",
          rating: 5,
          date: "2026-11-14",
          result: "Zero dairy bloating after 60km rides",
          comment: "Super smooth texture in oat milk and cold brew. My stomach loves this formula."
        }
      ]
    },
    {
      id: "monk-fruit-sweetener",
      name: "MBP Zero-Calorie Monk Fruit Sweetener",
      shortName: "Monk Fruit Sweetener",
      category: "Healthy Sweeteners",
      badge: "Zero Glycemic",
      badgeStyle: "dark",
      image: "images/product-monk-fruit.jpg",
      benefit: "Natural Luo Han Guo sweetness with zero calories, zero sugar spikes, and no bitter finish.",
      description:
        "Clean 1:1 culinary sugar alternative crafted from pure monk fruit extract. Available in a travel-ready 250g resealable pouch for oats and baking, or concentrated liquid drops for coffee, smoothies, and tea.",
      highlights: ["0 kcal / serving", "0g Sugar", "Zero Glycemic Impact", "Clean Ingredients"],
      nutrition: [
        { label: "Calories", value: "0 kcal" },
        { label: "Sugar", value: "0g" },
        { label: "Net Carbs", value: "0g" }
      ],
      ingredients: "Pouch: Pure Monk Fruit Extract (Mogroside V) & Non-GMO Erythritol (1:1 measure). Drops: Purified Water, Pure Monk Fruit Extract.",
      certifications: "FSSAI Certified • Keto & Diabetic Friendly • Zero Aspartame / Sucralose",
      variants: [
        { label: "250g Pouch", price: 549, compareAt: 649, servings: "125 Servings" },
        { label: "50ml Liquid Drops", price: 499, compareAt: 599, servings: "200 Servings" },
        { label: "Pouch + Drops Combo", price: 949, compareAt: 1149, servings: "325 Servings" }
      ],
      reviews: [
        {
          id: "rev-m1",
          author: "Priya Sharma",
          role: "Management Consultant, 29",
          rating: 5,
          date: "2026-10-15",
          result: "Cut 180g added sugar per week",
          comment: "The liquid drops live in my laptop bag. Two drops in black coffee or overnight oats gives clean sweetness without any metallic aftertaste."
        },
        {
          id: "rev-m2",
          author: "Vikramaditya Rao",
          role: "Physique Coach, 26",
          rating: 5,
          date: "2026-11-05",
          result: "Contest-prep cravings solved",
          comment: "The 250g pouch bakes and dissolves like real sugar. Game changer for protein oats."
        }
      ]
    },
    {
      id: "daily-multivitamin-electrolytes",
      name: "MBP Daily Multivitamin & Electrolytes",
      shortName: "Multivitamin & Electrolytes",
      category: "Performance",
      badge: "Focus + Hydration",
      badgeStyle: "orange",
      image: "images/product-multivitamin.jpg",
      benefit: "23 bioavailable micronutrients + cellular electrolytes for all-day focus and cramp-free training.",
      description:
        "Dual-action daily foundation built for high-output schedules. Combines chelated B-vitamins, Vitamin D3+K2, Zinc, and Ashwagandha with balanced Sodium, Potassium, and Magnesium Citrate for hydration without sugar.",
      highlights: ["23 Vitamins & Minerals", "850mg Electrolytes", "0g Sugar", "Fast Absorption"],
      nutrition: [
        { label: "Electrolytes", value: "850mg" },
        { label: "Vitamins", value: "23 Active" },
        { label: "Sugar", value: "0g" }
      ],
      ingredients: "Chelated Magnesium Citrate, Potassium Chloride, Himalayan Pink Salt, Vitamins A, C, D3, E, K2, B-Complex (Methylated), Zinc Bisglycinate, KSM-66 Ashwagandha.",
      certifications: "FSSAI Certified • GMP & Heavy-Metal Screened • Vegetarian Capsules",
      variants: [
        { label: "60 Caps • 30-Day Pack", price: 799, compareAt: 999, servings: "30 Servings" },
        { label: "120 Caps • 60-Day Pack", price: 1449, compareAt: 1849, servings: "60 Servings" }
      ],
      reviews: [
        {
          id: "rev-d1",
          author: "Arjun Kapoor",
          role: "Startup Founder & Tennis Player, 30",
          rating: 5,
          date: "2026-11-01",
          result: "Eliminated afternoon brain fog",
          comment: "Morning tennis at 6am followed by 10 hours of meetings used to drain me. Hydration and energy feel steady till evening."
        },
        {
          id: "rev-d2",
          author: "Meera Krishnan",
          role: "Half-Marathon Runner, 24",
          rating: 5,
          date: "2026-11-12",
          result: "Zero leg cramps on humid long runs",
          comment: "Clean ingredient list with methylated B vitamins. Gentle even on an empty stomach."
        }
      ]
    }
  ],

  recipes: [
    {
      id: "chocolate-pb-shake",
      title: "Post-Workout Chocolate Peanut Butter Protein Shake",
      featured: true,
      prepTime: "5 mins",
      image: "images/recipe-pb-shake.jpg",
      macros: { protein: "34g", carbs: "18g", calories: "310 kcal" },
      summary: "Velvety recovery shake delivering fast-absorbing whey isolate, natural electrolytes from banana, and healthy fats.",
      productsUsed: [
        { id: "whey-protein-isolate", label: "MBP Whey Protein Isolate (Rich Chocolate)" }
      ],
      ingredients: [
        "1 scoop (30g) MBP Whey Protein Isolate — Rich Chocolate",
        "1 tbsp natural unsweetened peanut butter",
        "1/2 frozen banana",
        "250ml chilled almond milk or skim milk",
        "4–5 ice cubes + pinch of sea salt"
      ],
      steps: [
        "Pour 250ml chilled milk into a high-speed blender first so powder doesn't stick.",
        "Add 1 scoop MBP Whey Protein Isolate (Rich Chocolate), peanut butter, frozen banana, and ice.",
        "Blend for 25–30 seconds until creamy and frothy.",
        "Pour into a chilled glass, dust with cacao nibs if desired, and enjoy within 30 minutes post-training."
      ]
    },
    {
      id: "iced-mocha-latte",
      title: "Guilt-Free Iced Mocha Protein Latte",
      featured: true,
      prepTime: "4 mins",
      image: "images/recipe-iced-mocha.svg",
      macros: { protein: "25g", carbs: "6g", calories: "145 kcal" },
      summary: "Your 9am café mocha upgraded with 24g vegan protein and zero refined sugar for sustained desk focus.",
      productsUsed: [
        { id: "organic-plant-protein", label: "MBP Organic Plant Protein (Cafe Mocha)" },
        { id: "monk-fruit-sweetener", label: "MBP Monk Fruit Sweetener (Drops or Pouch)" }
      ],
      ingredients: [
        "1 scoop MBP Organic Plant Protein — Cafe Mocha",
        "2–3 drops (or 1/2 tsp) MBP Zero-Calorie Monk Fruit Sweetener",
        "1 shot freshly pulled espresso (or 1 tsp instant coffee in 40ml water)",
        "220ml cold oat milk or soy milk",
        "Handful of ice cubes"
      ],
      steps: [
        "Whisk or shake MBP Organic Plant Protein with cold milk and MBP Monk Fruit Sweetener for 15 seconds until silky.",
        "Fill a tall glass with ice cubes and pour in the chilled protein milk.",
        "Slowly pour the espresso shot over the top for a layered café-style swirl.",
        "Stir and sip immediately — zero sugar crash during morning standups."
      ]
    },
    {
      id: "no-bake-energy-oats",
      title: "No-Bake High-Protein Energy Oats",
      featured: true,
      prepTime: "5 mins",
      image: "images/recipe-energy-oats.jpg",
      macros: { protein: "29g", carbs: "34g", calories: "340 kcal" },
      summary: "Creamy grab-and-go power bowl made in 5 minutes — ideal before early workouts or busy commutes.",
      productsUsed: [
        { id: "whey-protein-isolate", label: "MBP Whey Protein Isolate (Vanilla or Chocolate)" },
        { id: "monk-fruit-sweetener", label: "MBP Monk Fruit Sweetener (250g Pouch)" }
      ],
      ingredients: [
        "1/2 cup (45g) rolled oats",
        "1 scoop MBP Whey Protein Isolate (Vanilla or Rich Chocolate)",
        "1 tsp MBP Zero-Calorie Monk Fruit Sweetener",
        "1 tbsp chia seeds + 150ml milk or Greek yogurt",
        "Toppings: sliced banana & crushed almonds"
      ],
      steps: [
        "In a bowl or mason jar, stir together rolled oats, chia seeds, and MBP Monk Fruit Sweetener.",
        "Whisk MBP Whey Protein Isolate into cold milk until smooth, then pour over the oat mixture.",
        "Stir thoroughly for 30 seconds until thickened into a pudding-like consistency (or chill overnight).",
        "Top with sliced banana and almonds and eat right away or pack for the office."
      ]
    },
    {
      id: "berry-creatine-slush",
      title: "Pre-Workout Berry Creatine Slush",
      featured: false,
      prepTime: "3 mins",
      image: "images/recipe-berry-slush.svg",
      macros: { protein: "1g", carbs: "14g", calories: "65 kcal" },
      summary: "Icy antioxidant pre-session slush delivering 3g micronized creatine with zero artificial pre-workout jitters.",
      productsUsed: [
        { id: "micronized-creatine", label: "MBP Micronized Creatine Monohydrate (300g)" }
      ],
      ingredients: [
        "1 scoop (3g) MBP Micronized Creatine Monohydrate (Unflavored)",
        "3/4 cup frozen mixed berries (blueberries & raspberries)",
        "200ml chilled coconut water",
        "1 tsp fresh lemon juice + 4 ice cubes",
        "Fresh mint sprig for garnish"
      ],
      steps: [
        "Add frozen berries, chilled coconut water, lemon juice, and ice cubes to a blender.",
        "Add 1 scoop (3g) MBP Micronized Creatine Monohydrate.",
        "Blend on high for 20 seconds until an icy, vibrant slush forms.",
        "Serve immediately 20–30 minutes before your workout for clean cellular energy and hydration."
      ]
    }
  ],

  featuredTestimonials: [
    {
      name: "Aarav Deshmukh",
      role: "University Track Sprinter",
      product: "MBP Whey Protein Isolate",
      productId: "whey-protein-isolate",
      result: "Faster sprint recovery & +2.5kg lean muscle in 10 weeks",
      rating: 5,
      quote: "Cleanest whey I have used. Zero bloating before evening track drills, and knowing every batch is lab tested makes it an easy daily choice."
    },
    {
      name: "Ananya Iyer",
      role: "Senior UX Designer",
      product: "MBP Organic Plant Protein",
      productId: "organic-plant-protein",
      result: "Replaced sugary café lattes & hit 90g protein daily",
      rating: 5,
      quote: "The Cafe Mocha Plant Protein mixed with cold oat milk is my 9am ritual. It keeps me sharp through back-to-back sprint reviews without any afternoon slump."
    },
    {
      name: "Kabir Malhotra",
      role: "FinTech Analyst & Powerlifter",
      product: "MBP Micronized Creatine",
      productId: "micronized-creatine",
      result: "+15 kg squat progression in 6 weeks",
      rating: 5,
      quote: "Dissolves instantly in cold berry water with zero grit. My strength numbers and late-evening mental stamina jumped noticeably."
    },
    {
      name: "Priya Sharma",
      role: "Strategy Consultant",
      product: "MBP Monk Fruit Sweetener",
      productId: "monk-fruit-sweetener",
      result: "Eliminated 180g refined sugar weekly",
      rating: 5,
      quote: "Zero glycemic spike and no artificial stevia aftertaste. I carry the Monk Fruit Drops on every work trip."
    },
    {
      name: "Arjun Kapoor",
      role: "Tech Founder & Club Tennis Player",
      product: "MBP Multivitamin & Electrolytes",
      productId: "daily-multivitamin-electrolytes",
      result: "Cramp-free 6am matches & steady workday focus",
      rating: 5,
      quote: "Having methylated vitamins alongside sodium, potassium, and magnesium in one clean protocol simplified my entire morning stack."
    },
    {
      name: "Neha Kulkarni",
      role: "Product Manager & Marathoner",
      product: "MBP Whey Protein Isolate",
      productId: "whey-protein-isolate",
      result: "3:42 marathon PB with zero GI distress",
      rating: 5,
      quote: "During peak 60km/week training blocks, digestion is everything. MBP Isolate recovers my legs fast without feeling heavy."
    }
  ]
};
