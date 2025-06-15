import Comment from '../models/Comment.js';

// Create a new comment
export const createComment = async (req, res) => {
    try {
        const { content, postId } = req.body;
        const userId = req.user._id; // Assuming you have authentication middleware

        const comment = await Comment.create({
            content,
            post: postId,
            user: userId
        });

        await comment.populate('user', 'username profilePic');
        
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get comments for a post
export const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ post: postId })
            .populate('user', 'username profilePic')
            .sort({ createdAt: -1 });
        
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user is the owner of the comment
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 