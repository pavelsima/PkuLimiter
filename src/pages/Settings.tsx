import { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonSegment, IonSegmentButton, IonRange, IonLabel } from '@ionic/react';
import { Storage } from '@capacitor/storage';
import './Settings.css';

type stateMap = {
    [key: string]: React.Dispatch<any>,
};

const Settings: React.FC = () => {
  const [dailyPHELimit, setDailyPHELimit] = useState(500);
  const [PHEMultiplier, setPHEMultiplier] = useState(45);
  const [unit, setUnit] = useState("protein");

  const setStateData = (key: string, value: number): void => {
    const map: stateMap = {
      PHELimit: setDailyPHELimit,
      PHEMultiplier: setPHEMultiplier,
      Unit: setUnit,
    }

    map[key](value);
  }

  const loadSavedPHEifExist = async () => {
    const { value: storedPHELImit } = await Storage.get({ key: 'PHELimit' });
    const { value: storedMultiplier } = await Storage.get({ key: 'PHEMultiplier' });
    const { value: storedUnit } = await Storage.get({ key: 'Unit' });

    if (storedPHELImit) setDailyPHELimit(+storedPHELImit);
    if (storedMultiplier) setPHEMultiplier(+storedMultiplier);
    if (storedUnit) setUnit(storedUnit);
  }

  const saveData = async (key: string, value: any) => {
    setStateData(key, value);
    await Storage.set({
      key: key,
      value: `${value}`,
    });
  }

  useEffect(() => {
    loadSavedPHEifExist();
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem>
            <IonLabel>Set your daily PHE limit:</IonLabel>
          </IonItem>
          <IonItem>
            <IonRange pin={true} value={dailyPHELimit} min={10} step={10} max={5000} onIonChange={e => saveData("PHELimit", e.detail.value as number)} />
          </IonItem>
          <IonItem>
            <IonLabel>{dailyPHELimit} PHE</IonLabel>
          </IonItem>

          <IonItem>
            <IonSegment value={unit} onIonChange={e => saveData("Unit", e.detail.value)}>
              <IonSegmentButton value="protein">
                <IonLabel>Protein</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="PHE">
                <IonLabel>PHE</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonItem>

          {unit === "protein" ? (
            <>
              <IonItem>
                <IonLabel>PHE/Protein multiplier:</IonLabel>
              </IonItem>
              <IonItem>
                <IonRange pin={true} value={PHEMultiplier} min={20} step={1} max={64.5} onIonChange={e => saveData("PHEMultiplier", e.detail.value as number)} />
              </IonItem>
              <IonItem>
                <IonLabel>{PHEMultiplier}x <span style={{ float: "right", }}>(based on <a href="https://engineering.purdue.edu/brl/PKU/PheEst0.pdf" target="_blank">this article</a>)</span></IonLabel>
              </IonItem>
            </>
          ) : null}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
