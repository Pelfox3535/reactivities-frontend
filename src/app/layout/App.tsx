import React, { useEffect, useState } from 'react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite'

function App() {
  const {activityStore} = useStore();

  const [activities, SetActivities] = useState<Activity[]>([]);
  const [selectedActivity, SetSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);  

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore])

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
  setSubmitting(true);
  if(activity.id) { 
    agent.Activities.update(activity).then(() => {
      SetActivities([...activities.filter(x => x.id !== activity.id), activity])
      SetSelectedActivity(activity);
      setEditMode(false);
      setSubmitting(false);
    })
  } else {
    activity.id = uuid();
    agent.Activities.create(activity).then(() => {
      SetActivities([...activities, activity]);
      SetSelectedActivity(activity);
      setEditMode(false);
      setSubmitting(false)
    });
  }
}

function handleDeleteActivity(id: string) {
  setSubmitting(true);
  agent.Activities.delete(id).then(() => {
    SetActivities([...activities.filter(x => x.id !== id)]);
    setSubmitting(false);
  })
}

  return (
      <>
        <NavBar openForm={handleFormOpen}/>
        <Container style={{marginTop: '7em'}}>         
          <ActivityDashboard 
            activities={activityStore.activities}
            selectedActivity={selectedActivity}
            selectActivity={handleSelectActivity}
            cancelSelectActivity={handleCancelActivity}
            editMode={editMode}
            openForm={handleFormOpen}
            closeForm={handleFormClose}
            createOrEdit={handleCreateOrEditActivity}
            deleteActivity={handleDeleteActivity}
            submitting={submitting}
          />
        </Container>
        </>
  );
}

export default observer(App);
