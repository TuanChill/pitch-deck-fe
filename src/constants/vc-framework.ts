import type { VCCategory } from '@/types/response/pitch-deck';
import { Users, TrendingUp, Lightbulb, Rocket, DollarSign, Target, BarChart3 } from 'lucide-react';

export type VCCategoryConfig = {
  label: string;
  description: string;
  icon: typeof Users;
  color: string;
  gradientFrom: string;
  gradientTo: string;
};

export const VC_CATEGORY_CONFIG: Record<VCCategory, VCCategoryConfig> = {
  teamAndFounders: {
    label: 'Team & Founders',
    description: 'Experience, expertise, and team composition',
    icon: Users,
    color: 'blue',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600'
  },
  marketSize: {
    label: 'Market Size',
    description: 'TAM, SAM, SOM and market opportunity',
    icon: TrendingUp,
    color: 'purple',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-600'
  },
  productSolution: {
    label: 'Product/Solution',
    description: 'Value proposition and product-market fit',
    icon: Lightbulb,
    color: 'green',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-green-600'
  },
  traction: {
    label: 'Traction',
    description: 'Growth metrics and customer adoption',
    icon: Rocket,
    color: 'orange',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-orange-600'
  },
  businessModel: {
    label: 'Business Model',
    description: 'Revenue streams and unit economics',
    icon: DollarSign,
    color: 'cyan',
    gradientFrom: 'from-cyan-500',
    gradientTo: 'to-cyan-600'
  },
  competition: {
    label: 'Competition',
    description: 'Competitive landscape and differentiation',
    icon: Target,
    color: 'pink',
    gradientFrom: 'from-pink-500',
    gradientTo: 'to-pink-600'
  },
  financials: {
    label: 'Financials',
    description: 'Projections and funding requirements',
    icon: BarChart3,
    color: 'amber',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-amber-600'
  }
};

export const VC_CATEGORY_WEIGHTS: Record<VCCategory, number> = {
  teamAndFounders: 0.25,
  marketSize: 0.2,
  productSolution: 0.15,
  traction: 0.15,
  businessModel: 0.15,
  competition: 0.1,
  financials: 0.05
};

export const VC_CATEGORIES: VCCategory[] = [
  'teamAndFounders',
  'marketSize',
  'productSolution',
  'traction',
  'businessModel',
  'competition',
  'financials'
] as const;
