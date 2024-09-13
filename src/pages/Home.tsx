import { Avatar, Badge, Box, Callout, Em, Flex, Heading, HoverCard, Link, Section, Separator, Strong, Text } from '@radix-ui/themes';

import { GitHubLogoIcon } from '@radix-ui/react-icons';
import CatImg from '../res/cat.svg';
import UsageImg from '../res/usage.svg';
import PrivacyImg from '../res/privacy.svg';
import ProfileImg from '../res/pfp.jpeg';

const Home = () => {
  return (
    <Box
      maxWidth="700px"
      mx="auto"
    >
      <Heading
        as="h1"
        size="7"
      >
        Welcome to CD Toolbox
      </Heading>
      <Section>
        <Flex
          direction={{ initial: 'column-reverse', xs: 'row' }}
          gapX="5"
          gapY="3"
          justify="between"
          align="center"
        >
          <Box>
            <Heading as="h2">About</Heading>
            <Text
              as="p"
              my="2"
            >
              Hi! You've stumbled upon{' '}
              <HoverCard.Root>
                <HoverCard.Trigger>
                  <Badge
                    variant="outline"
                    color="gray"
                    radius="small"
                  >
                    my
                  </Badge>
                </HoverCard.Trigger>
                <HoverCard.Content maxWidth="250px">
                  <Flex gap="4">
                    <Avatar
                      size="3"
                      fallback="S"
                      radius="full"
                      src={ProfileImg}
                    />
                    <Box>
                      <Heading
                        size="3"
                        as="h3"
                      >
                        Skye
                      </Heading>
                      <Text
                        as="div"
                        size="2"
                        color="gray"
                        mb="2"
                      >
                        Web developer
                      </Text>
                      <Flex
                        direction="row"
                        gap="1"
                        wrap="wrap"
                      >
                        <Badge>C#</Badge>
                        <Badge>Python</Badge>
                        <Badge>HTML/CSS</Badge>
                        <Badge>TailwindCSS</Badge>
                        <Badge>JSX/TSX</Badge>
                        <Badge>React</Badge>
                        <Badge>Chrome MV3</Badge>
                      </Flex>
                      <Box pt="2">
                        <Separator
                          size="4"
                          my="2"
                        />
                        <Link
                          href="/contact"
                          size="1"
                        >
                          Contact details
                        </Link>
                      </Box>
                    </Box>
                  </Flex>
                </HoverCard.Content>
              </HoverCard.Root>{' '}
              little corner of the web. Stay a while. 🎉
            </Text>
            <Text
              as="p"
              my="2"
            >
              CD Toolbox hosts a range of useful tools and miscellaneous side-quests.
            </Text>
          </Box>
          <Box
            width={{ initial: '60%', xs: '40%' }}
            flexShrink="0"
          >
            <img
              src={CatImg}
              alt=""
              role="presentation"
              style={{ width: '100%', opacity: '0.75' }}
            />
          </Box>
        </Flex>
      </Section>
      <Section>
        <Flex
          direction={{ initial: 'column', xs: 'row' }}
          gapX="5"
          gapY="3"
          justify="between"
          align="center"
        >
          <Box
            width={{ initial: '60%', xs: '40%' }}
            flexShrink="0"
          >
            <img
              src={UsageImg}
              alt=""
              role="presentation"
              style={{ width: '100%', opacity: '0.75' }}
            />
          </Box>
          <Box>
            <Heading as="h2">Usage</Heading>
            <Text
              as="p"
              my="2"
            >
              You can use the tools you find on this site and their outputs for any purpose (as long as that purpose is legal 💕). No attribution required.
            </Text>
            <Text
              as="p"
              my="2"
              size="1"
              color="gray"
            >
              These tools are provided without warranty. While I will <Em>probably</Em> provide support, I won't guarantee it. The tools available may change at any time without prior notice.
            </Text>
          </Box>
        </Flex>
      </Section>
      <Section>
        <Flex
          direction={{ initial: 'column-reverse', xs: 'row' }}
          gapX="5"
          gapY="3"
          justify="between"
          align="center"
        >
          <Box>
            <Heading as="h2">Privacy</Heading>
            <Text
              as="p"
              my="2"
            >
              Your privacy is important! Nothing you input into, or output from, the pages of this site is ever sent back to the server.
            </Text>
            <Text
              as="p"
              my="2"
            >
              <Strong>No cookies. No ads.</Strong>
            </Text>
          </Box>
          <Box
            width={{ initial: '60%', xs: '40%' }}
            flexShrink="0"
          >
            <img
              src={PrivacyImg}
              alt=""
              role="presentation"
              style={{ width: '100%', opacity: '0.75' }}
            />
          </Box>
        </Flex>
      </Section>
      <Callout.Root variant="surface">
        <Callout.Icon>
          <GitHubLogoIcon />
        </Callout.Icon>
        <Callout.Text>
          This site's source code is available on{' '}
          <Link
            target="_blank"
            href="https://github.com/alex-chung-brisbane/cd-toolbox"
          >
            GitHub
          </Link>
          .
        </Callout.Text>
      </Callout.Root>
    </Box>
  );
};

export default Home;
