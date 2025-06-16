import { Avatar, Box, Button, Flex, Image, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";

const Comment = ({ post, reply }) => {
	const [isReplying, setIsReplying] = useState(false);
	const [replyText, setReplyText] = useState("");
	const currentUser = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const navigate = useNavigate();

	const handleReply = async () => {
		if (!currentUser) {
			showToast("Error", "Please login to comment", "error");
			return;
		}
		if (isReplying) return;
		if (!replyText.trim()) {
			showToast("Error", "Comment cannot be empty", "error");
			return;
		}

		setIsReplying(true);
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/reply/${post._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${JSON.parse(localStorage.getItem("user-threads")).token}`,
				},
				body: JSON.stringify({ text: replyText }),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Comment added successfully", "success");
			setReplyText("");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsReplying(false);
		}
	};

	// If we're rendering a reply, show the reply content
	if (reply) {
		return (
			<Flex gap={4} py={2} my={2} w={"full"}>
				<Avatar
					src={reply.userProfilePic}
					name={reply.username}
					size={"sm"}
					cursor={"pointer"}
					onClick={() => navigate(`/${reply.username}`)}
				/>
				<Flex gap={1} w={"full"} flexDirection={"column"}>
					<Flex
						w={"full"}
						justifyContent={"space-between"}
						alignItems={"center"}
					>
						<Text fontSize='sm' fontWeight='bold'>
							{reply.username}
						</Text>
					</Flex>
					<Text fontSize={"sm"}>{reply.text}</Text>
				</Flex>
			</Flex>
		);
	}

	// If we're rendering the comment input section
	return (
		<Box>
			<Flex gap={4} py={2} my={2} w={"full"}>
				<Avatar
					src={currentUser?.profilePic}
					name={currentUser?.name}
					size={"sm"}
					cursor={"pointer"}
					onClick={() => navigate(`/${currentUser?.username}`)}
				/>
				<Flex gap={1} w={"full"} flexDirection={"column"}>
					<Input
						placeholder='Add a comment...'
						value={replyText}
						onChange={(e) => setReplyText(e.target.value)}
					/>
					<Flex justify={"flex-end"}>
						<Button
							size={"sm"}
							colorScheme={"blue"}
							onClick={handleReply}
							isLoading={isReplying}
						>
							Reply
						</Button>
					</Flex>
				</Flex>
			</Flex>

			{post?.replies?.map((reply) => (
				<Comment
					key={reply._id}
					reply={reply}
				/>
			))}
		</Box>
	);
};

export default Comment;
