import { Button, Flex, Image, Link, useColorMode, useColorModeValue, Text } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);

	return (
		<Flex
			position="fixed"
			top="0"
			left="0"
			right="0"
			zIndex="100"
			justifyContent={"space-between"}
			py={4}
			px={4}
			bg={useColorModeValue("gray.50", "gray.800")}
		>
			{user && (
				<Flex gap={4}>
					<Link href="https://orial-front.vercel.app/" isExternal display="flex" alignItems="center" gap={2}>
						<MdStorefront size={24} />
						<Text fontWeight="bold" color="gold" fontSize="lg">Store</Text>
					</Link>
					<Link as={RouterLink} to='/'>
						<AiFillHome size={24} />
					</Link>
				</Flex>
			)}
			{!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
					Login
				</Link>
			)}

			<Image
				cursor={"pointer"}
				alt='logo'
				w={6}
				src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
				onClick={toggleColorMode}
			/>

			{user && (
				<Flex alignItems={"center"} gap={4}>
					<Link as={RouterLink} to={`/${user.username}`}>
						<RxAvatar size={24} />
					</Link>
					<Button size={"xs"} onClick={logout}>
						<FiLogOut size={20} />
					</Button>
				</Flex>
			)}

			{!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
					Sign up
				</Link>
			)}
		</Flex>
	);
};

export default Header;
