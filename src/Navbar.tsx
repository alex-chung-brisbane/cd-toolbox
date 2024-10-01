import { Flex, Heading, Link, Button, DropdownMenu, AccessibleIcon } from '@radix-ui/themes';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

const Navbar = () => {
  return (
    <Flex
      direction="row"
      align="center"
      justify={{
        initial: 'center',
        xs: 'between',
      }}
      px="1"
      gapX="5"
      gapY="1"
      wrap="wrap"
    >
      <Heading
        as="h1"
        m="0"
        weight="bold"
        size="5"
        align="center"
      >
        CD Toolbox
      </Heading>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft">
            <AccessibleIcon label="Menu">
              <HamburgerMenuIcon />
            </AccessibleIcon>
            <DropdownMenu.TriggerIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content variant="soft">
          <DropdownMenu.Item asChild>
            <Link href="/">Home</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link href="/contact">Contact</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Label>Tools</DropdownMenu.Label>
          <DropdownMenu.Item asChild>
            <Link href="/synergy">Synergy</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link href="/instructify">Instructify</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link href="/filetree">Filetree</Link>
          </DropdownMenu.Item>
          <DropdownMenu.Label>Demos</DropdownMenu.Label>
          <DropdownMenu.Item asChild>
            <Link href="/cards">Cards</Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  );
};

export default Navbar;
