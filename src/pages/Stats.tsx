import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import Day from '../components/stats/Day';
import Week from '../components/stats/Week';
import { StatTypes } from '../enums/enums';
import './Stats.css';

const Stats: React.FC = () => {
  const [segment, setSegment] = useState<string | undefined>('day');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle data-cy="header-stats">Stats</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value)}>
            <IonSegmentButton data-cy="segment-buttons-day" value={StatTypes.Day}>
              <IonLabel>Day</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton data-cy="segment-buttons-week" value={StatTypes.Week}>
              <IonLabel>Week</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle data-cy="header-stats" size="large">Stats</IonTitle>
          </IonToolbar>
        </IonHeader>
        {segment === StatTypes.Day ? <Day /> : null}
        {segment === StatTypes.Week ? <Week /> : null}
      </IonContent>
    </IonPage>
  );
};

export default Stats;
