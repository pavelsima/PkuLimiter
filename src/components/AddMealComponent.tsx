import { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonModal, IonButton, IonButtons, useIonPicker } from '@ionic/react';
import { TodayDataStat } from "../types/todayData";
import moment from 'moment';
import './AddMealComponent.css';
import { Storage } from '@capacitor/storage';
import { MealsSizeMap, MealsMap } from "../enums/enums"

type Props = {
  onChange: any;
  todayData: TodayDataStat[];
  unit: string;
  dailyPHELimit: number;
  PHEMultiplier: number;
}

type PickerOption = {
  text: string;
  value: number;
}

const AddMealComponent: React.FC<Props> = ({ onChange, todayData, unit, dailyPHELimit, PHEMultiplier }) => {
  const [showModal, setShowModal] = useState(false);
  const [presentPicker] = useIonPicker();

  const getPickerOptions = (key: string) => {
    const emptyArray = Array(100).fill({});

    const resultData = emptyArray.map((dataOption: number, index: number) => {
      const value = (dailyPHELimit / 100) * index;
      const showText = `${unit === "protein" ? (value / PHEMultiplier).toFixed(1) : value.toFixed(1)} ${unit === "protein" ? "g" : "PHE"}`;
      return {
        text: showText,
        selected: false,
        value,
      }
    });

    return resultData;
  }

  const updateTodayData = (addedData: number, key: string) => {
    const updatedData = [...todayData];
    const indexToUpdate = updatedData.findIndex((data: TodayDataStat) => data.key === key);
    updatedData[indexToUpdate].phe += addedData;
    updatedData[indexToUpdate].protein = updatedData[indexToUpdate].phe / PHEMultiplier;
    updatedData[indexToUpdate].value = updatedData[indexToUpdate].phe / (dailyPHELimit / 100);
    const todayDate = moment().format('DD-MM-YYYY');

    Storage.set({
      key: `${todayDate}PheData`,
      value: JSON.stringify(updatedData),
    }).then(() => {
      onChange();
      setShowModal(false);
    })
  }

  const addMeal = (key: string) => {
    const pickerOptions = getPickerOptions(key);
    const totalPheToday = todayData.map((stat: TodayDataStat) => stat.phe)
      .reduce((total: number, pheStat: number, index: number) => total + pheStat, 0);
    const remainingPHE = dailyPHELimit - totalPheToday > 0 ? dailyPHELimit - totalPheToday : 0;
    const mealSize = MealsSizeMap[key] || MealsSizeMap[MealsMap.Snacks];
    const optimalMealContent = (dailyPHELimit / 100) * mealSize;
    const finalMealPreset = remainingPHE > optimalMealContent ? optimalMealContent : remainingPHE;
    const pickerSelectedOption = pickerOptions.reduce(function(prev, curr) {
      return (Math.abs(curr.value - finalMealPreset) < Math.abs(prev.value - finalMealPreset) ? curr : prev);
    });
    const pickerSelectedIndex = pickerOptions.findIndex((option: any) => pickerSelectedOption.value === option.value);

    presentPicker({
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Add',
          handler: (selected) => updateTodayData(selected.data.value, key),
        },
      ],
      columns: [
        {
          name: 'data',
          options: pickerOptions,
          selectedIndex: pickerSelectedIndex,
        },
      ]
    });
  }

  return (
    <>
      <IonButton expand="block" onClick={() => setShowModal(true)}>Add new meal</IonButton>
      <IonModal
        isOpen={showModal}
        swipeToClose={true}
        presentingElement={undefined}>
          <IonHeader translucent>
            <IonToolbar>
              <IonTitle>Select meal</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <h1>
            What meal you want to add?
            </h1>

          {todayData.map((dataStat: TodayDataStat) => {
            return (
              <div className="data_stats_buttons" key={dataStat.key}>
                <IonButton expand="block" onClick={() => addMeal(dataStat.key)}>{dataStat.title}</IonButton>
                {dataStat.value !== 0 ?
                  (<p>
                    {unit === "protein" ? `Already have ${dataStat.protein.toFixed(1)} g of protein` : `Already have ${dataStat.phe.toFixed(1)} PHE`}
                  </p>) : (
                    <p>Nothing added yet</p>
                  )}
              </div>
            )
          })}
          </IonContent>
      </IonModal>
    </>
  );
};

export default AddMealComponent;
