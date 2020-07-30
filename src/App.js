import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post'
import { db, auth } from './firebase'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles'
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


const wordLogo = require('./images/word.png')
const Image = require('./images/logo.png')

//material/ui copy

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false)


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //loggedin user
        setUser(authUser);

        if (authUser.displayName) {
          //dont update username
        } else {
          // if newUser
          return authUser.updateProfile({
            displayName: username,
          });
        }


      } else {
        //logged out user
        setUser(null);

      }

    })

    return () => {
      //perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);



  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })
      ))
    })

  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))
    setOpen(false);

  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    setOpenSignIn(false)
  }

  return (
    <div className="App">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >

        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img className="app_headerImage"
                src={wordLogo} alt="" />

            </center>
            <Input
              placeholder="username"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>sign up</Button>

          </form>

        </div>
      </Modal>


      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img className="app_headerImage"
                src={wordLogo} alt="" />

            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>sign In</Button>

          </form>
        </div>


      </Modal>

      <div className="app_header">

        <img className="app_headerImage" src={wordLogo} alt="" />


        {user ? (
          <Button onClick={() => auth.signOut()}>logout</Button>
        ) : (
            <div className="app_loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>sign In</Button>

              <Button onClick={() => setOpen(true)}>sign up</Button>
            </div>
          )}

      </div>



      <div className="app_posts">
        <div className="app_postsLeft">

          {
            posts.map(({ post, id }) => {
              return <Post key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} user={user} />
            })
          }

        </div>

        <div className="app_postsRight">

          <InstagramEmbed
            url='https://www.instagram.com/p/CDGjBCxpIge/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />

        </div>


      </div>



      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
          <h3>Sorry you need to login to upload</h3>
        )}






    </div>
  );
}

export default App;
