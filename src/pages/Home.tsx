import { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import { Storage } from '@capacitor/storage';
import { PieChart } from 'react-minimal-pie-chart';
import moment from 'moment';
import AddMealComponent from "../components/AddMealComponent";
import { TodayDataStat } from "../types/todayData";
import { MealsMap } from "../enums/enums"
import './Home.css';

const Home: React.FC = () => {
  const [dailyPHELimit, setDailyPHELimit] = useState(500);
  const [PHEMultiplier, setPHEMultiplier] = useState(45);
  const [unit, setUnit] = useState("protein");
  const [remainingPHEData, setRemainingPHEData] = useState<TodayDataStat>({
    key: "empty",
    title: 'Remaining PHE',
    value: 100,
    phe: dailyPHELimit,
    protein: dailyPHELimit / PHEMultiplier,
    color: '#ffffff33',
  })
  const [todayData, setTodayData] = useState<TodayDataStat[]>([
    { key: MealsMap.Breakfast, title: 'Breakfast', value: 0, phe: 0, protein: 0, color: '#EC0868' },
    { key: MealsMap.Lunch, title: 'Lunch', value: 0, phe: 0, protein: 0, color: '#C200FB' },
    { key: MealsMap.Dinner, title: 'Dinner', value: 0, phe: 0, protein: 0, color: '#FC2F00' },
    { key: MealsMap.Snacks, title: 'Snacks', value: 0, phe: 0, protein: 0, color: '#428cff' },
  ]);

  const refreshRemainingPHEData = () => {
    const totalPheToday = todayData.map((stat: TodayDataStat) => stat.phe)
      .reduce((total: number, pheStat: number, index: number) => total + pheStat, 0);
    const remainingPHE = dailyPHELimit <= totalPheToday ? 0 : dailyPHELimit - totalPheToday;
    setRemainingPHEData({
      key: "empty",
      title: 'Remaining PHE',
      value: remainingPHE / (dailyPHELimit / 100),
      phe: remainingPHE,
      protein: remainingPHE / PHEMultiplier,
      color: '#ffffff33',
    });
    console.log(remainingPHE, totalPheToday);
  }

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

  const remainingMainStat = unit === "protein" ? remainingPHEData.protein : remainingPHEData.phe;
  const overLimitMainStat = () => {
    const totalPheToday = todayData.map((stat: TodayDataStat) => stat.phe)
      .reduce((total: number, pheStat: number, index: number) => total + pheStat, 0);
    return unit === "protein" ? (totalPheToday - dailyPHELimit) / PHEMultiplier : totalPheToday - dailyPHELimit
  };

  useIonViewWillEnter(() => {
    loadSavedPHEifExist();
  });

  useEffect(() => {
    loadSavedPHEifExist();
  }, [])

  useEffect(() => {
    refreshRemainingPHEData();
  }, [dailyPHELimit, PHEMultiplier, unit, todayData])

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
                      { unit === "protein" ? " g of protein" : " PHE" }
                    </span>
                  </h1>
                  <p>Remaining to the limit</p>
                </>
              ) : (
                <span style={{color: "#fc2f00"}}>
                  <h1>
                    {overLimitMainStat().toFixed(1)}
                    <span>
                      { unit === "protein" ? " g of protein" : " PHE" }
                    </span>
                  </h1>
                  <p>Over the limit</p>
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
                return <li style={{ background: data.color, color: "#ffffff" }} key={index}>
                  <b>{data.title}: </b>
                  {unit === "protein" ? data.protein.toFixed(1) : data.phe.toFixed(1)} {unit === "protein" ? " g" : " PHE" }
                   </li>;
              }
            })}
          </ul>
        </div>
        <AddMealComponent
          todayData={todayData}
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
