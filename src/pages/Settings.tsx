import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonSegment,
  IonSegmentButton,
  IonRange,
  IonLabel,
} from '@ionic/react';
import { Storage } from '@capacitor/storage';
import { StateMap } from '../types/settings';
import { Units } from '../enums/enums';
import './Settings.css';

const Settings: React.FC = () => {
  const [dailyPHELimit, setDailyPHELimit] = useState(500);
  const [PHEMultiplier, setPHEMultiplier] = useState(45);
  const [unit, setUnit] = useState(Units.Protein);

  const stateSetters: StateMap = {
    PHELimit: setDailyPHELimit,
    PHEMultiplier: setPHEMultiplier,
    Unit: setUnit,
  };

  // Set data to state based on changed key
  const setStateData = (key: string, value: number|string) => stateSetters[key](value);

  // Load saved setting
  const loadSavedPHEifExist = async () => {
    const { value: storedPHELImit } = await Storage.get({ key: 'PHELimit' });
    const { value: storedMultiplier } = await Storage.get({ key: 'PHEMultiplier' });
    const { value: storedUnit } = await Storage.get({ key: 'Unit' });

    if (storedPHELImit) setDailyPHELimit(+storedPHELImit);
    if (storedMultiplier) setPHEMultiplier(+storedMultiplier);
    if (storedUnit) setUnit(storedUnit);
  };

  // Save changed data
  const saveData = async (key: string, value: number|string) => {
    setStateData(key, value);
    await Storage.set({
      key,
      value: `${value}`,
    });
  };

  useEffect(() => {
    loadSavedPHEifExist();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle data-cy="header-settings">Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle data-cy="header-settings" size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem>
            <IonLabel data-cy="phe-limit-label">Set your daily PHE limit:</IonLabel>
          </IonItem>
          <IonItem>
            <IonRange
              pin
              value={dailyPHELimit}
              min={10}
              step={10}
              max={5000}
              data-cy="phe-limit-input"
              onIonChange={(e) => saveData('PHELimit', e.detail.value as number)}
            />
          </IonItem>
          <IonItem>
            <IonLabel data-cy="phe-limit-selected-amount">
              {dailyPHELimit}
              {' '}
              PHE
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonSegment value={unit} onIonChange={(e) => saveData('Unit', e.detail.value as string)}>
              <IonSegmentButton data-cy="unit-segment-protein-button" value="protein">
                <IonLabel>Protein</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton data-cy="unit-segment-phe-button" value="PHE">
                <IonLabel>PHE</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonItem>

          {unit === 'protein' ? (
            <>
              <IonItem>
                <IonLabel data-cy="phe-multiplier-label">PHE/Protein multiplier:</IonLabel>
              </IonItem>
              <IonItem>
                <IonRange
                  pin
                  value={PHEMultiplier}
                  min={20}
                  step={1}
                  max={64.5}
                   data-cy="phe-multiplier-input"
                  onIonChange={(e) => saveData('PHEMultiplier', e.detail.value as number)}
                />
              </IonItem>
              <IonItem>
                <IonLabel data-cy="phe-multiplier-selected-amount">
                  {PHEMultiplier}
                  x
                  <span style={{ float: 'right' }}>
                    (based on
                    {' '}
                    <a href="https://engineering.purdue.edu/brl/PKU/PheEst0.pdf" target="_blank" rel="noreferrer">this article</a>
                    )
                  </span>
                </IonLabel>
              </IonItem>
            </>
          ) : null}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
