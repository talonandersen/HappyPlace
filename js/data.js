/* HappyPlace content: activities, research sources, check-in questions, plate guide.
   Every activity lists its evidence strength and sources so the app stays honest. */

window.HP_SOURCES = {
  sleep: {
    cite: "Palmer et al. (2024). Sleep loss and emotion: a meta-analysis of 50+ years of experimental research. Psychological Bulletin, 150(4), 440–463.",
    url: "https://pubmed.ncbi.nlm.nih.gov/38127505/"
  },
  exercise: {
    cite: "Noetel et al. (2024). Effect of exercise for depression: systematic review and network meta-analysis of RCTs. The BMJ, 384, e075847.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10870815/"
  },
  nature: {
    cite: "White et al. (2019). Spending at least 120 minutes a week in nature is associated with good health and wellbeing. Scientific Reports, 9, 7730.",
    url: "https://doi.org/10.1038/s41598-019-44097-3"
  },
  harvard: {
    cite: "Waldinger & Schulz (2023). The Good Life: lessons from the Harvard Study of Adult Development. Summary in the Harvard Gazette.",
    url: "https://news.harvard.edu/gazette/story/2023/02/work-out-daily-ok-but-how-socially-fit-are-you/"
  },
  kindness: {
    cite: "Hui et al. (2020). Rewards of kindness? A meta-analysis of the link between prosociality and well-being (201 studies). Psychological Bulletin. APA summary.",
    url: "https://www.apa.org/news/press/releases/2020/09/doing-good-boosts-health"
  },
  kindnessExp: {
    cite: "Curry et al. (2018). Happy to help? A meta-analysis of the effects of performing acts of kindness on the well-being of the actor. J. Experimental Social Psychology.",
    url: "https://ora.ox.ac.uk/objects/uuid:4701365b-5760-4ece-a390-857a5f7b3c0c"
  },
  gratitude: {
    cite: "Meta-analyses of gratitude interventions show small but reliable well-being benefits (e.g., 25 RCTs, N = 6,745). Int. J. Applied Positive Psychology (2023).",
    url: "https://link.springer.com/article/10.1007/s41042-023-00086-6"
  },
  dosage: {
    cite: "Lyubomirsky, Sheldon & Schkade (2005). Pursuing happiness: the architecture of sustainable change. Weekly blessings beat 3×/week; kindness on one day beat spreading it out.",
    url: "https://doi.org/10.1037/1089-2680.9.2.111"
  },
  mindfulness: {
    cite: "Schumer, Lindsay & Creswell (2018). Brief mindfulness training for negative affectivity: a meta-analysis (g = .21).",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6441958/"
  },
  socialmedia: {
    cite: "Allcott, Braghieri, Eichmeyer & Gentzkow (2020). The welfare effects of social media. American Economic Review. Randomized Facebook deactivation raised well-being.",
    url: "https://www.nber.org/papers/w25514"
  },
  fit: {
    cite: "Lyubomirsky & Layous (2013). How do simple positive activities increase well-being? Current Directions in Psychological Science (person–activity fit).",
    url: "https://journals.sagepub.com/doi/abs/10.1177/0963721412469809"
  },
  variety: {
    cite: "Sheldon, Boehm & Lyubomirsky (2012). Variety is the spice of happiness: the hedonic adaptation prevention model.",
    url: "https://greatergood.berkeley.edu/images/uploads/The_Challenge_of_Staying_Happier.pdf"
  },
  bias: {
    cite: "White, Uttl & Holder (2019). Meta-analyses of positive psychology interventions: the effects are much smaller than previously reported. PLOS ONE.",
    url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0216588"
  },
  habits: {
    cite: "Lally et al. (2010). How are habits formed: modelling habit formation in the real world. European Journal of Social Psychology (median 66 days; one miss doesn't matter).",
    url: "https://doi.org/10.1002/ejsp.674"
  },
  streaks: {
    cite: "Silverman & Barasch (2023). On or off track: how (broken) streaks affect consumer decisions. Journal of Consumer Research.",
    url: "https://www.colorado.edu/business/faculty-research/2023/04/19/or-track-how-broken-streaks-affect-consumer-decisions"
  },
  who5: {
    cite: "WHO-5 Well-Being Index. © World Health Organization, licensed CC BY-NC-SA 3.0 IGO. Used here unmodified for non-commercial purposes; no WHO endorsement implied.",
    url: "https://cdn.who.int/media/docs/default-source/mental-health/who-5_english-original4da539d6ed4b49389e3afe47cda2326a.pdf"
  },
  who5review: {
    cite: "Topp et al. (2015). The WHO-5 Well-Being Index: a systematic review of the literature. Psychotherapy and Psychosomatics.",
    url: "https://karger.com/pps/article/84/3/167/282903/The-WHO-5-Well-Being-Index-A-Systematic-Review-of"
  },
  youth: {
    cite: "Tejada-Gallardo et al. (2020). Effects of school-based multicomponent positive psychology interventions on well-being and distress in adolescents: a meta-analysis.",
    url: "https://link.springer.com/article/10.1007/s10964-020-01289-9"
  },
  wandering: {
    cite: "Killingsworth & Gilbert (2010). A wandering mind is an unhappy mind. Science (≈250,000 phone mood samples).",
    url: "https://news.harvard.edu/gazette/story/2010/11/wandering-mind-not-a-happy-mind/"
  },
  plate: {
    cite: "Harvard T.H. Chan School of Public Health. The Healthy Eating Plate.",
    url: "https://nutritionsource.hsph.harvard.edu/healthy-eating-plate/"
  },
  aap: {
    cite: "Golden, Schneider & Wood (2016). Preventing obesity and eating disorders in adolescents. American Academy of Pediatrics clinical report, Pediatrics. Stanford summary.",
    url: "https://med.stanford.edu/news/all-news/2016/08/new-guidelines-offer-one-approach-to-prevent-teen-obesity-eating-disorders.html"
  },
  calorieApps: {
    cite: "Simpson & Mazzeo (2017). Calorie counting and fitness tracking technology: associations with eating disorder symptomatology. Eating Behaviors.",
    url: "https://pubmed.ncbi.nlm.nih.gov/28214452/"
  },
  paGuidelines: {
    cite: "U.S. Dept. of Health and Human Services (2018). Physical Activity Guidelines for Americans, 2nd edition (ages 3+).",
    url: "https://odphp.health.gov/our-work/physical-activity/current-guidelines/top-10-things-know"
  },
  intensity: {
    cite: "CDC / ACSM. General physical activities defined by level of intensity (METs; brisk walking 3–4.5 mph = moderate; jogging/running = vigorous). Talk test: moderate = can talk but not sing.",
    url: "https://www.cdc.gov/nccdphp/dnpa/physical/pdf/pa_intensity_table_2_1.pdf"
  },
  compendium: {
    cite: "Ainsworth et al. Compendium of Physical Activities (MET values used for calorie estimates).",
    url: "https://pacompendium.com/"
  },
  acsm: {
    cite: "American College of Sports Medicine (2009). Progression models in resistance training for healthy adults. Position stand, Med Sci Sports Exerc 41(3):687–708 (increase load ~2–10% when you can exceed target reps).",
    url: "https://pubmed.ncbi.nlm.nih.gov/19204579/"
  },
  acsmWeight: {
    cite: "Donnelly et al. / ACSM (2009). Appropriate physical activity intervention strategies for weight loss and prevention of weight regain. Med Sci Sports Exerc 41(2):459–471 (150–250 min/wk modest effect; >250 min/wk for clinically meaningful loss).",
    url: "https://pubmed.ncbi.nlm.nih.gov/19127177/"
  },
  amdr: {
    cite: "Institute of Medicine (2005). Dietary Reference Intakes for energy and macronutrients: carbs 45–65%, fat 20–35%, protein 10–35% of calories; protein RDA 0.8 g/kg.",
    url: "https://nap.nationalacademies.org/catalog/10490"
  },
  mifflin: {
    cite: "Mifflin et al. (1990). A new predictive equation for resting energy expenditure in healthy individuals. American Journal of Clinical Nutrition, 51(2), 241–247.",
    url: "https://pubmed.ncbi.nlm.nih.gov/2305711/"
  }
};

/* strength: "strong" = experimental meta-analyses; "good" = RCTs/meta-analyses with small effects;
   "basic" = sensible healthy habit, little direct happiness research. */
window.HP_ACTIVITIES = [
  // ---- Core anchors (on for everyone by default; can be turned off) ----
  { id: "sleep", core: true, emoji: "😴", label: "Got a good night's sleep", kid: "I slept well",
    target: { type: "days", perWeek: 5 }, strength: "strong", tags: ["body", "solo"],
    why: "Experiments that cut sleep consistently lower positive mood and raise anxiety. Adults: 7–9 hours. Kids and teens need more (9–12 hours for ages 6–12, 8–10 for teens).",
    sources: ["sleep"] },
  { id: "move", core: true, emoji: "🚶", label: "Moved for 20+ minutes", kid: "I played or moved my body",
    target: { type: "days", perWeek: 5 }, strength: "strong", tags: ["body", "active"],
    why: "Across 218 trials, walking, jogging, yoga and strength training reduced depression. Light activity helps; more vigorous helps more.",
    sources: ["exercise"] },
  { id: "outside", core: true, emoji: "🌳", label: "Time outside", kid: "I played outside",
    target: { type: "minutes", perWeek: 120 }, strength: "good", tags: ["body", "active", "present"],
    why: "People with at least 120 minutes a week in nature report better health and well-being. One long visit or several short ones both count. (Large survey, not an experiment.)",
    sources: ["nature"] },
  { id: "connect", core: true, emoji: "💬", label: "Had a real conversation", kid: "I talked with someone I love",
    target: { type: "days", perWeek: 5 }, strength: "strong", tags: ["social"],
    why: "The quality of close relationships is the best-replicated predictor of a happy, healthy life (Harvard 85-year study and many others).",
    sources: ["harvard"] },
  { id: "kind", core: true, emoji: "🤝", label: "Did something kind", kid: "I did something kind",
    target: { type: "days", perWeek: 3 }, strength: "good", tags: ["social", "giving"],
    why: "Meta-analyses show small, consistent happiness gains from kindness. Vary what you do; repeating the exact same act wears off.",
    sources: ["kindness", "kindnessExp", "variety"] },
  { id: "goodthings", core: true, emoji: "🌟", label: "Wrote down good things & gratitude", kid: "I thought of a good thing today",
    target: { type: "days", perWeek: 3 }, strength: "good", tags: ["reflective", "past"],
    why: "Gratitude practices give small but reliable benefits. More often isn't always better: in one study once a week beat three times a week, so pick the rhythm that feels fresh.",
    sources: ["gratitude", "dosage"] },
  { id: "screens", core: true, emoji: "📵", label: "Phone-free start and end of day", kid: "No screens at bedtime",
    target: { type: "days", perWeek: 4 }, strength: "good", tags: ["solo", "present"],
    why: "Randomized experiments found that taking a break from social media modestly improved well-being. The '30 minutes' rule itself is a rule of thumb, not a tested number.",
    sources: ["socialmedia"] },

  // ---- Menu (each person picks 2–5) ----
  { id: "quiet", emoji: "🧘", label: "5–10 minutes of quiet (breathing, prayer, meditation)", kid: "Quiet breathing time",
    target: { type: "days", perWeek: 4 }, strength: "good", tags: ["solo", "reflective", "present"],
    why: "Brief mindfulness training modestly reduces negative feelings; short daily sessions (~10 min) have helped in trials. Consistency matters more than length.",
    sources: ["mindfulness"] },
  { id: "fun", emoji: "🎉", label: "Did one thing just for fun", kid: "I did something fun",
    target: { type: "days", perWeek: 5 }, strength: "basic", tags: ["solo", "present"],
    why: "Enjoyable activities are part of every well-being model, but there's little direct research on a daily 'fun' item. Notice what actually lifts you.",
    sources: ["fit"] },
  { id: "familymeal", emoji: "🍽️", label: "Ate a meal together as a family", kid: "We ate together",
    target: { type: "days", perWeek: 4 }, strength: "good", tags: ["social", "family"],
    why: "Regular family meals are linked to healthier eating and protect kids and teens against both obesity and eating disorders (American Academy of Pediatrics).",
    sources: ["aap", "harvard"] },
  { id: "kindday", emoji: "🎁", label: "Kindness day (several kind acts in one day)", kid: "Kindness day",
    target: { type: "days", perWeek: 1 }, strength: "good", tags: ["social", "giving"],
    why: "In one experiment, doing five kind acts on a single day each week raised happiness, while spreading them across the week did not. Small study; worth trying.",
    sources: ["dosage", "kindnessExp"] },
  { id: "thanks", emoji: "💌", label: "Thanked someone (message, note or in person)", kid: "I said thank you to someone",
    target: { type: "days", perWeek: 1 }, strength: "good", tags: ["social", "past", "giving"],
    why: "Expressed gratitude interventions improve well-being in RCTs. Note: in one study a gratitude letter didn't help mildly depressed people, so skip it if it feels heavy.",
    sources: ["gratitude", "fit"] },
  { id: "savor", emoji: "☕", label: "Slowed down to savor a good moment", kid: "I enjoyed something slowly",
    target: { type: "days", perWeek: 3 }, strength: "good", tags: ["solo", "present"],
    why: "Savoring is one of the classic positive activities; people who enjoy present-focused exercises tend to stick with them and benefit more.",
    sources: ["fit"] },
  { id: "flow", emoji: "🎸", label: "Hobby or skill that absorbs me", kid: "I worked on something I love",
    target: { type: "days", perWeek: 3 }, strength: "basic", tags: ["solo", "active", "present"],
    why: "A focused mind tends to be a happier mind: in a study of 250,000 phone check-ins, mind-wandering predicted lower mood.",
    sources: ["wandering"] },
  { id: "music", emoji: "🎶", label: "Listened to or played music I love", kid: "Music time",
    target: { type: "days", perWeek: 3 }, strength: "basic", tags: ["solo", "present"],
    why: "A popular mood lifter. Direct trial evidence for happiness is limited, so treat it as a personal experiment.",
    sources: ["fit"] },
  { id: "bestself", emoji: "🔭", label: "Wrote about my best possible future", kid: null, ages: ["teen", "adult"],
    target: { type: "days", perWeek: 1 }, strength: "good", tags: ["reflective", "future", "solo"],
    why: "'Best possible self' writing is one of the most-studied positive activities. Future-focused, so it suits some people more than others.",
    sources: ["fit", "bias"] },
  { id: "strength", emoji: "🏋️", label: "Strength training", kid: null, ages: ["teen", "adult"],
    target: { type: "days", perWeek: 2 }, strength: "strong", tags: ["body", "active"],
    why: "Strength training was among the most effective exercise types for depression in the 2024 BMJ review.",
    sources: ["exercise"] },
  { id: "helphome", emoji: "🧺", label: "Helped out at home", kid: "I helped at home", ages: ["child", "teen"],
    target: { type: "days", perWeek: 3 }, strength: "good", tags: ["social", "giving", "family"],
    why: "Helping others, including family, is linked to well-being across many studies.",
    sources: ["kindness"] },
  { id: "playfriend", emoji: "🧸", label: "Played with a friend", kid: "I played with a friend", ages: ["child"],
    target: { type: "days", perWeek: 3 }, strength: "good", tags: ["social", "active"],
    why: "Good relationships matter at every age.",
    sources: ["harvard"] },
  { id: "plate", emoji: "🥗", label: "Built a balanced plate", kid: "I ate my colors",
    target: { type: "days", perWeek: 4 }, strength: "good", tags: ["body"],
    why: "Half vegetables and fruit, a quarter protein, a quarter whole grains, water to drink. Diet quality is linked to lower risk of heart disease. Track it on the Plate tab.",
    sources: ["plate"] }
];

window.HP_TAG_NAMES = {
  body: "Body", social: "With others", solo: "Solo", active: "Active", reflective: "Reflective",
  present: "Present moment", past: "Looking back", future: "Looking ahead", giving: "Giving", family: "Family"
};

/* WHO-5 (unmodified English wording). Scored 0–5 each; raw 0–25; ×4 = 0–100%. */
window.HP_WHO5 = {
  intro: "Over the last two weeks…",
  items: [
    "I have felt cheerful and in good spirits",
    "I have felt calm and relaxed",
    "I have felt active and vigorous",
    "I woke up feeling fresh and rested",
    "My daily life has been filled with things that interest me"
  ],
  options: ["At no time", "Some of the time", "Less than half of the time", "More than half of the time", "Most of the time", "All of the time"]
};

/* Healthy Eating Plate guidance per meal (Harvard T.H. Chan School of Public Health). */
window.HP_PLATE = {
  parts: [
    { id: "veg", label: "Veggies & fruit", kid: "Colors (veggies & fruit)", color: "var(--veg)", share: 0.5,
      tip: "About half the plate. Mostly vegetables, plus fruit. Aim for different colors. Potatoes don't count as a vegetable here." },
    { id: "protein", label: "Healthy protein", kid: "Protein (helps you grow strong)", color: "var(--protein)", share: 0.25,
      tip: "About a quarter. Fish, poultry, beans, nuts, eggs. Limit red meat; avoid processed meats like bacon and sausage." },
    { id: "grain", label: "Whole grains", kid: "Grains (energy)", color: "var(--grain)", share: 0.25,
      tip: "About a quarter. Whole wheat, oats, brown rice, quinoa, barley rather than white bread and white rice." },
    { id: "water", label: "Water to drink", kid: "Water", color: "var(--water)", share: 0,
      tip: "Water, tea or coffee. Skip sugary drinks. Milk/dairy 1–2 servings a day; juice a small glass." }
  ],
  meals: [
    { id: "breakfast", label: "Breakfast", emoji: "🍳",
      ideas: "Oatmeal with berries and nuts · eggs with whole-grain toast and fruit · plain yogurt with fruit and granola.",
      kidIdeas: "Oatmeal with berries · egg and toast with apple slices · yogurt with fruit." },
    { id: "lunch", label: "Lunch", emoji: "🥪",
      ideas: "Whole-grain wrap with chicken or beans and a side salad · leftover dinner · grain bowl with veggies and eggs.",
      kidIdeas: "Turkey or PB sandwich on whole-wheat bread with carrots and grapes · bean and cheese quesadilla with veggies." },
    { id: "dinner", label: "Dinner", emoji: "🍲",
      ideas: "Salmon, roasted veggies and brown rice · chili with beans and a big salad · stir-fry with tofu or chicken over whole grains.",
      kidIdeas: "Tacos with lots of toppings · spaghetti (whole-wheat) with meat sauce and a veggie · chicken, rice and broccoli." },
    { id: "snack", label: "Snacks", emoji: "🍎",
      ideas: "Pair a fruit or veggie with a protein: apple + peanut butter · carrots + hummus · a handful of nuts + an orange · yogurt.",
      kidIdeas: "Apple and peanut butter · carrots and hummus · cheese stick and grapes · yogurt." }
  ]
};
