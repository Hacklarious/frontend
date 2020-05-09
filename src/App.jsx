import React, { useState } from 'react';
import { Button, Grid, Icon } from 'semantic-ui-react';
import { motion, useAnimation } from 'framer-motion';

import styles from './App.module.css';

function App() {
  const [selectedPet, setSelectedPet] = useState({
    emoji: "🐹",
    color: "#defcf9",
  });
  const [animation, setAnimation] = useState('');
  const heartControls = useAnimation();

  function runAnimation(action) {
    setAnimation(`animate__animated animate__${action}`);

    setTimeout(() => {
      setAnimation('');
    }, 1000);
  }

  function onFeedClick() {
    runAnimation('bounce');
  }

  async function onPetClick() {
    await heartControls.start(i => ({
      opacity: 1,
      y: 10,
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
      y: 10,
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
  }

  function onSetAlarmClick() {
    runAnimation('shakeY');
  }

  return (
    <div className={styles.container}>
      <div className={styles.petSelector}>
        <Button color="white" onClick={() => setSelectedPet({ emoji: "🐱", color: "#ffe8df" })}>🐱</Button>
        <Button onClick={() => setSelectedPet({ emoji: "🐰", color: "#58b4ae" })}>🐰</Button>
        <Button onClick={() => setSelectedPet({ emoji: "🐶", color: "#7d5a5a" })}>🐶</Button>
        <Button onClick={() => setSelectedPet({ emoji: "🐹", color: "#defcf9" })}>🐹</Button>
      </div>

      <header className={styles.header} style={{'background-color': selectedPet.color}}>
        <div classname={styles.emojiContainer}>
          <motion.div className={styles.heart} animate={heartControls}>❤️</motion.div>
          <div className={[styles.petContainer, animation].join(' ')}>{selectedPet.emoji}</div>
        </div>

        <Grid centered padded={false}>
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
            <Button size="large" className={styles.button} onClick={onSetAlarmClick}>Set Alarm clock</Button>
          </Grid.Row>
        </Grid>
      </header>
    </div>
  );
}

export default App;
