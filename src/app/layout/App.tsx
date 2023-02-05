import React, { useEffect, useState } from 'react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';

function App() {
  const [activities, SetActivities] = useState<Activity[]>([]);
  const [selectedActivity, SetSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false); 

  useEffect(() => {
    agent.Activities.list().then(response => {
      SetActivities(response);
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

function handleCreateOrEditActivity(activity: Activity) {
  activity.id
    ? SetActivities([...activities.filter(x => x.id !== activity.id), activity])
    : SetActivities([...activities, {...activity, id: uuid()}]); 
    setEditMode(false);
    SetSelectedActivity(activity);
}

function handleDeleteActivity(id: string) {
  SetActivities([...activities.filter(x => x.id !== id)]);
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
            createOrEdit={handleCreateOrEditActivity}
            deleteActivity={handleDeleteActivity}
             />
        </Container>
        </>
  );
}

export default App;
