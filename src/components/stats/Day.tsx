import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonBadge,
  IonLabel,
  IonList,
  IonItem,
  IonListHeader,
  IonIcon,
  useIonViewWillEnter,
} from '@ionic/react';
import { TodayDataStat, Dish, DishStat } from '../../types/todayData';
import { PieChart } from 'react-minimal-pie-chart';
import moment from 'moment';
import './Day.css';
import { Storage } from '@capacitor/storage';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { Units } from '../../enums/enums';
import DishModal from '../../components/DishModal';

const DayStat: React.FC = () => {
  const [dayData, setDayData] = useState<TodayDataStat[] | undefined>();
  const [date, setDate] = useState(moment().format('DD-MM-YYYY'));
  const [dailyPHELimit, setDailyPHELimit] = useState(500);
  const [PHEMultiplier, setPHEMultiplier] = useState(45);
  const [unit, setUnit] = useState('protein');
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(0);
  const [chosenMeal, setChosenMeal] = useState('');
  const [allDishes, setAllDishes] = useState<DishStat[] | undefined>();
  const [dataNotExisting, setDataNotExisting] = useState(false);

  // Load data for set data
  const loadDayData = async () => {
    setDataNotExisting(false);
    const { value: storedTodayDay } = await Storage.get({ key: `${date}PheData` });
    if (storedTodayDay) {
      setDayData(JSON.parse(storedTodayDay));
    } else {
      setDataNotExisting(true);
    }
  };

  // Load setting
  const loadSetting = async () => {
    const { value: storedPHELImit } = await Storage.get({ key: 'PHELimit' });
    const { value: storedMultiplier } = await Storage.get({ key: 'PHEMultiplier' });
    const { value: storedUnit } = await Storage.get({ key: 'Unit' });
    if (storedPHELImit) setDailyPHELimit(+storedPHELImit);
    if (storedMultiplier) setPHEMultiplier(+storedMultiplier);
    if (storedUnit) setUnit(storedUnit);
  };

  // Method to prepare data for stat list
  const prepareDishesForStats = () => {
    if (!dayData) return;
    const allDishesUnflatten = dayData.map((meal: TodayDataStat) => meal.dishes.map((dish: Dish, index) => {
      const dishData: DishStat = {
        dishName: dish.name,
        dishPhe: dish.phe,
        mealTitle: meal.title,
        mealColor: meal.color,
        mealType: meal.key,
        categoryIndex: index,
      };
      return dishData;
    })) || [];
    setAllDishes(Array.prototype.concat.apply([], allDishesUnflatten));
  };

  //
  const totalPheToday = () => (dayData?.map((stat: TodayDataStat) => stat.phe) || [])
    .reduce((total: number, pheStat: number, index: number) => total + pheStat, 0);
  const overLimitMainStat = () => (unit === Units.Protein ? (totalPheToday() - dailyPHELimit) / PHEMultiplier : totalPheToday() - dailyPHELimit);

  const editDish = (mealType: string, editIndex: number) => {
    setChosenMeal(mealType);
    setEditIndex(editIndex);
    setShowModal(true);
  };

  useEffect(() => {
    prepareDishesForStats();
  }, [dayData]);

  useEffect(() => {
    loadDayData();
    loadSetting();
  }, [date]);

  useIonViewWillEnter(() => {
    loadDayData();
    loadSetting();
  });

  return (
    <>
      <div className="pie_chart_block">
        {dataNotExisting
          ? (
            <div className="pie_chart_block">
              <p className="stats_error_message">There are no data.</p>
            </div>
          ) : (
            <>
              <span className="pie_chart--main_stat">
                <span>
                  <h1>
                    {unit === Units.Protein
                      ? (totalPheToday() / PHEMultiplier).toFixed(1)
                      : totalPheToday().toFixed(1)}
                    <span>
                      { unit === Units.Protein ? ' g of protein' : ' PHE' }
                    </span>
                  </h1>
                  {overLimitMainStat() > 0
                    ? (
                      <p>
                        {overLimitMainStat().toFixed(1)}
                        <span>
                          {unit === Units.Protein ? ' g of protein ' : ' PHE '}
                        </span>
                        over the limit
                      </p>
                    ) : null}
                </span>
              </span>
              <PieChart
                center={[50, 50]}
                data={dayData}
                labelPosition={50}
                lengthAngle={360}
                lineWidth={15}
                paddingAngle={0}
                radius={50}
                rounded
                startAngle={0}
                viewBoxSize={[100, 100]}
              />
            </>
          )}
      </div>
      <IonList>
        <IonListHeader>
          <div className="day-header">
            <IonButton onClick={() => setDate(moment(date, 'DD-MM-YYYY').subtract(1, 'day').format('DD-MM-YYYY'))}>
              <IonIcon slot="icon-only" className="arrow-icon" icon={chevronBackOutline} />
            </IonButton>
            <h2>{moment(date, 'DD-MM-YYYY').format('D.M.YYYY')}</h2>
            <IonButton onClick={() => setDate(moment(date, 'DD-MM-YYYY').add(1, 'day').format('DD-MM-YYYY'))}>
              <IonIcon slot="icon-only" className="arrow-icon" icon={chevronForwardOutline} />
            </IonButton>
          </div>
        </IonListHeader>
        {!dataNotExisting
          ? allDishes?.map((dish: DishStat, i: number) => (
            <IonItem key={i} onClick={() => editDish(dish.mealType, dish.categoryIndex)}>
              <span
                className="meal-badge"
                style={{
                  background: dish.mealColor,
                }}
              >
                {dish.mealTitle}
              </span>
              <IonLabel>
                {dish.dishName}
              </IonLabel>
              <IonBadge color="primary">
                {
                    unit === Units.Protein
                      ? `${(dish.dishPhe / PHEMultiplier).toFixed(1)} g`
                      : `${dish.dishPhe.toFixed(1)} PHE`
                  }
              </IonBadge>
            </IonItem>
          )) : null}
      </IonList>
      {dayData
        ? (
          <DishModal
            showModal={showModal}
            setShowModal={setShowModal}
            todayData={dayData}
            chosenMeal={chosenMeal}
            unit={unit}
            PHEMultiplier={PHEMultiplier}
            dailyPHELimit={dailyPHELimit}
            editIndex={editIndex}
            onChange={loadDayData}
          />
        )
        : null}
    </>
  );
};

export default DayStat;
