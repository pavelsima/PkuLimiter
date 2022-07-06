import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonModal,
  IonButton,
  IonButtons,
  IonRadioGroup,
  IonListHeader,
  IonLabel,
  IonRadio,
  IonItem,
  IonInput,
  useIonPicker,
} from '@ionic/react';
import { TodayDataStat, Dish } from '../types/todayData';
import moment from 'moment';
import './DishModal.css';
import { Storage } from '@capacitor/storage';
import { MealsSizeMap, MealsMap, Units } from '../enums/enums';

type Props = {
  onChange: any;
  setShowModal: any;
  showModal: boolean;
  chosenMeal: string;
  todayData: TodayDataStat[];
  unit: string;
  dailyPHELimit: number;
  PHEMultiplier: number;
  editIndex?: number | undefined;
}

const DishModal: React.FC<Props> = ({
  onChange,
  setShowModal,
  showModal,
  chosenMeal,
  todayData,
  unit,
  dailyPHELimit,
  PHEMultiplier,
  editIndex,
}) => {
  const [presentPicker] = useIonPicker();
  const [mealName, setMealName] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmountBool] = useState(false);

  const todayDate = moment().format('DD-MM-YYYY');

  // Custom input picker setting getter
  const getPickerOptions = () => {
    const emptyArray = Array(100).fill({});

    const resultData = emptyArray.map((dataOption: number, index: number) => {
      const value = (dailyPHELimit / 100) * index;
      const valueInUnit = `${unit === Units.Protein ? (value / PHEMultiplier).toFixed(1) : value.toFixed(1)}`;
      const unitLabel = `${unit === Units.Protein ? 'g' : 'PHE'}`;
      const showText = `${valueInUnit} ${unitLabel}`;

      return {
        text: showText,
        selected: false,
        value,
      };
    });

    return resultData;
  };

  // Actual data for dish
  const dishDataStat = () => todayData.find((dishData: TodayDataStat) => dishData.key === chosenMeal);

  // Save data to local storage
  const savePheData = async (data: TodayDataStat[]) => {
    await Storage.set({
      key: `${todayDate}PheData`,
      value: JSON.stringify(data),
    });
    onChange();
    setMealName('');
    setShowModal(false);
  };

  // Add new meal to dish
  const addNewDish = async (index: number) => {
    const updatedData = [...todayData];
    const newDish: Dish = {
      name: mealName,
      phe: selectedAmount,
      time: moment().format(),
    };

    updatedData[index].phe += selectedAmount;
    updatedData[index].protein = updatedData[index].phe / PHEMultiplier;
    updatedData[index].value = updatedData[index].phe / (dailyPHELimit / 100);
    updatedData[index].dishes.push(newDish);

    await savePheData(updatedData);
  };

  // Save eddited dish
  const editDish = async (index: number) => {
    if (typeof editIndex === 'undefined') return console.error('Cannot edit dish');
    const updatedData = [...todayData];

    updatedData[index].dishes[editIndex].name = mealName;
    updatedData[index].dishes[editIndex].phe = selectedAmount;
    const mealPhe = updatedData[index].dishes
      .reduce((sum: number, dish: Dish) => sum + dish.phe, 0);
    updatedData[index].phe = mealPhe;
    updatedData[index].protein = mealPhe / PHEMultiplier;
    updatedData[index].value = mealPhe / (dailyPHELimit / 100);

    await savePheData(updatedData);
  };

  // Handle saving of data
  const updateData = async () => {
    const dishIndexToUpdate = todayData.findIndex((data: TodayDataStat) => data.key === chosenMeal);

    if (typeof editIndex === 'undefined') {
      await addNewDish(dishIndexToUpdate);
      return;
    }
    editDish(dishIndexToUpdate);
  };

  const totalPheToday = () => todayData.map((stat: TodayDataStat) => stat.phe)
    .reduce((total: number, pheStat: number, index: number) => total + pheStat, 0);

  const remainingPHE = () => (dailyPHELimit - totalPheToday() > 0 ? dailyPHELimit - totalPheToday() : 0);

  // Remaining amount of PHE to be allocated
  const finalMealPreset = () => {
    const mealSize = MealsSizeMap[chosenMeal] || MealsSizeMap[MealsMap.Snacks];
    const optimalMealContent = (dailyPHELimit / 100) * mealSize;
    return remainingPHE() > optimalMealContent || remainingPHE() === 0 ? optimalMealContent : remainingPHE();
  };

  const finalMealPresetWithUnit = () => (unit === Units.Protein ? (finalMealPreset() / PHEMultiplier) : finalMealPreset());

  const setCustomAmount = () => {
    const pickerOptions = getPickerOptions();
    const pickerSelectedOption = pickerOptions.reduce((prev, curr) => (Math.abs(curr.value - finalMealPreset()) < Math.abs(prev.value - finalMealPreset()) ? curr : prev));
    const pickerSelectedIndex = pickerOptions.findIndex((option: any) => pickerSelectedOption.value === option.value);

    presentPicker({
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            setSelectedAmount(finalMealPreset());
            setCustomAmountBool(false);
          },
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
      ],
    });
  };

  const getRadioOptions = () => [
    {
      label: `Small amount(${(finalMealPresetWithUnit() / 2).toFixed(1)} ${unit === Units.Protein ? 'g' : 'PHE'})`,
      color: 'secondary',
      value: finalMealPreset() / 2,
    },
    {
      label: `Normal amount(${finalMealPresetWithUnit().toFixed(1)} ${unit === Units.Protein ? 'g' : 'PHE'})`,
      color: 'primary',
      value: finalMealPreset(),
    },
    {
      label: `Big amount(${(finalMealPresetWithUnit() + (finalMealPresetWithUnit() / 2)).toFixed(1)} ${unit === Units.Protein ? 'g' : 'PHE'})`,
      color: 'tertiary',
      value: finalMealPreset() + (finalMealPreset() / 2),
    },
  ];

  const setDefaultData = () => {
    if (typeof (editIndex) !== 'undefined') {
      const dataToPrefill = todayData.find((meal) => meal.key === chosenMeal)?.dishes[editIndex];
      const defaultPhe = dataToPrefill?.phe || finalMealPreset();
      const radioOptions = getRadioOptions();
      if (radioOptions.filter((option) => option.value === defaultPhe).length === 0) {
        setSelectedAmount(defaultPhe);
        setCustomAmountBool(true);
      }
      setSelectedAmount(defaultPhe);
      setMealName(dataToPrefill?.name || '');
      return;
    }
    setSelectedAmount(finalMealPreset());
  };

  useEffect(() => setDefaultData(), [showModal]);

  return (
    <IonModal
      isOpen={showModal}
      swipeToClose
      presentingElement={undefined}
    >
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>
            What did you had for
            {dishDataStat()?.key}
            ?
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <p className="meal-info">
          {dishDataStat()?.value !== 0
            ? unit === Units.Protein
              ? `Already have ${dishDataStat()?.protein.toFixed(1)} g of protein.`
              : `Already have ${dishDataStat()?.phe.toFixed(1)} PHE.` : null}
        </p>

        <IonListHeader>
          <IonLabel>Meal name</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonInput
            value={mealName}
            data-cy="meal-name-input"
            onIonChange={(e) => setMealName(e.detail.value!)}
          />
        </IonItem>

        <IonRadioGroup
          value={selectedAmount}
          onIonChange={(e) => setSelectedAmount(e.detail.value)}
        >
          <IonListHeader>
            <IonLabel>Amount of protein in meal</IonLabel>
          </IonListHeader>

          {
              getRadioOptions().map((option, i) => (
                <IonItem key={i}>
                  <IonLabel>{option.label}</IonLabel>
                  <IonRadio
                    onClick={() => setCustomAmountBool(false)}
                    color={option.color}
                    slot="end"
                    data-cy={`meal-modal-radio-value-${option.value}`}
                    value={option.value}
                  />
                </IonItem>
              ))
            }

          <IonItem>
            <IonLabel>
              Custom amount
              {' '}
              {
                  customAmount
                    ? `(${unit === Units.Protein
                      ? (selectedAmount / PHEMultiplier).toFixed(1)
                      : selectedAmount.toFixed(1)} ${unit === Units.Protein ? 'g' : 'PHE'})`
                    : null
                }
            </IonLabel>
            <IonRadio
              onClick={() => setCustomAmount()}
              color="tertiary"
              slot="end"
              data-cy="meal-modal-radio-value-custom"
              value={customAmount ? selectedAmount : null}
            />
          </IonItem>
        </IonRadioGroup>

        <p />

        <IonButton
          expand="block"
          data-cy="add-meal-submit-button"
          onClick={() => updateData()}>Submit</IonButton>
      </IonContent>
    </IonModal>
  );
};

export default DishModal;
