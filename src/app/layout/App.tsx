import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../activities/dashboard/ActivityDashboard';

function App() {
  const [activities, SetActivities] = useState<Activity[]>([]);
  const [selectedActivity, SetSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false); 

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
      SetActivities(response.data);
    })
  }, [])

function handleSelectActivity(id: string) {
  SetSelectedActivity(activities.find(x => x.id === id));
}

function handleCancelActivity() {
  SetSelectedActivity(undefined);
}

function handleFormOpen(id?: string) {
  id ? handleSelectActivity(id) : handleCancelActivity();
  setEditMode(true);
}

function handleFormClose(id?: string) {
  setEditMode(false);
}

  return (
      <>
        <NavBar openForm={handleFormOpen}/>
        <Container style={{marginTop: '7em'}}>
          <ActivityDashboard 
            activities={activities}
            selectedActivity={selectedActivity}
            selectActivity={handleSelectActivity}
            cancelSelectActivity={handleCancelActivity}
            editMode={editMode}
            openForm={handleFormOpen}
            closeForm={handleFormClose}
             />
        </Container>
        </>
  );
}

export default App;
