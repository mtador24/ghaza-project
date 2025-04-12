
export interface Donor {
  id: number;
  name: string;
  amount: number;
  date: string;
  message?: string;
}

export interface ProjectImage {
  id: number;
  projectId: number;
  url: string;
  alt: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  goal: number;
  raised: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  donors: Donor[];
  images: ProjectImage[];
}

export const mockProjects: Project[] = [
  {
    id: 1,
    title: "إعادة بناء مستشفى الشفاء",
    shortDescription: "مساعدة في إعادة بناء وتجهيز مستشفى الشفاء في غزة",
    description: "مستشفى الشفاء هو أكبر مجمع طبي في قطاع غزة، ويعاني من أضرار بالغة نتيجة القصف. يهدف هذا المشروع إلى إعادة بناء وتجهيز المستشفى بالمعدات الطبية اللازمة لاستئناف خدماته الحيوية للمدنيين في غزة. سيساعد تبرعك في توفير الرعاية الصحية لآلاف الأشخاص في حاجة ماسة إليها.",
    goal: 500000,
    raised: 350000,
    startDate: "2023-12-01",
    endDate: "2024-06-30",
    isActive: true,
    donors: [
      { id: 1, name: "أحمد محمد", amount: 5000, date: "2024-01-15", message: "مع غزة حتى النصر" },
      { id: 2, name: "سارة علي", amount: 3000, date: "2024-01-20" },
      { id: 3, name: "محمود إبراهيم", amount: 10000, date: "2024-02-01", message: "أتمنى الشفاء لكل المرضى" },
      { id: 4, name: "ليلى عمر", amount: 2500, date: "2024-02-15" },
      { id: 5, name: "خالد سعيد", amount: 7500, date: "2024-03-01", message: "للمساهمة في تجهيز قسم الطوارئ" }
    ],
    images: [
      { id: 1, projectId: 1, url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d", alt: "صورة لمستشفى" },
      { id: 2, projectId: 1, url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d", alt: "معدات طبية" },
      { id: 3, projectId: 1, url: "https://images.unsplash.com/photo-1516549655619-6dadcf1215e3", alt: "فريق طبي" }
    ]
  },
  {
    id: 2,
    title: "توفير مياه نظيفة للعائلات",
    shortDescription: "مشروع لتوفير مياه صالحة للشرب للعائلات المتضررة",
    description: "يعاني سكان غزة من نقص حاد في المياه الصالحة للشرب. يهدف هذا المشروع إلى توفير محطات تنقية مياه متنقلة وخزانات مياه للمناطق المتضررة. سيساعد تبرعك في توفير مياه نظيفة لآلاف العائلات، مما يقي من انتشار الأمراض ويحافظ على صحة الأطفال والكبار.",
    goal: 200000,
    raised: 125000,
    startDate: "2024-01-15",
    endDate: "2024-07-15",
    isActive: true,
    donors: [
      { id: 6, name: "فاطمة حسن", amount: 2000, date: "2024-02-10", message: "للأطفال حق في مياه نظيفة" },
      { id: 7, name: "عمر سليم", amount: 5000, date: "2024-02-20" },
      { id: 8, name: "نور الدين", amount: 1500, date: "2024-03-05", message: "مع أهلنا في غزة" }
    ],
    images: [
      { id: 4, projectId: 2, url: "https://images.unsplash.com/photo-1581056771107-24ca5f033842", alt: "خزان مياه" },
      { id: 5, projectId: 2, url: "https://images.unsplash.com/photo-1551818255-e6e10975bc17", alt: "توزيع مياه" },
      { id: 6, projectId: 2, url: "https://images.unsplash.com/photo-1543057119-32d82a34490d", alt: "عائلة تستلم مياه" }
    ]
  },
  {
    id: 3,
    title: "سلال غذائية للأسر المحتاجة",
    shortDescription: "توفير سلال غذائية شهرية للأسر المتضررة في غزة",
    description: "تواجه العائلات في غزة أزمة غذائية خانقة. يهدف هذا المشروع إلى توفير سلال غذائية شهرية تحتوي على المواد الأساسية مثل الأرز والطحين والزيت والسكر والبقوليات. سيساعد تبرعك في إطعام عائلات بأكملها وتخفيف معاناتهم خلال هذه الظروف الصعبة.",
    goal: 300000,
    raised: 220000,
    startDate: "2023-11-01",
    endDate: "2024-05-01",
    isActive: true,
    donors: [
      { id: 9, name: "يوسف خالد", amount: 3000, date: "2024-01-05", message: "لن ننساكم" },
      { id: 10, name: "زينب عادل", amount: 7000, date: "2024-01-25" },
      { id: 11, name: "كريم سامي", amount: 4500, date: "2024-02-10", message: "مع غزة الصامدة" },
      { id: 12, name: "هدى علي", amount: 2000, date: "2024-02-28" }
    ],
    images: [
      { id: 7, projectId: 3, url: "https://images.unsplash.com/photo-1593113598332-cd59a0c3a9a4", alt: "سلة غذائية" },
      { id: 8, projectId: 3, url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c", alt: "توزيع مساعدات" },
      { id: 9, projectId: 3, url: "https://images.unsplash.com/photo-1607117161199-b67cdd88583e", alt: "عائلة تستلم مساعدات" }
    ]
  }
];

export interface User {
  id: number;
  username: string;
  password: string; // في التطبيق الحقيقي، يجب تخزين كلمات المرور بشكل آمن
  name: string;
  role: 'admin';
}

export const mockUsers: User[] = [
  {
    id: 1,
    username: "admin",
    password: "admin123", // في التطبيق الحقيقي، يجب تشفير كلمات المرور
    name: "مدير النظام",
    role: 'admin'
  }
];
