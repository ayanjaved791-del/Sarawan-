import { RestaurantConfig } from '../types';
import { EXACT_SARAWAN_MENU, EXACT_SARAWAN_CATEGORIES } from './exactMenu';

export const DEFAULT_CONFIG: RestaurantConfig = {
  name: 'Sarawan',
  phone: '0335-3131686',
  whatsapp: '0335-3131686',
  address: 'Sarawan Fast Food, Karachi',
  openingHours: '12:00 PM - 02:00 AM (Open 7 Days a Week)',
  deliveryFee: 150,
  minOrderAmount: 300,
  estimatedTime: '35 - 45 Mins',
  isAcceptingOrders: true,
  currency: 'Rs.',
};

export const INITIAL_CATEGORIES: string[] = [...EXACT_SARAWAN_CATEGORIES];
export const INITIAL_MENU = EXACT_SARAWAN_MENU;
