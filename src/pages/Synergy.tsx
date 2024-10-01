import { IconButton, TextField, AccessibleIcon, Tooltip, SegmentedControl, Text, Flex, Box, Button, Callout, Dialog, Code, Kbd, Container } from '@radix-ui/themes';
import { useRef, useState } from 'react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { hex_md5 } from './lib_synergy/md5';

import { EyeClosedIcon, EyeOpenIcon, MagicWandIcon, RocketIcon, InfoCircledIcon } from '@radix-ui/react-icons';

import 'react-toastify/dist/ReactToastify.css';

const Synergy = () => {
  let [masterKeyVisible, setMasterKeyVisible] = useState(false);
  let [outputTarget, setOutputTarget] = useState('clipboard');
  let [outputKey, setOutputKey] = useState('');
  let identifierKeyInputRef = useRef(null);
  let masterKeyInputRef = useRef(null);

  let copyButtonDebounce = false;

  return (
    <Container size="1">
      <Flex
        direction="column"
        gap="3"
      >
        <Callout.Root variant="surface">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>Hi, user. You should not trust a random website with your passwords.</Callout.Text>
        </Callout.Root>
        <TextField.Root
          placeholder="Website / Identifier"
          size="3"
          ref={identifierKeyInputRef}
        >
          <TextField.Slot>
            <RocketIcon
              height="16"
              width="16"
            />
          </TextField.Slot>
        </TextField.Root>
        <Flex
          direction="row"
          gap="3"
          wrap="wrap"
          align="center"
        >
          <TextField.Root
            placeholder="Master key"
            size="3"
            ref={masterKeyInputRef}
            style={{ flexGrow: '1' }}
            type={masterKeyVisible ? 'text' : 'password'}
          >
            <TextField.Slot>
              <MagicWandIcon
                height="16"
                width="16"
              />
            </TextField.Slot>
            <TextField.Slot pr="3">
              <Tooltip
                content={
                  masterKeyVisible ? (
                    <>
                      Hide password <Kbd ml="1">Access + S</Kbd>
                    </>
                  ) : (
                    <>
                      Show password <Kbd ml="1">Access + S</Kbd>
                    </>
                  )
                }
              >
                <IconButton
                  size="2"
                  variant="ghost"
                  aria-checked={masterKeyVisible ? 'true' : 'false'}
                  onClick={() => {
                    setMasterKeyVisible(!masterKeyVisible);
                  }}
                  tabIndex={-1}
                  accessKey="s"
                >
                  <AccessibleIcon label={'Toggle password visibility'}>
                    {masterKeyVisible ? (
                      <EyeOpenIcon
                        height="16"
                        width="16"
                      />
                    ) : (
                      <EyeClosedIcon
                        height="16"
                        width="16"
                      />
                    )}
                  </AccessibleIcon>
                </IconButton>
              </Tooltip>
            </TextField.Slot>
          </TextField.Root>
          {outputTarget === 'clipboard' ? (
            <>
              <Button
                variant="solid"
                size="2"
                accessKey="g"
                style={{ flexGrow: '1' }}
                onClick={() => {
                  if (copyButtonDebounce) return;
                  if (identifierKeyInputRef && masterKeyInputRef)
                    navigator.clipboard.writeText(GenerateOutputKey(identifierKeyInputRef.current, masterKeyInputRef.current)).then(() => {
                      copyButtonDebounce = true;
                      ShowCopyConfirmation();
                      setTimeout(() => {
                        copyButtonDebounce = false;
                      }, 3500);
                    });
                }}
              >
                Generate
              </Button>
              <ToastContainer limit={1} />
            </>
          ) : (
            <>
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button
                    variant="solid"
                    size="2"
                    accessKey="g"
                    style={{ flexGrow: '1' }}
                    onClick={() => {
                      if (identifierKeyInputRef && masterKeyInputRef) setOutputKey(GenerateOutputKey(identifierKeyInputRef.current, masterKeyInputRef.current));
                    }}
                  >
                    Generate
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content maxWidth="320px">
                  <Dialog.Title>Your key</Dialog.Title>
                  <Dialog.Description
                    size="2"
                    mb="4"
                  >
                    <Code size="4">{outputKey}</Code>
                  </Dialog.Description>
                  <Flex
                    gap="3"
                    mt="4"
                    justify="end"
                  >
                    <Dialog.Close>
                      <Button
                        variant="soft"
                        color="gray"
                      >
                        Done
                      </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(outputKey).then(ShowCopyConfirmation);
                        }}
                      >
                        Copy
                      </Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
              <ToastContainer />
            </>
          )}
        </Flex>
        <Flex
          direction="row"
          gapX="3"
          gapY="1"
          align="center"
          wrap="wrap"
          justify="center"
        >
          <Text as="label">Output to:</Text>
          <SegmentedControl.Root
            radius="large"
            defaultValue="clipboard"
            onValueChange={(newValue) => {
              setOutputTarget(newValue);
            }}
          >
            <SegmentedControl.Item
              value="clipboard"
              accessKey="c"
            >
              Clipboard
            </SegmentedControl.Item>
            <SegmentedControl.Item
              value="dialog"
              accessKey="d"
            >
              Dialog box
            </SegmentedControl.Item>
          </SegmentedControl.Root>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Synergy;

function GenerateOutputKey(identifierKey: Element | null, masterKey: Element | null): string {
  if (!identifierKey || !masterKey) throw new Error('Unable to get identifier or key values from input elements.');

  let identifierVal: string = (identifierKey as HTMLInputElement).value;
  let keyVal: string = (masterKey as HTMLInputElement).value;

  (masterKey as HTMLInputElement).value = '';

  return `!SYN?${hex_md5(keyVal + identifierVal).substring(7, 19)}`;
}

function ShowCopyConfirmation() {
  toast.success('Copied to clipboard!', {
    position: 'bottom-center',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: 'dark',
    transition: Bounce,
  });
}
