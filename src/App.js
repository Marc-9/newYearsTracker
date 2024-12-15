// src/App.js
import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useLocalStorage } from './useLocalStorage';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #121212;
    color: white;
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
`;

const AppWrapper = styled.div`
  padding: 20px;
  text-align: center;
`;

const Button = styled.button`
  background-color: #333;
  color: white;
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

const ActivityInput = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  width: 200px;
`;

const TimerText = styled.div`
  font-size: 24px;
  margin: 20px;
`;

function App() {
  const [activities, setActivities] = useLocalStorage('activities', []);
  const [newActivity, setNewActivity] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [manualTime, setManualTime] = useState(0);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Handle activity addition
  const handleAddActivity = () => {
    if (newActivity && !activities.find(a => a.name === newActivity)) {
      setActivities([...activities, { name: newActivity, totalTime: 0, logs: [] }]);
      setNewActivity('');
    }
  };

  // Handle selecting an activity and starting the timer
  const handleSelectActivity = (activityName) => {
    setSelectedActivity(activityName);
  };

  // Handle stop timer
  const handleStopTimer = () => {
    if (selectedActivity !== null) {
      setActivities(activities.map(activity =>
        activity.name === selectedActivity
          ? { ...activity, totalTime: activity.totalTime + timer }
          : activity
      ));
    }
    setTimer(0);
    setIsRunning(false);
  };

  // Handle adding manual time
  const handleAddManualTime = () => {
    if (selectedActivity !== null && manualTime > 0) {
      setActivities(activities.map(activity =>
        activity.name === selectedActivity
          ? { ...activity, totalTime: activity.totalTime + manualTime }
          : activity
      ));
    }
    setManualTime(0);
  };

  return (
    <AppWrapper>
      <GlobalStyle />
      <h1>Time Tracker</h1>

      <ActivityInput
        type="text"
        value={newActivity}
        onChange={(e) => setNewActivity(e.target.value)}
        placeholder="Enter new activity"
      />
      <Button onClick={handleAddActivity}>Add Activity</Button>

      <div>
        <h2>Activities</h2>
        <ul>
          {activities.map((activity, index) => (
            <li key={index}>
              <Button onClick={() => handleSelectActivity(activity.name)}>
                {activity.name}
              </Button>
              <p>Time Spent: {activity.totalTime} seconds</p>
            </li>
          ))}
        </ul>
      </div>

      {selectedActivity && (
        <>
          <h3>Tracking: {selectedActivity}</h3>
          <TimerText>{timer} seconds</TimerText>
          <Button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? "Pause Timer" : "Start Timer"}
          </Button>
          <Button onClick={handleStopTimer}>Stop Timer</Button>

          <div>
            <h4>Manually Add Time</h4>
            <input
              type="number"
              value={manualTime}
              onChange={(e) => setManualTime(Number(e.target.value))}
              placeholder="Enter seconds"
            />
            <Button onClick={handleAddManualTime}>Add Time</Button>
          </div>
        </>
      )}
    </AppWrapper>
  );
}

export default App;
