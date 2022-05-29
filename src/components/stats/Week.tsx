import { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonModal, IonButton, IonButtons, IonRadioGroup, IonBadge, IonLabel, IonList, IonItem, IonListHeader, IonIcon } from '@ionic/react';
import { TodayDataStat, SeparateDishes } from "../../types/todayData";
import { PieChart } from 'react-minimal-pie-chart';
import moment from 'moment';
import './Week.css';
import { Storage } from '@capacitor/storage';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { MealsSizeMap, MealsMap } from "../../enums/enums"

const WeekStat: React.FC = () => {

  return (
    <>
      <p className="stats_error_message">Not available right now.</p>
    </>
  );
};

export default WeekStat;
