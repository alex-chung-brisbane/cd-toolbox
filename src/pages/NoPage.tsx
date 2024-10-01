import { Heading, Text, Container } from '@radix-ui/themes';

import LostImage from '../res/404.svg';

const NoPage = () => {
  return (
    <Container
      size="1"
      px="5"
    >
      <Heading
        as="h1"
        size={{
          initial: '5',
          xs: '7',
          sm: '8',
          md: '9',
        }}
        align="center"
      >
        Error 404
      </Heading>
      <Text
        size="2"
        as="p"
        align="center"
        my="3"
      >
        Hmmm... Couldn't find the page you're looking for.
      </Text>
      <img
        src={LostImage}
        alt=""
        role="presentation"
        style={{ maxWidth: '100%', userSelect: 'none' }}
      />
      <Text
        size="2"
        as="p"
        align="center"
        my="3"
      >
        Maybe try the navigation menu (top right)?
      </Text>
    </Container>
  );
};

export default NoPage;
