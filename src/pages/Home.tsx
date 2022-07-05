import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  useIonViewWillEnter,
} from '@ionic/react';
import { Storage } from '@capacitor/storage';
import { PieChart } from 'react-minimal-pie-chart';
import moment from 'moment';
import DishModal from '../components/DishModal';
import { TodayDataStat } from '../types/todayData';
import { MealsMap, Units } from '../enums/enums';
import './Home.css';

const Home: React.FC = () => {
  const [dailyPHELimit, setDailyPHELimit] = useState(500);
  const [PHEMultiplier, setPHEMultiplier] = useState(45);
  const [showModal, setShowModal] = useState(false);
  const [chosenMeal, setChosenMeal] = useState('');
  const [unit, setUnit] = useState(Units.Protein);
  const [remainingPHEData, setRemainingPHEData] = useState<TodayDataStat>({
    key: 'empty',
    title: 'Remaining PHE',
    value: 100,
    phe: dailyPHELimit,
    protein: dailyPHELimit / PHEMultiplier,
    color: '#ffffff33',
    dishes: [],
  });
  const [todayData, setTodayData] = useState<TodayDataStat[]>([
    {
      key: MealsMap.Breakfast, title: 'Breakfast', value: 0, phe: 0, protein: 0, color: '#EC0868', dishes: [],
    },
    {
      key: MealsMap.Lunch, title: 'Lunch', value: 0, phe: 0, protein: 0, color: '#C200FB', dishes: [],
    },
    {
      key: MealsMap.Dinner, title: 'Dinner', value: 0, phe: 0, protein: 0, color: '#FC2F00', dishes: [],
    },
    {
      key: MealsMap.Snacks, title: 'Snacks', value: 0, phe: 0, protein: 0, color: '#428cff', dishes: [],
    },
  ]);

  // Set modal meal and open modal
  const addMeal = (key: string) => {
    setChosenMeal(key);
    setShowModal(true);
  };

  // Refresh empty (remaining) amount from the day
  const refreshRemainingPHEData = () => {
    const totalPheToday = todayData.map((stat: TodayDataStat) => stat.phe)
      .reduce((total: number, pheStat: number, index: number) => total + pheStat, 0);
    const remainingPHE = dailyPHELimit <= totalPheToday ? 0 : dailyPHELimit - totalPheToday;

    setRemainingPHEData({
      key: 'empty',
      title: 'Remaining PHE',
      value: remainingPHE / (dailyPHELimit / 100),
      phe: remainingPHE,
      protein: remainingPHE / PHEMultiplier,
      color: '#ffffff33',
      dishes: [],
    });
  };

  // Get data from local storage
  const loadSavedPHEifExist = async () => {
    const todayDate = moment().format('DD-MM-YYYY');

    const { value: storedPHELImit } = await Storage.get({ key: 'PHELimit' });
    const { value: storedMultiplier } = await Storage.get({ key: 'PHEMultiplier' });
    const { value: storedUnit } = await Storage.get({ key: 'Unit' });
    const { value: storedTodayDay } = await Storage.get({ key: `${todayDate}PheData` });

    if (storedPHELImit) setDailyPHELimit(+storedPHELImit);
    if (storedMultiplier) setPHEMultiplier(+storedMultiplier);
    if (storedUnit) setUnit(storedUnit);
    if (storedTodayDay) setTodayData(JSON.parse(storedTodayDay));
  };

  // Remaining amount in selected unit
  const remainingMainStat = unit === Units.Protein ? remainingPHEData.protein : remainingPHEData.phe;

  // Amount over the limit in selected unit
  const overLimitMainStat = () => {
    const totalPheToday = todayData.map((stat: TodayDataStat) => stat.phe)
      .reduce((total: number, pheStat: number, index: number) => total + pheStat, 0);
    return unit === Units.Protein ? (totalPheToday - dailyPHELimit) / PHEMultiplier : totalPheToday - dailyPHELimit;
  };

  useIonViewWillEnter(() => {
    loadSavedPHEifExist();
  });

  useEffect(() => {
    loadSavedPHEifExist();
  }, []);

  useEffect(() => {
    refreshRemainingPHEData();
  }, [dailyPHELimit, PHEMultiplier, unit, todayData]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="pie_chart_block">
          <span className="pie_chart--main_stat">
            {remainingMainStat !== 0
              ? (
                <>
                  <h1>
                    {remainingMainStat.toFixed(1)}
                    <span>
                      { unit === Units.Protein ? ' g of protein' : ' PHE' }
                    </span>
                  </h1>
                  <p>Remaining to the limit</p>
                </>
              ) : (
                <span style={{ color: '#fc2f00' }}>
                  <h1>
                    {overLimitMainStat().toFixed(1)}
                    <span>
                      { unit === Units.Protein ? ' g of protein' : ' PHE' }
                    </span>
                  </h1>
                  <p>over the limit</p>
                </span>
              )}
          </span>
          <PieChart
            center={[50, 50]}
            data={[remainingPHEData, ...todayData]}
            labelPosition={50}
            lengthAngle={360}
            lineWidth={15}
            paddingAngle={0}
            radius={50}
            rounded
            startAngle={0}
            viewBoxSize={[100, 100]}
          />
          <ul>
            {[remainingPHEData, ...todayData].map((data, index) => {
              if (index !== 0) {
                return (
                  <li style={{ background: data.color, color: '#ffffff' }} key={index}>
                    <b>
                      {data.title}
                      :
                      {' '}
                    </b>
                    {
                    unit === Units.Protein
                      ? data.protein.toFixed(1)
                      : data.phe.toFixed(1)
                  }
                    {' '}
                    {
                    unit === Units.Protein ? ' g' : ' PHE'
                  }
                  </li>
                );
              }
            })}
          </ul>
        </div>
        <h2 className="new-meal-header">Add new meal</h2>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton className="breakfast-button" expand="block" onClick={() => addMeal('breakfast')}>Add Breakfast</IonButton>
            </IonCol>
            <IonCol>
              <IonButton className="lunch-button" expand="block" onClick={() => addMeal('lunch')}>Add Lunch</IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton className="dinner-button" expand="block" onClick={() => addMeal('dinner')}>Add Dinner</IonButton>
            </IonCol>
            <IonCol>
              <IonButton className="snacks-button" expand="block" onClick={() => addMeal('snacks')}>Add Snacks</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <DishModal
          showModal={showModal}
          setShowModal={setShowModal}
          todayData={todayData}
          chosenMeal={chosenMeal}
          unit={unit}
          PHEMultiplier={PHEMultiplier}
          dailyPHELimit={dailyPHELimit}
          onChange={loadSavedPHEifExist}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
