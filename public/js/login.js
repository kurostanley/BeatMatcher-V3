// hide loading indicator.
hideLoading();
// get sign up container.
const signUpContainer = document.getElementById("signup");
// set up event for sign up close btn
const signUpCloseBtn = document.getElementById("signup__close-btn");
// set up event for create new account button.
const createNewAccountBtn = document.getElementById("login__create-account-btn");
// get input information from the input elements and validate those values.
const selectedAvatar = document.getElementById("signup__selected-avatar");
const avatarClose = document.getElementById("signup__avatar-close");
const avatarLabel = document.getElementById("signup__avatar-label");
const avatarInputElement = document.getElementById("signup__avatar");
const audioInputElement = document.getElementById("audio-file");
const emailInputElement = document.getElementById("signup__email");
const passwordInputElement = document.getElementById("signup__password");
const confirmPasswordInputElement = document.getElementById("signup__confirm-password");
const fullNameInputElement = document.getElementById("signup__fullname");
const ageInputElement = document.getElementById("signup__age");
const positionSelectElement = document.getElementById("signup__position");

const emailLoginInputElement = document.getElementById("login__email");
const passwordLoginInputElement = document.getElementById("login__password");
// get sign up button.
const signUpBtn = document.getElementById("signup__btn");
// get login button.
const loginBtn = document.getElementById("login__submit-btn");

/**
 * hide sing up modal.
 */
function hideSignUp() {
  // add hide class to hide the sign up.
  signUpContainer.classList.add("signup--hide");
  // clear the input elements.
  if (emailInputElement && passwordInputElement && confirmPasswordInputElement) {
    emailInputElement.value = "";
    passwordInputElement.value = "";
    confirmPasswordInputElement.value = "";
  }
}

// add event for sign up close button.
if (signUpCloseBtn) {
  signUpCloseBtn.addEventListener("click", function () {
    resetAvatarSelection();
    hideSignUp();
    if(audioInputElement.files.length != 0){
      wavesurfer.destroy();
    }
    document.getElementById("audio-buttons").classList.remove("w3-show")
    document.getElementById("audio-buttons").classList.add("w3-hide")
  });
}

// add event for create a new account button.
if (createNewAccountBtn) {
  createNewAccountBtn.addEventListener("click", function () {
    signUpContainer.classList.remove("signup--hide");
  });
}

/**
 * validate input user's information when creating a new account.
 * @param {*} object - user's information that needs to be validated.
 * @returns valid, or not.
 */
function validateNewAccount({ avatars, musics, email, password, confirmPassword, fullname, age, position }) {
  // Validate Avatar
  if (!avatars || avatars.length === 0) {
    alert("Please select avatar");
    return false;
  }
  if (avatars.length > 1) {
    alert("Please select a single image");
    return false;
  }
  const avatar = avatars[0];
  if (avatar && !avatar.type.includes("jpeg")) {
    alert("Your avatar must be jpeg format");
    return false;
  }

  // Validate Music
  if (!musics || musics.length === 0) {
    alert("Please select musics");
    return false;
  }
  if (musics.length > 1) {
    alert("Please select a single musics");
    return false;
  }
  const music = musics[0];
  console.log(music);
  if (music && !music.type.includes("mpeg")) {
    alert("Your avatar must be mp3 format");
    return false;
  }
  if (!validator.isEmail(email)) {
    alert("Please input your email");
    return false;
  }
  if (
    validator.isEmpty(password) ||
    !validator.isLength(password, { min: 6 })
  ) {
    alert(
      "Please input your password. You password must have at least 6 characters"
    );
    return false;
  }
  if (validator.isEmpty(confirmPassword)) {
    alert("Please input your confirm password");
    return false;
  }
  if (password !== confirmPassword) {
    alert("Confirm password and password must be the same");
    return false;
  }
  if (validator.isEmpty(fullname)) {
    alert("Please iput your fullname");
    return false;
  }
  if (validator.isEmpty(age) || !validator.isNumeric(age)) {
    alert("Please input your age, your age must be a number");
    return false;
  }
  if (validator.isEmpty(position)) {
    alert("Please input your position");
    return false;
  }
  return true;
}

const resetAvatarSelection = () => {
  selectedAvatar.src = "";
  selectedAvatar.classList.remove("show");
  selectedAvatar.classList.add("hide");
  avatarClose.classList.remove("show");
  avatarClose.classList.add("hide");
  avatarLabel.classList.remove("hide");
  avatarLabel.classList.add("show");
  avatarInputElement.value = "";
};

if (avatarClose) {
  avatarClose.addEventListener("click", function () {
    resetAvatarSelection();
  });
}

const onAvatarSelected = (input) => {
  if (input) {
    selectedAvatar.src = (window.URL ? URL : webkitURL).createObjectURL(
      input.files[0]
    );
    selectedAvatar.classList.remove("hide");
    selectedAvatar.classList.add("show");
    avatarClose.classList.remove("hide");
    avatarClose.classList.add("show");
    avatarLabel.classList.remove("show");
    avatarLabel.classList.add("hide");
  }
};

const resetSignUpForm = () => {
  if(audioInputElement.files.length != 0){
    wavesurfer.destroy();
  }
  resetAvatarSelection();
  emailInputElement.value = ''
  passwordInputElement.value = ''
  confirmPasswordInputElement.value = ''
  fullNameInputElement.value = ''
  ageInputElement.value = ''
  positionSelectElement.value = 'Producer'
};

const registerNewAccount = ({ avatar, music, email, password, fullname, age, position }) => {
  showLoading();
  const userUuid = uuid.v4();
  const form = new FormData();
  form.append("avatar", avatar);
  form.append("music", music);
  form.append("email", email);
  form.append("password", password);
  form.append("age", age);
  form.append("position", position);
  form.append("ccUid", userUuid);
  form.append("fullname", fullname);
  
  
  axios
    .post("/users/create", form, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => {
      if (res && res.data && res.data.message) {
        alert(res.data.message);
      } 
      else if (res && res.data && res.data.insertId) {
        hideLoading();
        resetSignUpForm();
        hideSignUp();
      } 
      else {
        alert("Cannot create your account. Please try again");
      }
    })
    .catch((error) => {
      hideLoading();
    });
};

// add event for sign up button.
if (signUpBtn) {
  signUpBtn.addEventListener("click", async function () {
    console.log(audioInputElement.files)
    if (avatarInputElement && audioInputElement && emailInputElement && passwordInputElement && confirmPasswordInputElement && fullNameInputElement && ageInputElement && positionSelectElement) {

      const avatars = avatarInputElement.files;
      const musics = audioInputElement.files;
      const email = emailInputElement.value;
      const password = passwordInputElement.value;
      const confirmPassword = confirmPasswordInputElement.value;
      const fullname = fullNameInputElement.value;
      const age = ageInputElement.value;
      const position = positionSelectElement.value;
      if (
        validateNewAccount({ avatars, musics, email, password, confirmPassword, fullname, age, position })
      ) {
        showLoading();

        wavesurfer.pause();
        
        await downloadTrack(songId);
  
        let blob = await fetch(processedAudio.src).then(response => response.blob());
        let file = new File([blob], 'filename.mp3', {type: 'audio/mpeg'});
      
        let list = new DataTransfer();
        list.items.add(file);
  
        let myFileList = list.files; 
  
        registerNewAccount({ avatar: avatars[0], music: musics[0], email, password, fullname, age, position });
      }

    }
  });
}

/**
 * check user's credentials is valid, or not.
 * @param {*} object - user's credentials.
 * @returns valid, or not.
 */
function isUserCredentialsValid({ email, password }) {
  return (
    email &&
    password &&
    validator.isEmail(email) &&
    validator.isLength(password, { min: 6 })
  );
}

// add event for login button.
if (loginBtn) {
  loginBtn.addEventListener("click", function () {
    // show loading indicator.
    showLoading();
    // get input user's credentials.
    const email = emailLoginInputElement ? emailLoginInputElement.value : null;
    const password = passwordLoginInputElement ? passwordLoginInputElement.value : null;
    if (isUserCredentialsValid({ email, password })) {
      axios
        .post("/login", { email, password })
        .then((res) => {
          if (res && res.data && res.data.uid) {
            // hide loading.
            hideLoading();
            // store logged in user in the local storage.
            localStorage.setItem("auth", JSON.stringify({ uid: res.data.uid, avatar: res.data.avatar, 
              name: res.data.name, position: res.data.position }));
            // Set Cookie
            document.cookie = `authUid = ${res.data.uid}`
            document.cookie = `authAvatar = ${res.data.avatar}`
            document.cookie = `authName = ${res.data.name}`
            document.cookie = `authPosition = ${res.data.position}`
            document.cookie = `token = ${res.data.token}`

            // redirect to home page.
            window.location.href = "/";
          } else {
            // hide loading.
            hideLoading();
            alert("Your user name or password is not correct");
          }

        })
        .catch((error) => {
          if (error) {
            console.log(error)

            hideLoading();
            alert("Your user name or password is not correct");
          }
        });
    } else {
      // hide loading indicator.
      hideLoading();
      alert(`Your user's name or password is not correct`);
    }
  });
}