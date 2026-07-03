/**
 * URLs índice de KidsHealth por categoría y tema.
 * Claves deben coincidir con translations.js → featuredTopics.categories.*.topics
 */
const CATEGORY_URLS = {
  es: {
    parents: {
      generalHealth: 'https://kidshealth.org/es/parents/general/',
      growthDevelopment: 'https://kidshealth.org/es/parents/growth/',
      infections: 'https://kidshealth.org/es/parents/infections/',
      diseasesConditions: 'https://kidshealth.org/es/parents/medical/',
      pregnancyBaby: 'https://kidshealth.org/es/parents/pregnancy-newborn/',
      nutritionExercise: 'https://kidshealth.org/es/parents/nutrition-center/',
      emotionsBehavior: 'https://kidshealth.org/es/parents/emotions/',
      schoolFamily: 'https://kidshealth.org/es/parents/positive/',
      firstAidSafety: 'https://kidshealth.org/es/parents/firstaid-safe/',
      doctorsHospitals: 'https://kidshealth.org/es/parents/system/',
      playLearn: 'https://kidshealth.org/es/parents/play-learn-center/',
    },
    children: {
      body: 'https://kidshealth.org/es/kids/htbw/',
      pubertyGrowth: 'https://kidshealth.org/es/kids/grow/',
      stayHealthy: 'https://kidshealth.org/es/kids/stay-healthy/',
      staySafe: 'https://kidshealth.org/es/kids/watch/',
      healthProblems: 'https://kidshealth.org/es/kids/health-problems/',
      illnessesInjuries: 'https://kidshealth.org/es/kids/ill-injure/',
      relaxUnwindCenter: 'https://kidshealth.org/es/kids/stress-center/',
      helpfulPeople: 'https://kidshealth.org/es/kids/feel-better/',
      feelings: 'https://kidshealth.org/es/kids/feeling/',
      questionsAnswers: 'https://kidshealth.org/es/kids/talk/',
    },
    teenagers: {
      body: 'https://kidshealth.org/es/teens/your-body/',
      mind: 'https://kidshealth.org/es/teens/your-mind/',
      sexualHealth: 'https://kidshealth.org/es/teens/sexual-health/',
      foodExercise: 'https://kidshealth.org/es/teens/food-fitness/',
      diseasesConditions: 'https://kidshealth.org/es/teens/diseases-conditions/',
      infections: 'https://kidshealth.org/es/teens/infections/',
      drugsAlcohol: 'https://kidshealth.org/es/teens/drug-alcohol/',
      schoolWork: 'https://kidshealth.org/es/teens/school-jobs/',
      sports: 'https://kidshealth.org/es/teens/sports-center/',
      expertAnswers: 'https://kidshealth.org/es/teens/expert/',
      staySafe: 'https://kidshealth.org/es/teens/safety/',
    },
  },
  en: {
    parents: {
      generalHealth: 'https://kidshealth.org/en/parents/general/',
      growthDevelopment: 'https://kidshealth.org/en/parents/growth/',
      infections: 'https://kidshealth.org/en/parents/infections/',
      diseasesConditions: 'https://kidshealth.org/en/parents/medical/',
      pregnancyBaby: 'https://kidshealth.org/en/parents/pregnancy-newborn/',
      nutritionExercise: 'https://kidshealth.org/en/parents/nutrition-center/',
      emotionsBehavior: 'https://kidshealth.org/en/parents/emotions/',
      schoolFamily: 'https://kidshealth.org/en/parents/positive/',
      firstAidSafety: 'https://kidshealth.org/en/parents/firstaid-safe/',
      doctorsHospitals: 'https://kidshealth.org/en/parents/system/',
      playLearn: 'https://kidshealth.org/en/parents/play-learn-center/',
    },
    children: {
      body: 'https://kidshealth.org/en/kids/htbw/',
      pubertyGrowth: 'https://kidshealth.org/en/kids/grow/',
      stayHealthy: 'https://kidshealth.org/en/kids/stay-healthy/',
      staySafe: 'https://kidshealth.org/en/kids/watch/',
      healthProblems: 'https://kidshealth.org/en/kids/health-problems/',
      illnessesInjuries: 'https://kidshealth.org/en/kids/ill-injure/',
      relaxUnwindCenter: 'https://kidshealth.org/en/kids/stress-center/',
      helpfulPeople: 'https://kidshealth.org/en/kids/feel-better/',
      feelings: 'https://kidshealth.org/en/kids/feeling/',
      questionsAnswers: 'https://kidshealth.org/en/kids/talk/',
    },
    teenagers: {
      body: 'https://kidshealth.org/en/teens/your-body/',
      mind: 'https://kidshealth.org/en/teens/your-mind/',
      sexualHealth: 'https://kidshealth.org/en/teens/sexual-health/',
      foodExercise: 'https://kidshealth.org/en/teens/food-fitness/',
      diseasesConditions: 'https://kidshealth.org/en/teens/diseases-conditions/',
      infections: 'https://kidshealth.org/en/teens/infections/',
      drugsAlcohol: 'https://kidshealth.org/en/teens/drug-alcohol/',
      schoolWork: 'https://kidshealth.org/en/teens/school-jobs/',
      sports: 'https://kidshealth.org/en/teens/sports-center/',
      expertAnswers: 'https://kidshealth.org/en/teens/expert/',
      staySafe: 'https://kidshealth.org/en/teens/safety/',
    },
  },
};

const PARENT_TOPICS = [
  'generalHealth',
  'growthDevelopment',
  'infections',
  'diseasesConditions',
  'pregnancyBaby',
  'nutritionExercise',
  'emotionsBehavior',
  'schoolFamily',
  'firstAidSafety',
  'doctorsHospitals',
  'playLearn',
];

const CHILDREN_TOPICS = [
  'body',
  'pubertyGrowth',
  'stayHealthy',
  'staySafe',
  'healthProblems',
  'illnessesInjuries',
  'relaxUnwindCenter',
  'helpfulPeople',
  'feelings',
  'questionsAnswers',
];

const TEENAGERS_TOPICS = [
  'body',
  'mind',
  'sexualHealth',
  'foodExercise',
  'diseasesConditions',
  'infections',
  'drugsAlcohol',
  'schoolWork',
  'sports',
  'expertAnswers',
  'staySafe',
];

module.exports = { CATEGORY_URLS, PARENT_TOPICS, CHILDREN_TOPICS, TEENAGERS_TOPICS };
