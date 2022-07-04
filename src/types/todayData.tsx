
export type Dish = {
  name: string;
  phe: number;
  time: string;
}

export type DishStat = {
  dishName: string;
  dishPhe: number;
  mealTitle: string;
  mealColor: string;
  mealType: string;
  categoryIndex: number;
}

export type TodayDataStat = {
  key: string;
  title: string;
  value: number;
  phe: number;
  protein: number;
  color: string;
  dishes: Dish[];
}