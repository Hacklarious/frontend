import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Grid, Icon, Popup, Loader, Dimmer, Modal } from 'semantic-ui-react';
import { motion, useAnimation } from 'framer-motion';

import facts from './facts.json';
import styles from './App.module.css';

let factId = 0;
function Fact() {
  useEffect(() => {
    factId += 1;
    if (factId >= facts.length - 1) factId = 0;
  }, []);

  return facts[factId];
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [selectedPet, setSelectedPet] = useState({
    emoji: "🐹",
    color: "#defcf9",
  });
  const [animation, setAnimation] = useState('');
  const heartControls = useAnimation();
  const cookieControls = useAnimation();

  function runAnimation(action) {
    setAnimation(`animate__animated animate__${action}`);

    setTimeout(() => {
      setAnimation('');
    }, 1000);
  }

  async function onFeedClick() {
    await cookieControls.start({
      opacity: 1,
      y: -30,
    });
    await cookieControls.start({ y: 0 });
    await cookieControls.start({ y: -30 });
    runAnimation('bounce');
    await cookieControls.start({ y: 0, opacity: 0 });
  }

  async function onPetClick() {
    await heartControls.start(i => ({
      opacity: 1,
      y: -10,
      transition: {
        delay: i * 1.3,
      },
    }));
    await heartControls.start(i => ({
      y: 0,
      transition: {
        delay: i * 1.3,
      },
    }));
    await heartControls.start(i => ({
      y: -10,
      transition: {
        delay: i * 1.3,
      },
    }));

    await heartControls.start(i => ({
      opacity: 0,
      y: 0,
      transition: {
        delay: i * 1.3,
      },
    }));
    runAnimation('bounce');
  }

  async function onSetAlarmClick() {
    runAnimation('shakeY');
    setIsAlarmActive(true);
  }

  function onClickAlarmClock() {
    setIsAlarmActive(false);
  }

  async function onDadJokeClick() {
    setIsLoading(true);

    try {
      const { data } = await axios.get('http://api.very-unique-domain-name.tech:8002/dadjoke');
      setModalContent(data.results);
    } catch (e) { }

    setIsLoading(false);
  }

  async function onInsultClick() {
    setIsLoading(true);

    try {
      const { data } = await axios.get('http://api.very-unique-domain-name.tech:8002/insultme');
      setModalContent(data.results);
    } catch (e) { }

    setIsLoading(false);
  }

  async function onChuckNorrisClick() {
    setIsLoading(true);

    try {
      const { data } = await axios.get('http://api.very-unique-domain-name.tech:8002/chuck');
      setModalContent(data.results);
    } catch (e) { }

    setIsLoading(false);
  }

  return (
    <div className={styles.container}>
      <Modal open={!!modalContent} basic>
        <Modal.Content className={styles.centered}>{modalContent}</Modal.Content>
        <Modal.Actions className={styles.centered}>
          <Button basic color="red" onClick={() => setModalContent('')} inverted>
            <Icon name="remove" /> Close
          </Button>
        </Modal.Actions>
      </Modal>


      <div className={styles.petSelector}>
        <Button onClick={() => setSelectedPet({ emoji: "🐱", color: "#ffe8df" })}>🐱</Button>
        <Button onClick={() => setSelectedPet({ emoji: "🐰", color: "#58b4ae" })}>🐰</Button>
        <Button onClick={() => setSelectedPet({ emoji: "🐶", color: "#7d5a5a" })}>🐶</Button>
        <Button onClick={() => setSelectedPet({ emoji: "🐹", color: "#defcf9" })}>🐹</Button>
      </div>

      <header className={styles.header} style={{ backgroundColor: selectedPet.color }}>
        <div className={styles.emojiContainer}>
          <motion.div className={styles.heart} animate={heartControls}>❤️</motion.div>

          <motion.div
            onClick={onClickAlarmClock}
            initial={{ scale: 0, x: 100 }}
            animate={{ scale: isAlarmActive ? 3 : 0 }}
            transition={{ yoyo: isAlarmActive ? Infinity : false }}
            className={styles.alarm}>
            ⏰
          </motion.div>

          <Dimmer active={isLoading}>
            <Loader />
          </Dimmer>

          <Popup
            trigger={<div className={[styles.petContainer, animation].join(' ')}>{selectedPet.emoji}</div>}
            content={<Fact />}
            inverted
            position="top center"
          />
          <motion.div className={styles.cookie} animate={cookieControls}>🍪</motion.div>
        </div>

        <Grid centered padded={false} className={styles.buttonContainer}>
          <Grid.Row>
            <Button size="large" icon labelPosition="right" className={styles.button} onClick={onFeedClick}>
              Feed
              <Icon name="food" />
            </Button>
            <Button size="large" icon labelPosition="right" className={styles.button} onClick={onPetClick}>
              Pet
              <Icon name="like" />
            </Button>
          </Grid.Row>
          <Grid.Row>
            <Button.Group size="large">
              <Button className={styles.button} onClick={onDadJokeClick}>Dad joke</Button>
              <Button.Or />
              <Button className={styles.button} onClick={onInsultClick}>Insult me</Button>
              <Button.Or />
              <Button className={styles.button} onClick={onChuckNorrisClick}>Chuck Norris joke</Button>
            </Button.Group>
          </Grid.Row>
          <Grid.Row>
            <Button size="large" className={styles.button} onClick={onSetAlarmClick}>Set Alarm clock</Button>
          </Grid.Row>
        </Grid>
      </header>
    </div>
  );
}

export default App;
