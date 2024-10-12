import { Avatar, Box, Card, Container, Flex, Heading, Link, Separator, Text } from '@radix-ui/themes';

const LinkedIn = () => {
  return (
    <Container
      size="1"
      px="5"
    >
      <Heading
        as="h1"
        size={{
          initial: '8',
          sm: '9',
        }}
        align="center"
        mt="3"
        mb="1"
      >
        LinkedIn
      </Heading>
      <Heading
        as="h2"
        size={{
          initial: '3',
          xs: '5',
        }}
        align="center"
      >
        Contact Card
      </Heading>
      <Separator
        size="4"
        my="5"
      />
      <Card style={{ gridRow: 'span 2' }}>
        <Flex
          direction="row"
          gap="2"
          justify="center"
        >
          <Avatar
            radius="medium"
            size="2"
            fallback={
              <Box
                width="15px"
                height="15px"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 2C0.447715 2 0 2.44772 0 3V12C0 12.5523 0.447715 13 1 13H14C14.5523 13 15 12.5523 15 12V3C15 2.44772 14.5523 2 14 2H1ZM1 3L14 3V3.92494C13.9174 3.92486 13.8338 3.94751 13.7589 3.99505L7.5 7.96703L1.24112 3.99505C1.16621 3.94751 1.0826 3.92486 1 3.92494V3ZM1 4.90797V12H14V4.90797L7.74112 8.87995C7.59394 8.97335 7.40606 8.97335 7.25888 8.87995L1 4.90797Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Box>
            }
          />
          <Flex
            flexGrow="1"
            direction="column"
            gap="2"
            minWidth="0"
          >
            <Text
              as="p"
              weight="bold"
              size="6"
            >
              Email
            </Text>
            <Text
              as="p"
              color="gray"
              size="4"
            >
              <Link href="mailto:hire.skye@chung.digital">hire.skye@chung.digital</Link>
            </Text>
          </Flex>
        </Flex>
      </Card>
      <Card
        style={{ gridRow: 'span 2' }}
        mt="3"
      >
        <Flex
          direction="row"
          gap="2"
          justify="center"
        >
          <Avatar
            radius="medium"
            size="2"
            fallback={
              <Box
                width="15px"
                height="15px"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 2.5C4 2.22386 4.22386 2 4.5 2H10.5C10.7761 2 11 2.22386 11 2.5V12.5C11 12.7761 10.7761 13 10.5 13H4.5C4.22386 13 4 12.7761 4 12.5V2.5ZM4.5 1C3.67157 1 3 1.67157 3 2.5V12.5C3 13.3284 3.67157 14 4.5 14H10.5C11.3284 14 12 13.3284 12 12.5V2.5C12 1.67157 11.3284 1 10.5 1H4.5ZM6 11.65C5.8067 11.65 5.65 11.8067 5.65 12C5.65 12.1933 5.8067 12.35 6 12.35H9C9.1933 12.35 9.35 12.1933 9.35 12C9.35 11.8067 9.1933 11.65 9 11.65H6Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Box>
            }
          />
          <Flex
            flexGrow="1"
            direction="column"
            gap="2"
            minWidth="0"
          >
            <Text
              as="p"
              weight="bold"
              size="6"
            >
              Mobile
            </Text>
            <Text
              as="p"
              color="gray"
              size="4"
            >
              <Link href="tel:0438961363">+61 438 961 363</Link>
            </Text>
          </Flex>
        </Flex>
      </Card>
    </Container>
  );
};

export default LinkedIn;
