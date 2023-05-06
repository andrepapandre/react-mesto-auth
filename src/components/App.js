import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; // импортируем Routes
import "../index.css";
import Footer from "./Footer";
import Header from "./Header";
import Main from "./Main";
import PopupWithForm from "./PopupWithForm";
import { ImagePopup } from "./PopupWithImage";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { EditProfilePopup } from "./EditProfilePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import auth from "../utils/auth";
import InfoTooltip from "./InfoTooltip";

const initalUser = { username: "", email: "" };

function App() {
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userData, setUserData] = React.useState(initalUser);
  const [email, setEmail] = React.useState("");
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setisAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setisEditAvatarPopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({
    name: "",
    link: "",
  });
  const [currentUser, setCurrentUser] = React.useState({});
  const [isStatusOpen, setIsStatusOpen] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.renderCards()])
      .then((res) => {
        setCards(res[1]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    if (!isLiked) {
      api
        .likeCard(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (isLiked) {
      api
        .deleteLikeCard(card._id, isLiked)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((c) => {
          return c.filter((c) => {
            return c._id !== card._id;
          });
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  React.useEffect(() => {
    api
      .getUserInfo()
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => {
        alert(`Ошибка загруки контента: ${err}`);
      });
  }, []);

  const handleCardClick = ({ link, name }) => {
    return setSelectedCard({ link, name });
  };

  const onEditProfile = () => {
    return setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  };

  const onEditAvatar = () => {
    return setisEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  };

  const onAddPlace = () => {
    return setisAddPlacePopupOpen(!isAddPlacePopupOpen);
  };
  const [message, setMessage] = React.useState("");

  const onStatus = (boolean) => {
    setMessage(boolean);
    return setIsStatusOpen(!isStatusOpen);
  };

  function handleUpdateUser(data) {
    api
      .editUserInfo({
        name: data.name,
        about: data.about,
      })
      .then((res) => {
        setCurrentUser(res);
        handleDelete();
      });
  }

  function handleUpdateAvatar(avatar) {
    api
      .editAvatarImage(avatar)
      .then((res) => {
        setCurrentUser(res);
        handleDelete();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const handleDelete = () => {
    setIsEditProfilePopupOpen(false);
    setisEditAvatarPopupOpen(false);
    setisAddPlacePopupOpen(false);
    setSelectedCard({ name: "", link: "" });
    setIsStatusOpen(false);
  };

  function handleAddPlaceSubmit({ name, link }) {
    api
      .addCard({
        name: name,
        link: link,
      })
      .then((res) => {
        const newCard = res;
        setCards([newCard, ...cards]);
        handleDelete();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function cbLogin({ email, password }) {
    auth
      .authorize({ email, password })
      .then((res) => {
        if (res.token) localStorage.setItem("token", res.token);
        setLoggedIn(true);
        navigate("/");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function cbRegister({ password, email }) {
    auth
      .register({ password, email })
      .then((res) => {
        if (res.jwt) {
          localStorage.setItem("jwt", res.jwt);
          setLoggedIn(true);
          setUserData(res.user);
        }
        console.log("res.user", res.user);
        console.log("cbreg(then):", res);
        onStatus(true);
      })
      .catch((e) => {
        onStatus(false);
        console.log(e);
      });
  }

  const cbLogOut = () => {
    setLoggedIn(false);
    localStorage.removeItem("token");
    setUserData(initalUser);
  };

  React.useEffect(() => {
    const isToken = localStorage.getItem("token");
    if (isToken) {
      auth
        .checkToken(isToken)
        .then((res) => {
          setEmail(res.data.email);
          setLoggedIn(true);
          navigate("/");
        })
        .catch(console.error);
    }
  }, [navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                onEditAvatar={onEditAvatar}
                onEditProfile={onEditProfile}
                onAddPlace={onAddPlace}
                handleCardClick={handleCardClick}
                handleCardLike={handleCardLike}
                handleCardDelete={handleCardDelete}
                cards={cards}
                setCards={setCards}
                loggedIn={loggedIn}
                email={email}
                onLogout={cbLogOut}
              />
            }
          />
          <Route
            path="/sign-in"
            element={<Login isLoqqedIn={loggedIn} onLogin={cbLogin} />}
          />

          <Route
            path="/sign-up"
            element={<Register isLoqqedIn={loggedIn} onRegister={cbRegister} />}
          />

          <Route
            path="*"
            element={
              loggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/sign-up" replace />
              )
            }
          />
        </Routes>
        <EditProfilePopup
          onUpdateUser={handleUpdateUser}
          isOpen={isEditProfilePopupOpen}
          onClose={handleDelete}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={handleDelete}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={handleDelete}
          handleAddPlaceSubmit={handleAddPlaceSubmit}
        />
        <PopupWithForm
          title={"Вы уверены?"}
          name={"confirm"}
          buttonText={"Уверен! Снесем ка нашу БД ;)"}
        >
          <button type="button" className="popup__close-button" />
        </PopupWithForm>
        <ImagePopup card={selectedCard} onClose={handleDelete} />
        <InfoTooltip
          boolean={message}
          isOpen={isStatusOpen}
          onClose={handleDelete}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}
// не заходит из-за ошибки 500 (ошибка на стороне сервера)
//Failed to load resource: the server responded with a status of 500 (Internal Server Error)
//Error: На сервере произошла ошибка
// infoTooltip показывает нужную информацию
export default App;
