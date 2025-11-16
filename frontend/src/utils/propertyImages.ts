// Placeholder изображения для разных типов недвижимости
export const getPropertyImage = (propertyType: string): string => {
  const images: Record<string, string> = {
    'Квартира': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'Дом': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    'Офис': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    'Торговая площадь': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    'Коммерческая': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  };
  return images[propertyType] || images['Квартира'];
};
