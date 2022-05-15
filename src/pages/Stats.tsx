import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText } from '@ionic/react';
import './Stats.css';

const Stats: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Stats</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Stats</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="stats_error_message">
          <h2>Stats</h2>
          <IonText color="danger">
            <p>Stats are not available now, it will be added in later versions.</p>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Stats;
