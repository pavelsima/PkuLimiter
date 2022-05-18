
export type SeparateDishes = {
  name: string;
  phe: number;
  time: string;
}

export type TodayDataStat = {
  key: string;
  title: string;
  value: number;
  phe: number;
  protein: number;
  color: string;
  dishes: SeparateDishes[];
}