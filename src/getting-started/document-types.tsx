import { ChevronRightIcon } from "@sanity/icons";
import { Box, Card, Flex, Stack, Text } from "@sanity/ui";

import { useHandbookContext } from "../contexts/handbook-context";
import { isDefined } from "../lib/utils";

export function DocumentTypesOverview() {
  const { groups, setActiveTab, setSidebarExpanded } = useHandbookContext();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {groups.map((group) => {
        const { title, description, documents } = group;

        return (
          <Stack key={title} space={2}>
            <Stack space={3}>
              <Flex align="center" paddingY={1}>
                <Text size={1} weight="medium">
                  {title}
                </Text>
              </Flex>
              {isDefined(description) && (
                <Text size={1} muted>
                  {description}
                </Text>
              )}
            </Stack>
            <Box marginTop={1}>
              <Stack space={2}>
                {documents.map((document) => {
                  const Icon = typeof document.icon === "function" ? document.icon : undefined;
                  const documentDescription =
                    document.handbook?.description ??
                    (typeof document.description === "string" ? document.description : undefined);

                  return (
                    <Card
                      key={document.name}
                      as="button"
                      padding={3}
                      radius={2}
                      sizing="border"
                      tone="inherit"
                      onClick={() => {
                        setActiveTab(document.name);
                        setSidebarExpanded(false);
                      }}
                      style={{
                        width: "calc(100% + 24px)",
                        marginLeft: "-12px",
                        textAlign: "left",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Flex align="center" gap={3}>
                        <Box flex={1}>
                          <Stack space={3}>
                            <Flex align="center" gap={2} style={{ marginLeft: "-4px" }}>
                              {isDefined(Icon) && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "25px",
                                    height: "25px",
                                    color: "var(--card-icon-color)",
                                  }}
                                >
                                  <Icon />
                                </div>
                              )}
                              <Text size={1} weight="medium">
                                {document.title ?? document.name}
                              </Text>
                            </Flex>
                            {isDefined(documentDescription) && (
                              <Box paddingBottom={1}>
                                <Text size={1} muted>
                                  {documentDescription}
                                </Text>
                              </Box>
                            )}
                          </Stack>
                        </Box>
                        <Box flex="none" style={{ opacity: 0.5 }}>
                          <Text muted size={1}>
                            <ChevronRightIcon />
                          </Text>
                        </Box>
                      </Flex>
                    </Card>
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        );
      })}
    </div>
  );
}
