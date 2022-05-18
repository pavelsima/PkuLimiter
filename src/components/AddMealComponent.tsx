import { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonModal, IonButton, IonButtons, IonRadioGroup, IonListHeader, IonLabel, IonRadio, IonItem, IonInput, useIonPicker } from '@ionic/react';
import { TodayDataStat, SeparateDishes } from "../types/todayData";
import moment from 'moment';
import './AddMealComponent.css';
import { Storage } from '@capacitor/storage';
import { MealsSizeMap, MealsMap } from "../enums/enums"

type Props = {
  onChange: any;
  setShowModal: any;
  showModal: boolean;
  chosenMeal: string;
  todayData: TodayDataStat[];
  unit: string;
  dailyPHELimit: number;
  PHEMultiplier: number;
}

type PickerOption = {
  text: string;
  value: number;
}

const AddMealComponent: React.FC<Props> = ({ onChange, setShowModal, showModal, chosenMeal, todayData, unit, dailyPHELimit, PHEMultiplier }) => {
  const [presentPicker] = useIonPicker();
  const [mealName, setMealName] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmountBool] = useState(false);

  const getPickerOptions = () => {
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

  const dataStat = () => todayData.find((dataStat: TodayDataStat) => dataStat.key === chosenMeal);

  const updateTodayData = () => {
    const updatedData = [...todayData];
    const indexToUpdate = updatedData.findIndex((data: TodayDataStat) => data.key === chosenMeal);
    const newDish: SeparateDishes = {
      name: mealName,
      phe: selectedAmount,
      time: moment().format()
    };

    updatedData[indexToUpdate].phe += selectedAmount;
    updatedData[indexToUpdate].protein = updatedData[indexToUpdate].phe / PHEMultiplier;
    updatedData[indexToUpdate].value = updatedData[indexToUpdate].phe / (dailyPHELimit / 100);
    updatedData[indexToUpdate].dishes = [...updatedData[indexToUpdate].dishes, newDish];
    const todayDate = moment().format('DD-MM-YYYY');

    Storage.set({
      key: `${todayDate}PheData`,
      value: JSON.stringify(updatedData),
    }).then(() => {
      onChange();
      setShowModal(false);
    })
  }

  const totalPheToday = () => todayData.map((stat: TodayDataStat) => stat.phe)
    .reduce((total: number, pheStat: number, index: number) => total + pheStat, 0);

  const remainingPHE = () => dailyPHELimit - totalPheToday() > 0 ? dailyPHELimit - totalPheToday() : 0;

  const finalMealPreset = () => {
    const mealSize = MealsSizeMap[chosenMeal] || MealsSizeMap[MealsMap.Snacks];
    const optimalMealContent = (dailyPHELimit / 100) * mealSize;
    return remainingPHE() > optimalMealContent ? optimalMealContent : remainingPHE();
  };

  const finalMealPresetWithUnit = () => unit === "protein" ? (finalMealPreset() / PHEMultiplier) : finalMealPreset()

  const setCustomAmount = () => {
    const pickerOptions = getPickerOptions();
    const pickerSelectedOption = pickerOptions.reduce(function(prev, curr) {
      return (Math.abs(curr.value - finalMealPreset()) < Math.abs(prev.value - finalMealPreset()) ? curr : prev);
    });
    const pickerSelectedIndex = pickerOptions.findIndex((option: any) => pickerSelectedOption.value === option.value);

    presentPicker({
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            setSelectedAmount(finalMealPreset());
            setCustomAmountBool(false);
          }
        },
        {
          text: 'Add',
          handler: (selected) => {
            setSelectedAmount(selected.data.value);
            setCustomAmountBool(true);
          },
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

  useEffect(() => setSelectedAmount(finalMealPreset()), [showModal])

  return (
    <>
      <IonModal
        isOpen={showModal}
        swipeToClose={true}
        presentingElement={undefined}>
          <IonHeader translucent>
            <IonToolbar>
              <IonTitle>What did you had for {dataStat()?.key}?</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
          <p className="meal-info">
            {dataStat()?.value !== 0 ?
              unit === "protein" ? `Already have ${dataStat()?.protein.toFixed(1)} g of protein.` : `Already have ${dataStat()?.phe.toFixed(1)} PHE.` : null
            }
          </p>

          <IonListHeader>
            <IonLabel>Meal name</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonInput value={mealName} onIonChange={e => setMealName(e.detail.value!)}></IonInput>
          </IonItem>

          <IonRadioGroup value={selectedAmount} onIonChange={e => setSelectedAmount(e.detail.value)}>
            <IonListHeader>
              <IonLabel>Amount of protein in meal</IonLabel>
            </IonListHeader>

            <IonItem>
              <IonLabel>Small amount ({(finalMealPresetWithUnit() / 2).toFixed(1)} {unit === "protein" ? "g" : "PHE"})</IonLabel>
              <IonRadio onClick={() => setCustomAmountBool(false)} color="secondary" slot="end" value={(finalMealPreset() / 2)} />
            </IonItem>

            <IonItem>
              <IonLabel>Normal amount ({finalMealPresetWithUnit().toFixed(1)} {unit === "protein" ? "g" : "PHE"})</IonLabel>
              <IonRadio onClick={() => setCustomAmountBool(false)} color="primary" slot="end" value={finalMealPreset()} />
            </IonItem>

            <IonItem>
              <IonLabel>Big amount ({(finalMealPresetWithUnit() + (finalMealPresetWithUnit() / 2)).toFixed(1)} {unit === "protein" ? "g" : "PHE"})</IonLabel>
              <IonRadio onClick={() => setCustomAmountBool(false)} color="tertiary" slot="end" value={(finalMealPreset() + (finalMealPreset() / 2))} />
            </IonItem>

            <IonItem>
              <IonLabel>
                Custom amount {customAmount ? `(${unit === "protein" ? (selectedAmount / PHEMultiplier).toFixed(1) : selectedAmount.toFixed(1)} ${unit === "protein" ? "g" : "PHE"})` : null}
              </IonLabel>
              <IonRadio onClick={() => setCustomAmount()} color="tertiary" slot="end" value={customAmount ? selectedAmount : null} />
            </IonItem>
          </IonRadioGroup>

          <p></p>

          <IonButton expand="block" onClick={() => updateTodayData()}>Submit</IonButton>
          </IonContent>
      </IonModal>
    </>
  );
};

export default AddMealComponent;
