import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import { useState, useEffect } from 'react';
import { TodayDataStat } from "../types/todayData";
import Day from "../components/stats/Day";
import Week from "../components/stats/Week";
import './Stats.css';

const Stats: React.FC = () => {
  const [segment, setSegment] = useState<string | undefined>("day");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Stats</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={segment} onIonChange={e => setSegment(e.detail.value)}>
            <IonSegmentButton value="day">
              <IonLabel>Day</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="week">
              <IonLabel>Week</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Stats</IonTitle>
          </IonToolbar>
        </IonHeader>
        {segment === "day" ? <Day /> : null}
        {segment === "week" ? <Week /> : null}
      </IonContent>
    </IonPage>
  );
};

export default Stats;
