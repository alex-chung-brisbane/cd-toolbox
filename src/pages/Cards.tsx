import { Box, Callout, Card, Container, Flex, Grid, ScrollArea, Slider, Text } from '@radix-ui/themes';
import { useId, useState } from 'react';

import { RotateCounterClockwiseIcon } from '@radix-ui/react-icons';

import './Cards.css';

const Cards = () => {
  let [cardCount, setCardCount] = useState([6]);

  return (
    <Container size="4">
      <Callout.Root
        size="1"
        mt="1"
        mb="6"
      >
        <Callout.Icon>
          <RotateCounterClockwiseIcon />
        </Callout.Icon>
        <Callout.Text>This demo is best viewed on a device with a cursor (to get the full animations)!</Callout.Text>
      </Callout.Root>
      <Grid
        as="div"
        className="cards-wrapper"
        position="relative"
        columns="minmax(0, 1fr)"
        rows="calc(var(--card-height) + var(--card-interaction-height) + var(--space-4))"
        py="10dvh"
        px={{ initial: '1', sm: '8' }}
        align="end"
        justify="center"
      >
        <ScrollArea
          type="hover"
          scrollbars="horizontal"
        >
          <Flex
            as="div"
            width="100%"
            height="100%"
            direction="row"
            align="end"
            justify="center"
            pb="4"
          >
            {Array(cardCount[0])
              .fill(null)
              .map((v, i) => {
                return <CardSlot key={i} />;
              })}
          </Flex>
        </ScrollArea>
      </Grid>
      <Card mt="3">
        <Flex
          as="div"
          direction="row"
          gap="2"
          wrap="wrap"
          align="center"
        >
          <Text
            as="label"
            htmlFor="card-count"
          >
            Card count: {cardCount}
          </Text>
          <Slider
            value={cardCount}
            id="card-count"
            onValueChange={setCardCount}
            style={{ width: 'auto', minWidth: '80px' }}
            variant="soft"
            min={1}
            max={15}
          />
        </Flex>
      </Card>
    </Container>
  );
};

export default Cards;

const CardSlot = () => {
  return (
    <Box
      className="card-wrapper"
      position="relative"
      width="calc(var(--card-width) + var(--space-4))"
      height="var(--card-height)"
    >
      <Card asChild>
        <Box
          as="div"
          position="absolute"
          className="card"
          width="var(--card-width)"
          height="var(--card-height)"
          left="var(--space-2)"
        >
          Card
        </Box>
      </Card>
    </Box>
  );
};
