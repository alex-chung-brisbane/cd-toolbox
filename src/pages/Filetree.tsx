import { Grid, Section, TextArea, Heading, Popover, Button, Flex, ScrollArea, Box, Badge, Text, Separator, Code, Table, AccessibleIcon, Spinner, VisuallyHidden, Switch, Em, Container } from '@radix-ui/themes';
import { useRef, useState } from 'react';

import { QuestionMarkCircledIcon, CopyIcon, ExclamationTriangleIcon, CaretDownIcon, CaretRightIcon, FileIcon, ImageIcon, VideoIcon, CodeIcon, LockOpen1Icon, LockClosedIcon, EyeNoneIcon, EyeOpenIcon, Link2Icon, StarFilledIcon, QuestionMarkIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons';

interface BranchProps {
  indent: number;
  icon: typeof CaretDownIcon;
  isStarred: boolean;
  isLocked: boolean | null;
  isHidden: boolean | null;
  name: string;
}

enum CopyASCIIOutputButtonStates {
  ready,
  loading,
  done,
  error,
}

const Filetree = () => {
  let [tree, setTree] = useState([] as BranchProps[]);
  let [copyASCIIOutputButtonState, setCopyASCIIOutputButtonState] = useState(CopyASCIIOutputButtonStates.ready);
  let [showIndentLines, setShowIndentLines] = useState(true);
  let copyASCIIOutputButtonRef = useRef(null);

  return (
    <Container size="4">
      <Grid
        columns={{ initial: '1', sm: '2' }}
        gap="3"
        rows={{ initial: 'repeat(3, auto)', sm: 'repeat(2, auto)' }}
        width="auto"
        height="100%"
      >
        <Section
          py="0"
          gridColumn={{ sm: 'span 2' }}
        >
          <Flex
            direction="row"
            align="baseline"
            justify="between"
            wrap="wrap"
            gap="2"
            mb="2"
          >
            <Heading as="h2">Input</Heading>
            <Popover.Root>
              <Popover.Trigger>
                <Button
                  variant="soft"
                  size="1"
                  accessKey="h"
                >
                  <QuestionMarkCircledIcon
                    width="16"
                    height="16"
                  />
                  Help
                </Button>
              </Popover.Trigger>
              <Popover.Content maxWidth="80dvw">
                <HelpMenu />
              </Popover.Content>
            </Popover.Root>
          </Flex>
          <TextArea
            placeholder="Describe file structure"
            size="3"
            resize="vertical"
            rows={6}
            variant="soft"
            onInput={(ev) => {
              const inputBlob = (ev.target as HTMLTextAreaElement).value;
              const parseInputBlobRe = /^([0-9]+)\|(fc|fo|file|img|vid|code|link)\|(starred)?\|?(locked|unlocked)?\|?(visible|hidden)?\|?(.*?)$/gm;
              setTree(
                Array.from(inputBlob.matchAll(parseInputBlobRe)).map((matchedInputBranch) => {
                  return {
                    indent: parseInt(matchedInputBranch[1]),
                    icon: (() => {
                      switch (matchedInputBranch[2]) {
                        case 'fc':
                          return CaretRightIcon;
                        case 'fo':
                          return CaretDownIcon;
                        case 'file':
                          return FileIcon;
                        case 'img':
                          return ImageIcon;
                        case 'vid':
                          return VideoIcon;
                        case 'code':
                          return CodeIcon;
                        case 'link':
                          return Link2Icon;
                        default:
                          return QuestionMarkIcon;
                      }
                    })(),
                    isStarred: matchedInputBranch[3] === 'starred',
                    isLocked: matchedInputBranch[4] == undefined ? null : matchedInputBranch[4] === 'locked',
                    isHidden: matchedInputBranch[5] == undefined ? null : matchedInputBranch[5] === 'hidden',
                    name: matchedInputBranch[6],
                  };
                })
              );
            }}
          />
        </Section>
        <Section
          py="0"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <Heading
            as="h2"
            mb="2"
          >
            Visual
          </Heading>
          <ScrollArea
            type="always"
            scrollbars="horizontal"
            style={{ backgroundImage: 'linear-gradient(var(--gray-a2), var(--gray-a2))', borderRadius: 'var(--radius-2)' }}
          >
            <Box
              p="2"
              pb="4"
            >
              <Flex
                direction="column"
                minWidth="max-content"
                gap="1"
              >
                {tree.map((treeItem, index) => {
                  return (
                    <Flex
                      key={index}
                      direction="row"
                      align="center"
                      wrap="nowrap"
                      style={{ alignItems: 'stretch' }}
                    >
                      <VisuallyHidden>Indent level: {treeItem.indent}</VisuallyHidden>
                      {Array.apply(null, Array(treeItem.indent)).map((v, i) => {
                        return (
                          <Box
                            key={i}
                            as="div"
                            width="1.8em"
                            ml="0.2em"
                            style={(() => {
                              if (showIndentLines) return { borderLeft: '1px solid var(--accent-a11)' };
                            })()}
                          ></Box>
                        );
                      })}
                      <Badge
                        size="3"
                        radius="small"
                        style={{ width: 'max-content' }}
                      >
                        <treeItem.icon
                          width="16"
                          height="16"
                        />
                        {treeItem.name}
                        {treeItem.isStarred === true || treeItem.isLocked !== null || treeItem.isHidden !== null ? (
                          <Badge
                            size="2"
                            radius="full"
                            color="red"
                          >
                            {treeItem.isStarred && (
                              <StarFilledIcon
                                width="12"
                                height="12"
                              />
                            )}
                            {treeItem.isLocked !== null ? (
                              treeItem.isLocked === true ? (
                                <LockClosedIcon
                                  width="12"
                                  height="12"
                                />
                              ) : (
                                <LockOpen1Icon
                                  width="12"
                                  height="12"
                                />
                              )
                            ) : (
                              <></>
                            )}
                            {treeItem.isHidden !== null ? (
                              treeItem.isHidden === true ? (
                                <EyeNoneIcon
                                  width="12"
                                  height="12"
                                />
                              ) : (
                                <EyeOpenIcon
                                  width="12"
                                  height="12"
                                />
                              )
                            ) : (
                              <></>
                            )}
                          </Badge>
                        ) : (
                          <></>
                        )}
                      </Badge>
                    </Flex>
                  );
                })}
              </Flex>
            </Box>
          </ScrollArea>
          <Flex
            direction="row"
            wrap="wrap"
            gap="2"
            align="center"
            my="1"
          >
            <Switch
              variant="soft"
              id="toggle-indent-lines"
              accessKey="l"
              size="1"
              onCheckedChange={(value) => {
                setShowIndentLines(value);
              }}
              defaultChecked
            />
            <Text
              as="label"
              htmlFor="toggle-indent-lines"
              size="2"
            >
              Show indent lines
            </Text>
          </Flex>
        </Section>
        <Section
          py="0"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <Flex
            direction="row"
            align="baseline"
            justify="between"
            wrap="wrap"
            gap="2"
            mb="2"
          >
            <Heading as="h2">ASCII</Heading>
            <Button
              variant="soft"
              size="1"
              accessKey="c"
              onClick={() => {
                setCopyASCIIOutputButtonState(CopyASCIIOutputButtonStates.loading);
                navigator.clipboard
                  .writeText((copyASCIIOutputButtonRef.current as unknown as HTMLTextAreaElement).value)
                  .then(() => {
                    setCopyASCIIOutputButtonState(CopyASCIIOutputButtonStates.done);
                    setTimeout(() => {
                      setCopyASCIIOutputButtonState(CopyASCIIOutputButtonStates.ready);
                    }, 1000);
                  })
                  .catch(() => {
                    setCopyASCIIOutputButtonState(CopyASCIIOutputButtonStates.error);
                  });
              }}
            >
              {(() => {
                switch (copyASCIIOutputButtonState) {
                  case CopyASCIIOutputButtonStates.ready:
                    return (
                      <CopyIcon
                        width="16"
                        height="16"
                      />
                    );
                  case CopyASCIIOutputButtonStates.loading:
                    return <Spinner />;
                  case CopyASCIIOutputButtonStates.done:
                    return (
                      <CheckIcon
                        width="16"
                        height="16"
                      />
                    );
                  case CopyASCIIOutputButtonStates.error:
                    return (
                      <ExclamationTriangleIcon
                        width="16"
                        height="16"
                      />
                    );
                }
              })()}
              Copy to clipboard
            </Button>
          </Flex>
          <TextArea
            size="2"
            resize="vertical"
            rows={10}
            ref={copyASCIIOutputButtonRef}
            value={tree
              .map((branch, branchIndex, branches) => {
                function isLastIndentLevel(indent: number): boolean {
                  for (let i = branchIndex + 1; i < branches.length; i++) {
                    if (branches[i].indent === indent) return false;
                    if (branches[i].indent < indent) return true;
                  }
                  return true;
                }

                let lineASCII = '';
                for (let i = 0; i < branch.indent; i++) {
                  switch (i) {
                    case branch.indent - 1:
                      lineASCII += isLastIndentLevel(branch.indent) ? '┗━ ' : '┣━ ';
                      break;
                    default:
                      lineASCII += isLastIndentLevel(i + 1) ? '   ' : '┃  ';
                      break;
                  }
                }
                lineASCII += branch.name;
                if (branch.icon === CaretDownIcon || branch.icon === CaretRightIcon) lineASCII += ' /';
                return lineASCII;
              })
              .join('\n')}
            style={{ fontFamily: 'var(--code-font-family)', flexGrow: '1' }}
            tabIndex={-1}
            readOnly
          />
        </Section>
      </Grid>
    </Container>
  );
};

export default Filetree;

const HelpMenu = () => {
  return (
    <ScrollArea
      type="auto"
      scrollbars="both"
      style={{ height: '50dvh' }}
    >
      <Box
        p="2"
        pr="4"
        pb="4"
      >
        <Heading
          as="h3"
          size="5"
        >
          About
        </Heading>
        <Text as="p">Filetree is a tool for creating visual representations of file structures.</Text>
        <Separator
          size="4"
          my="2"
        />
        <Heading
          as="h3"
          size="5"
        >
          Usage
        </Heading>
        <Text as="p">
          Each line in your <Em>Input</Em> should follow this structure:
        </Text>
        <Code>indent|icon|star|lock|visibility|name</Code>
        <Table.Root
          variant="surface"
          my="1"
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Variable</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Optional</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.RowHeaderCell>
                indent <Code>Integer</Code>
              </Table.RowHeaderCell>
              <Table.Cell>Any positive whole number.</Table.Cell>
              <Table.Cell>
                <AccessibleIcon label={'Cross'}>
                  <Cross2Icon
                    width="16"
                    height="16"
                  />
                </AccessibleIcon>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.RowHeaderCell>
                icon <Code>Enum(String)</Code>
              </Table.RowHeaderCell>
              <Table.Cell>
                <ul style={{ paddingLeft: '1em', margin: '0' }}>
                  <li>fc (folder closed)</li>
                  <li>fo (folder open)</li>
                  <li>file (file)</li>
                  <li>img (image)</li>
                  <li>vid (video)</li>
                  <li>code (code)</li>
                  <li>link (link)</li>
                </ul>
              </Table.Cell>
              <Table.Cell>
                <AccessibleIcon label={'Cross'}>
                  <Cross2Icon
                    width="16"
                    height="16"
                  />
                </AccessibleIcon>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.RowHeaderCell>
                star <Code>String|Null</Code>
              </Table.RowHeaderCell>
              <Table.Cell>
                <ul style={{ paddingLeft: '1em', margin: '0' }}>
                  <li>starred</li>
                </ul>
              </Table.Cell>
              <Table.Cell>
                <AccessibleIcon label={'Checked'}>
                  <CheckIcon
                    width="16"
                    height="16"
                  />
                </AccessibleIcon>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.RowHeaderCell>
                lock <Code>Enum(String)|Null</Code>
              </Table.RowHeaderCell>
              <Table.Cell>
                <ul style={{ paddingLeft: '1em', margin: '0' }}>
                  <li>locked</li>
                  <li>unlocked</li>
                </ul>
              </Table.Cell>
              <Table.Cell>
                <AccessibleIcon label={'Checked'}>
                  <CheckIcon
                    width="16"
                    height="16"
                  />
                </AccessibleIcon>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.RowHeaderCell>
                visibility <Code>Enum(String)|Null</Code>
              </Table.RowHeaderCell>
              <Table.Cell>
                <ul style={{ paddingLeft: '1em', margin: '0' }}>
                  <li>hidden</li>
                  <li>visible</li>
                </ul>
              </Table.Cell>
              <Table.Cell>
                <AccessibleIcon label={'Checked'}>
                  <CheckIcon
                    width="16"
                    height="16"
                  />
                </AccessibleIcon>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.RowHeaderCell>
                name <Code>String</Code>
              </Table.RowHeaderCell>
              <Table.Cell>Your file/folder name.</Table.Cell>
              <Table.Cell>
                <AccessibleIcon label={'Cross'}>
                  <Cross2Icon
                    width="16"
                    height="16"
                  />
                </AccessibleIcon>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
        <Text as="label">Here is a valid example input:</Text>
        <TextArea
          size="1"
          rows={15}
          value={`0|fc|locked|Docs
0|fc|locked|hidden|Secrets
0|fo|starred|Public
1|fc|Libraries
1|fo|Resources
2|fo|Content
3|vid|intro.mp4
3|vid|about.mp4
2|img|logo.svg
2|img|favicon.ico
1|fo|Styles
2|code|global.css
1|code|starred|index.html
1|link|site
1|file|locked|package.info`}
          style={{ fontFamily: 'var(--code-font-family)', flexGrow: '1' }}
          tabIndex={-1}
          readOnly
        />
      </Box>
    </ScrollArea>
  );
};
