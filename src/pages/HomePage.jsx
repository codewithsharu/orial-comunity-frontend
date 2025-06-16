import { Flex, Spinner, Text, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();

	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/feed`, {
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				
				if (!res.ok) {
					if (res.status === 401) {
						showToast("Error", "Please login to view your feed", "error");
						return;
					}
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				
				if (Array.isArray(data)) {
					setPosts(data);
				} else {
					console.error("Expected array but got:", data);
					setPosts([]);
				}
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts]);

	return (
		<Box p={4}>
			{!loading && (!posts || posts.length === 0) && (
				<Text textAlign="center" fontSize="xl">
					Follow some users to see the feed
				</Text>
			)}

			{loading && (
				<Flex justify='center'>
					<Spinner size='xl' />
				</Flex>
			)}

			{!loading && Array.isArray(posts) && posts.map((post) => (
				<Post key={post._id} post={post} postedBy={post.postedBy} />
			))}
		</Box>
	);
};

export default HomePage;
