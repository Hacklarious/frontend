import React, { useEffect, useState } from 'react';
import { Button, Grid, Card, List, Placeholder } from 'semantic-ui-react';
import axios from 'axios';
import moment from 'moment';
import TimePicker from 'react-time-picker';

import styles from './App.module.css';

const API_URL = 'http://api.very-unique-domain-name.tech:8002';

function AlarmModal(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(true);
  const [value, setValue] = useState('10:20');
  const [alarmList, setAlarmList] = useState([]);

  async function create() {
    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/setalarm`, {
        alarm: moment(value, "HH:mm").unix(),
      });
    } catch (e) {}

    setIsLoading(false);
    props.onCreated();
  }

  async function onClockChange(time) {
    setValue(time);
  }

  useEffect(() => {
    (async function() {
      try {
        const { data } = await axios.post(`${API_URL}/getalarm`);
        setAlarmList(data.times.slice(0, 5));
      } catch (e) {}

      setIsListLoading(false);
    })();
  }, []);

  return (
    <Grid columns={2}>
      <Grid.Column>
        <h2>Create a new alarm clock</h2>
        <TimePicker value={value} onChange={onClockChange} clearIcon={null} className={styles.timepicker} />
        <br />
        <Button primary onClick={create} loading={isLoading}>Create</Button>
      </Grid.Column>

      <Grid.Column>
        <h2>Existing Alarms</h2>

        <Card color="grey" centered>
          <Card.Content>
            {isListLoading && <Placeholder fluid><Placeholder.Image /></Placeholder>}

            {!isListLoading && <List className={styles.alarmList}>
              {alarmList.map((alarm) => (
                <List.Item key={alarm}>
                  <List.Icon>⏰</List.Icon>
                  <List.Content>{moment.unix(alarm).format('HH:mm')}</List.Content>
                </List.Item>
              ))}
            </List>}
          </Card.Content>
        </Card>

      </Grid.Column>
    </Grid>
  );
}

export default AlarmModal;
