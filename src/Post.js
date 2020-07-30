import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import { firestore } from 'firebase';
const Image = require('./images/logo.png')

function Post({ username, caption, imageUrl, postId, user }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');


    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                })
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firestore.FieldValue.serverTimestamp()
        });
        setComment('');

    }
    return (
        <div className="post">
            <div className="post_header">
                <Avatar
                    className="post_avatar"
                    src='/static/images/avatar/1.png'
                    alt="laith abu khalaf"
                />
                <h3>{username}</h3>
            </div>
            {/* header=> avatar username */}

            {/* image */}
            <img className="post_image" src={imageUrl} />


            <h4 className="post_text"><strong>{username}: </strong> {caption} </h4>
            {/* username + caption */}

            <div className="post_comments">
                {comments.map((comment) => {
                    return <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                })}
            </div>

            {user && (
                <form className="post_commentBox">
                    <input
                        className="post_input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <button
                        disabled={!comment}
                        className="post_button"
                        type="submit"
                        onClick={postComment}
                    >
                        post
              </button>


                </form>

            )}
        </div>
    );
}

export default Post;