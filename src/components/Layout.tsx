import React, { ReactNode, ReactElement, useState } from "react";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { FiMenu, FiChevronDown } from "react-icons/fi";
import { IconType } from "react-icons";

import { useAppwrite } from "../contexts/appwrite";
import { useQueryClient } from "react-query";
import { LocalStorageKey, QueryKey } from "../constants";
import { useAccount } from "../hooks/useAccount";
import { FaDatabase, FaFile } from "react-icons/fa";
import { BsLightningFill, BsPeopleFill } from "react-icons/bs";
import { BiTime } from "react-icons/bi";
import { UpdateNameModal } from "./modals/UpdateNameModal";
import { Account } from "appwrite";

interface LinkItemProps {
  name: string;
  icon: IconType;
  to: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Databases", icon: FaDatabase, to: "/" },
  { name: "Storage", icon: FaFile, to: "/storage" },
  { name: "Teams", icon: BsPeopleFill, to: "/teams" },
  { name: "Functions", icon: BsLightningFill, to: "/functions" },
  { name: "Realtime", icon: BiTime, to: "/realtime" },
];

export const Layout = ({ children }: { children: ReactNode }): ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" h="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { data } = useAccount();
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" ml="6" justifyContent="space-between">
        <Text fontSize="xl" fontFamily="monospace" fontWeight="bold">
          Appwrite Explorer
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.filter((link) => link.name != "Teams" || !!data?.$id).map(
        (link) => (
          <NavItem key={link.name} icon={link.icon} to={link.to}>
            {link.name}
          </NavItem>
        ),
      )}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  to: string;
  children: string | number;
}
const NavItem = ({ icon, children, to, ...rest }: NavItemProps) => {
  const location = useLocation();
  const current = location.pathname == to;
  const highlight = {
    bg: "pink.400",
    color: "white",
  };
  return (
    <Link as={RouterLink} to={to} style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        p="3"
        mx="3"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={current ? highlight.bg : "transparent"}
        color={current ? highlight.color : "black"}
        _hover={{
          bg: highlight.bg,
          color: highlight.color,
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const client = useAppwrite();
  const queryClient = useQueryClient();
  const { data } = useAccount();
  const [isUpdateNameModalOpen, setUpdateNameModalOpen] = useState(false);

  const onSignOutClick = async () => {
    if (data?.$id != "" && client) {
      const account = new Account(client);
      await account.deleteSession("current");
    }

    Object.values(LocalStorageKey).forEach((key) => {
      localStorage.removeItem(key);
    });

    Object.values(QueryKey).forEach((key) => {
      queryClient.invalidateQueries(key);
    });
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Appwrite Explorer
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar size={"sm"} name={data?.name} bg="pink" />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{data?.name}</Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              {!!data?.$id && (
                <>
                  <MenuItem
                    onClick={() => {
                      setUpdateNameModalOpen(true);
                    }}
                  >
                    Update Name
                  </MenuItem>
                  <UpdateNameModal
                    isOpen={isUpdateNameModalOpen}
                    onClose={() => setUpdateNameModalOpen(false)}
                  />
                </>
              )}
              <MenuItem onClick={onSignOutClick}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
