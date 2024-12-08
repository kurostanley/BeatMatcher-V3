window.addEventListener("DOMContentLoaded", function () {
  // hide loading indicator.
  hideLoading();
  // set header information
  const authenticatedUser = JSON.parse(localStorage.getItem("auth"));
  if (authenticatedUser) {
    // get logout button
    const logoutButon = document.getElementById("header__logout");
    // show authenticated user on the header.
    const headerRight = document.getElementById("header__right");
    const userImage = document.getElementById("user__image");
    const userName = document.getElementById("user__name");

    // main card item.
    const mainCardEmptyMessage = document.getElementById("main__card-empty");
    const mainCardItemContainer = document.getElementById("main__card-item-container");

    // main card actions.
    const mainCardActions = document.getElementById("main__card-actions")
    const dislikeBtn = document.getElementById("dislike");
    const likeBtn = document.getElementById("like");

    // main left messages
    const mainLeftMessagesContainer = document.getElementById("main__left-messages");
    const mainLeftEmpty = document.getElementById("main__left-empty");

    // chatbox
    const chatBox = document.getElementById("chatbox");
    const chatBoxUserAvatar = document.getElementById("chatbox__user-avatar");
    const chatBoxUserName = document.getElementById("chatbox__user-name");
    const chatBoxClose = document.getElementById("chatbox__close");
    const messageBottom = document.getElementById("message-bottom");
    const messageContainer = document.getElementById("message__container");

    // call
    const callingDialog = document.getElementById("calling");
    const acceptCallBtn = document.getElementById("accept-call");
    const rejectCallBtn = document.getElementById("reject-call");
    const audioCallBtn = document.getElementById("audio-call");
    const videoCallBtn = document.getElementById("video-call");
    const callScreen = document.getElementById("callScreen");

    // new
    const signUpContainer = document.getElementById("signup");
    const signUpCloseBtn = document.getElementById("signup__close-btn");
    let detailNode = null;

    const socket = io("/");

    let listenerID = null;
    let upcomingCall = null;
    let selectedContact = null;
    let selectedContactName = null
    let selectedContactAvatar = null; 
    let notificationListenerID = authenticatedUser.uid;

    socket.emit("addUser", notificationListenerID)
    socket.on("getUsers", (users) => {
      console.log(users)
    })

    socket.on("getMessage", (data) => {
      if(selectedContact && selectedContact.uid === data.senderId){
        renderSingleMessage({
          sender: {
            avatar: data.receiverAvatar
          },
          text: data.text,
          isRight: false
        })
        scrollToBottom();
      }
      else{
        const friend = document.getElementById(`friend_${data.senderId}`)
        friend.style.background = "green";
        toastr.info(`There is new message from ${data.senderName}`);
      }
    })

    socket.on("getMatch", (data) => {
      console.log(data);
      const matcherData = {
        uid: data.senderId,
        avatar: data.senderAvatar,
        name: data.senderName
      };
      const matchFriend = {data: matcherData};
      renderFriends([matchFriend]);
      toastr.info(`There is new match! from ${matcherData.name}`);
    })


    const showCallingDialog = () => {
      callingDialog.classList.remove("calling--hide");
    };

    const hideCallingDialog = () => {
      callingDialog.classList.add("calling--hide");
    };



    const scrollToBottom = () => {
      if (messageBottom && messageBottom) {
        messageBottom.parentNode.scrollTop = messageBottom.offsetTop;
      }
    }

    const sendMessage = (inputMessage) => {
        if (inputMessage) {
          // call backend service to send the message.
          const message = {
            senderId:authenticatedUser.uid,
            recipentId: selectedContact.uid,
            message:inputMessage,
          };
          socket.emit("sendMessage", {
            senderId: authenticatedUser.uid,
            senderName: authenticatedUser.name,
            receiverId: selectedContact.uid,
            text: inputMessage,
            receiverAvatar: authenticatedUser.avatar
          });
          console.log(selectedContactAvatar)
          axios
            .post('/users/sendMessage',message)
            .then((res) => {  
              // append new message on the UI.
              const sentMessage = {
                text: inputMessage,
                sender: {
                  avatar: authenticatedUser.avatar
                },
                isRight: true
              }
              renderSingleMessage(sentMessage);
              // scroll to bottom.
              scrollToBottom();
            });

          
        }
    };


    const isRight = (message) => {
      if (message.isRight !== null && message.isRight !== undefined) {
        return message.isRight;
      }
      return message.sender.uid === authenticatedUser.uid;
    }

    const renderSingleMessage = (message) => {
      if (message && isRight(message)) {
        messageContainer.innerHTML += `
          <div class="message__right">
            <div class="message__content message__content--right">
              <p>${message.text}</p>
            </div>
            <div class="message__avatar">
             <img src="${message.sender.avatar}"/>
            </div>
          </div>
        `;
      } else {
        messageContainer.innerHTML += `
          <div class="message__left">
            <div class="message__avatar">
              <img src="${message.sender.avatar}"/>
            </div>
            <div class="message__content message__content--left">
              <p>${message.text}</p>
            </div>
          </div>
        `;
      }
    };

    const renderMessages = (messages) => {
      messages.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.date) - new Date(b.date);
      });
      if (messages && messages.length !== 0) {
        messages.forEach(message => {
          if (message) {
            renderSingleMessage(message);
          }
        });
        // scroll to bottom.
        scrollToBottom();
      }
    };

    const loadMessages = () => {
      const limit = 50;
      const transferMessageData = [];
      // Load user's message
      axios
        .post('/users/getMessage', {            
          senderId:authenticatedUser.uid,
          recipentId: selectedContact.uid
        })
        .then((messages) => {
          if (messages.data && messages.data.length !== 0) {
            messages.data.forEach( (message) => {
              const messageData = {          
                sender: {
                  avatar: authenticatedUser.avatar
                },
                text:message.message,
                isRight: true,
                date: message.created_at
              }
              transferMessageData.push(messageData)
            })
            //renderMessages(transferMessageData);
          }
        })
        .catch((error) => { });
      
      // Load selectedContact's message
      axios
        .post('/users/getMessage', {            
          senderId:selectedContact.uid,
          recipentId: authenticatedUser.uid
        })
        .then((messages) => {
          if (messages.data && messages.data.length !== 0) {
            messages.data.forEach( (message) => {
              const messageData = {          
                sender: {
                  avatar: chatBoxUserAvatar.src
                },
                text:message.message,
                isRight: false,
                date: message.created_at
              }
              transferMessageData.push(messageData)
            })
            renderMessages(transferMessageData);
          }
        })
        .catch((error) => { });
    };



    const isCurrentUser = (selectedContact, selectedUid) => {
      return selectedContact && selectedUid && selectedContact.uid && selectedContact.uid === selectedUid;
    };

    window.openChatBox = (selectedUid, name, avatar) => {
      if (selectedUid && name && avatar && !isCurrentUser(selectedContact, selectedUid)) {
        selectedContact = { uid: selectedUid };
        console.log(selectedContact)
        const friend = document.getElementById(`friend_${selectedUid}`)
        friend.style.background = "";
        chatBox.classList.remove("hide");
        chatBoxUserName.innerHTML = name;
        selectedContactName = name;
        chatBoxUserAvatar.src = avatar;
        messageContainer.innerHTML = '';
        loadMessages();
        //listenForCall();
      }
    }

    const renderFriends = (userList) => {
      if (userList && userList.length !== 0) {
        userList.forEach(user => {
          console.log(user)
          if (user) {
            mainLeftMessagesContainer.innerHTML += `<div class="main__left-message" id="friend_${user.data.uid}" onclick="openChatBox('${user.data.uid}', '${user.data.name}', '${user.data.avatar}')">
              <img
                src="${user.data.avatar}"
                alt="${user.data.name}"
              />
              <span>${user.data.name}</span>
            </div>`;
          }
        });
      }
    };

    const loadFriends = () => {
      axios
        .post("/users/matches", {
          ccUid: authenticatedUser.uid,
        })
        .then(async(res) => {
          if (res && res.length !== 0) {
            console.log(res.data)
            const userList = await getMatcherData(res.data.user.user_uid);
            mainLeftEmpty.classList.add('hide');
            mainLeftMessagesContainer.innerHTML = '';
            renderFriends(userList);
          } else {
            mainLeftEmpty.classList.remove('hide');
            mainLeftEmpty.innerHTML = 'You do not have any contact';
          }
        })
    };

    const getMatcherData = async(uids) => {
          let friendListDetail = [];
          for(let uid of uids){
            await axios
              .post('/users/findUser', {
                ccUid: uid,
              })
              .then((res) => {
                friendListDetail.push(res)
              })
          }
          return friendListDetail;
    }

    const getCurrentCard = () => {
      const cards = document.getElementsByClassName("main__card-item");
      if (cards && cards.length !== 0) {
        for (const card of cards) {
          if (card.getAttribute("style")) {
            if (card.getAttribute("style").indexOf("display: block") != -1) {
              return card;
            }
          }
        }
        return null;
      }
      return null;
    };

    const getNextCard = () => {
      const cards = document.getElementsByClassName("main__card-item");
      if (cards && cards.length !== 0) {
        for (let i = 0; i < cards.length; i++) {
          if (cards[i].getAttribute("style")) {
            if (cards[i].getAttribute("style").indexOf("display: block") != -1) {
              return cards[i+1];
            }
          }
        }
        return null;
      }
      return null;
    };


    const showHeaderInformation = () => {
      if (headerRight && userImage && userName && authenticatedUser && authenticatedUser.uid) {
        headerRight.classList.remove("header__right--hide");
        userImage.src = authenticatedUser.avatar;
        userName.innerHTML = `Hello, ${authenticatedUser.name}`;
      }
    };

    const createMatchRequest = (matchRequestTo, matchRequestReceiver, matchRequestReceiverAvatar) => {
      console.log(authenticatedUser.name );

      if (authenticatedUser && authenticatedUser.uid && authenticatedUser.name && matchRequestTo && matchRequestReceiver) {
                
        // For Database update
        axios.post('/requests/create', {
          matchRequestFrom: authenticatedUser.uid,
          matchRequestSender: authenticatedUser.name,
          // Id
          matchRequestTo,
          // Name
          matchRequestReceiver
        }).then(res => {
          console.log(res)
          if (res && res.data && res.data.match_request_status && res.data.match_request_status === 1) {
            // addFriend(authenticatedUser.uid, matchRequestTo, matchRequestReceiver);
            const matcherData = {
              uid: matchRequestTo,
              avatar: matchRequestReceiverAvatar,
              name: matchRequestReceiver
            };
            const matchFriend = {data: matcherData};
            //console.log(matchFriend)
            renderFriends([matchFriend]);
            // Match! give a notification to others
            socket.emit("match", {
              senderId: authenticatedUser.uid,
              senderName: authenticatedUser.name,
              senderAvatar: authenticatedUser.avatar,
              receiverId: matchRequestTo,
              receiverName: matchRequestReceiver
            });
            // Match! give a notification to myself
            toastr.info(`There is new match! from ${matchRequestReceiverㄈㄈ}`);
          }
        }).catch(error => { });
      }
    }
    


    const swipeRight = (element) => {
      $(element).addClass('rotate-left').delay(700).fadeOut(1);
      $('.main__card-item').find('.status').remove();
      $(element).append('<div class="status like">Like!</div>');
      $(element).next().removeClass('rotate-left rotate-right').fadeIn(400);
      const matchRequestTo = $(element).attr('data-id');
      const matchRequestReceiver = $(element).attr('data-name');
      // get the avatar
      const firstDiv = $(element).find("div:first");
      const backgroundImage = firstDiv.css("background-image");
      let imageUrl = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/)[1];

      const matchRequestReceiverAvatar = imageUrl;
      createMatchRequest(matchRequestTo, matchRequestReceiver, matchRequestReceiverAvatar);
      setTimeout(() => {
        shouldHideMainCard();
        $(element).remove();
      }, 1100);
    };

    const swipeLeft = (element) => {
      $(element).addClass('rotate-right').delay(700).fadeOut(1);
      $('.main__card-item').find('.status').remove();
      $(element).append('<div class="status dislike">Dislike!</div>');
      $(element).next().removeClass('rotate-left rotate-right').fadeIn(400);
      setTimeout(() => {
        shouldHideMainCard();
        $(element).remove();
      }, 1100);
    };

    const applySwing = () => {
      $(".main__card-item").on("swiperight", function () {
        swipeRight(this);
      });
      $(".main__card-item").on("swipeleft", function () {
        swipeLeft(this);
      });
    };
    
    const renderCardList = (recommendedUsers) => {
      if (recommendedUsers && recommendedUsers.length !== 0) {
        const cardList = document.getElementById("main__card-item-container");
        recommendedUsers.forEach((user, index) => {
          if (index === 0) {
            cardList.innerHTML += `<div class="main__card-item" style="display: block;" data-id="${user.user_uid}" data-name="${user.user_full_name}">
              <div class="avatar" style="display: block; background-image: url(${user.user_avatar})">
              <audio class="music" controls preload="none" style="display: none; ">
                <source src=${user.user_music_clip} type="audio/mpeg" class="avatar" style="display: block;">
              Your browser does not support the audio element.
              </audio>
              <section class="box">
              <svg>
              <linearGradient id="gradient">
                <stop offset="0%" stop-color="#FF6200" />
                <stop offset="50%" stop-color="#D7FF04" />
                <stop offset="100%" stop-color="#39FF14" />
              </linearGradient>
                <circle class="circle progress" cx="25" cy="25" r="25"></circle>
                <circle class="circle blur progress" cx="25" cy="25" r="25"></circle>
                <circle class="circle backcircle" cx="25" cy="25" r="25"></circle>
              </svg>
              <div class="texts">
                <div class="time" >00:00</div>
                <div class="lyric"></div>
                <div class="play"></div>
              </div>
              </section>
              </div>
              <span>${user.user_full_name}, ${user.user_age}</span>
            </div>`;
            } else {
            cardList.innerHTML += `<div class="main__card-item" data-id="${user.user_uid}" data-name="${user.user_full_name}">
              <div class="avatar" style="display: block; background-image: url(${user.user_avatar})">
              <audio class="music" controls preload="none" style="display: none; ">
                <source src=${user.user_music_clip} type="audio/mpeg" class="avatar" style="display: block;">
                Your browser does not support the audio element. 
              </audio>
              <section class="box">
              <svg>
                <linearGradient id="gradient">
                  <stop offset="0%" stop-color="#FF6200" />
                  <stop offset="50%" stop-color="#D7FF04" />
                  <stop offset="100%" stop-color="#39FF14" />
                </linearGradient>
                  <circle class="circle progress" cx="25" cy="25" r="25"></circle>
                  <circle class="circle blur progress" cx="25" cy="25" r="25"></circle>
                  <circle class="circle backcircle" cx="25" cy="25" r="25"></circle>
              </svg>
              <div class="texts">
                <div class="time" >00:00</div>
                <div class="lyric"></div>
                <div class="play"></div>
              </div>
              </section>
              </div>
              <span>${user.user_full_name}, ${user.user_age}</span>
            </div>`;
          }
        });
        applySwing();
      }
    };
    let intervalId;

    const progressbar = () => {
      const audio = document.querySelector('audio');
      const lyric = document.querySelector('.lyric');
      const play = document.querySelector('.play');
      const time = document.querySelector('.time');
      const progresses = Array.from(document.querySelectorAll('.progress'));
      play.addEventListener('click', e => {
        audio.play();
        play.style.opacity = '0';
        //play.style.pointerEvents = 'none';
      })

      audio.addEventListener('play', e => {
        play.style.opacity = '0';
        time.style.opacity = "70%";
      });


      audio.addEventListener('pause', e => {
        play.style.opacity = '100';
        time.style.opacity = "0";
      });
      
      intervalId = setInterval(() => {
        let current = Math.floor(audio.currentTime); // time of current playing music
        let currentSmall = audio.currentTime;
        let minute = Math.floor(current / 60);
        let second = 30 - current % 60;
        minute = minute < 10 ? '0' + minute : minute;
        second = second < 10 ? '0' + second : second;
        time.innerText = `${second}`;
        progresses.forEach(progress => {
          // magic number : const = 1414/225
          progress.style.strokeDashoffset = 158 - (158 * ((currentSmall / 30) * 100)) / 100;
        })
      }, 100); // this function run all second


    }
    
    // play current music
    // const playCurrentMusic = () => {
    //   const i = getNextCard();
    //   if(i){
    //     let audio = $(i).find("audio").get(0);
    //     const time = $(i).find('.time').get(0);
    //     const progresses = Array.from($(i).find('.progress'));  

    //     audio.play();

    //     // Inital the progress bar
    //     clearInterval(intervalId); // 清除之前的計時器
    //     progresses.forEach(progress => {
    //       progress.style.strokeDashoffset = 0;
    //     })
        
    //     setInterval(() => {
    //         let current = Math.floor(audio.currentTime);
    //         let currentSmall = audio.currentTime;
    //         let minute = Math.floor(current / 60);
    //         let second = 30 - current % 60;
    //         minute = minute < 10 ? '0' + minute : minute;
    //         second = second < 10 ? '0' + second : second;
    //         time.innerText = `${second}`
    //         progresses.forEach(progress => {
    //             progress.style.strokeDashoffset = 158 - (158 * ((currentSmall / 30) * 100)) / 100;
    //         })
    //     }, 100);    

    //     $(audio).on('play', function() {
    //       $('.play').css('opacity', '0');
    //       $('.time').css('opacity' ,'70%');  
    //     });
          
    //     $(audio).on('pause', function() {
    //       $('.play').css('opacity', '100');
    //       $('.time').css('opacity' ,'0');
    //     });
        
    //     $(i).find(".play").on('click', function() {
    //       console.log(audio);
    //       audio.play();
    //       $(this).css('opacity', '0');
    //     });
    //   }
    // }


    // play next music
    const playNextMusic = () => {
      const i = getNextCard();
      if(i){
        let audio = $(i).find("audio").get(0);
        const time = $(i).find('.time').get(0);
        const progresses = Array.from($(i).find('.progress'));  

        audio.play();

        // Inital the progress bar
        clearInterval(intervalId); // 清除之前的計時器
        progresses.forEach(progress => {
          progress.style.strokeDashoffset = 0;
        })
        
        setInterval(() => {
            let current = Math.floor(audio.currentTime);
            let currentSmall = audio.currentTime;
            let minute = Math.floor(current / 60);
            let second = 30 - current % 60;
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;
            time.innerText = `${second}`
            progresses.forEach(progress => {
                progress.style.strokeDashoffset = 158 - (158 * ((currentSmall / 30) * 100)) / 100;
            })
        }, 100);    

        $(audio).on('play', function() {
          $('.play').css('opacity', '0');
          $('.time').css('opacity' ,'70%');  
        });
          
        $(audio).on('pause', function() {
          $('.play').css('opacity', '100');
          $('.time').css('opacity' ,'0');
        });
        
        $(i).find(".play").on('click', function() {
          console.log(audio);
          audio.play();
          $(this).css('opacity', '0');
        });
      }
    }

    
    // pauseCurrentMusic
    const pauseMusic = () => {
      const i = getCurrentCard();
      if(i){
        $(i).find("audio").get(0).pause();
      }
    }

    const showMainCard = () => {
      mainCardActions.classList.remove('hide');
      mainCardItemContainer.classList.remove('hide');
      mainCardEmptyMessage.classList.add('hide');
    };

    const hideMainCard = () => {
      mainCardActions.classList.add('hide');
      mainCardItemContainer.classList.add('hide');
      mainCardEmptyMessage.classList.remove('hide');
    };

    const shouldHideMainCard = () => {
      const nextCard = getCurrentCard();
      if (!nextCard) {
        hideMainCard();
      }
    };

    // call api to load recommended users.
    const loadRecommendedUsers = () => {
      axios
        .post("/users/recommend", {
          position: authenticatedUser.position === "Producer" ? "Rapper/Singer/Songwriter" : "Producer",
          ccUid: authenticatedUser.uid,
        })
        .then((res) => {
          if (res && res.data && res.data.length !== 0) {
            showMainCard();
            console.log(res.data)
            renderCardList(res.data);
            $(".main__card-item").find("audio").get(0).play()
            progressbar();
          }
        })
        .catch((error) => {
        });
    };

    // add event for logout
    if (logoutButon) {
      logoutButon.addEventListener("click", function () {
        const isLeaved = confirm("Do you want to log out?");
        if (isLeaved) {
            // User successfully logged out.
            // Perform any clean up if required.
            localStorage.removeItem("auth");
            // redirect to login page.
            window.location.href = "/login.html";
          // });
        }
      });
    }

    if (dislikeBtn) {
      dislikeBtn.addEventListener('click', function () {
        const currentCard = getCurrentCard();
        if (currentCard) {
          swipeLeft(currentCard);
          pauseMusic();
          playNextMusic();
        } else {
          hideMainCard();
        }
      });
    }

    if (likeBtn) {
      likeBtn.addEventListener('click', function () {
        const currentCard = getCurrentCard();
        if (currentCard) {
          swipeRight(currentCard);
          pauseMusic();
          playNextMusic();
          setTimeout(() => {
            shouldHideMainCard();
          }, 1100);
        } else {
          hideMainCard();
        }
      });
    }

    if (chatBoxClose) {
      chatBoxClose.addEventListener('click', function () {
        messageContainer.innerHTML = '';
        chatBox.classList.add("hide");
        selectedContact = null;
        upcomingCall = null;
        listenerID = null;
      });
    }

    if(chatBoxUserAvatar) {
      chatBoxUserAvatar.addEventListener('click', function () {
        signUpContainer.classList.remove("signup--hide");
        if(!detailNode){
          detailNode = document.createElement("div");
          detailNode.style.display = "flex";
          detailNode.style.justifyContent = "center";
          detailNode.style.alignItems = "center";
          detailNode.innerHTML = `<div class="main__card-item_detail" style="display: block;" data-id="${selectedContact.uid}" data-name="${selectedContactName}">
          <div class="avatar" style="display: block; background-image: url(${chatBoxUserAvatar.src})">
          <audio class="music" controls autoplay style="display: none;">
            <source src= type="audio/mpeg" class="avatar" style="display: block;">
          Your browser does not support the audio element.
          </audio>
          </div>
          <span>${selectedContactName}, ${selectedContactName}</span>
          </div>`

          signUpContainer.appendChild(detailNode);
        }
        else{
          detailNode.innerHTML = `<div class="main__card-item_detail" style="display: block;" data-id="${selectedContact.uid}" data-name="${selectedContactName}">
          <div class="avatar" style="display: block; background-image: url(${chatBoxUserAvatar.src})">
          <audio class="music" controls autoplay style="display: none;">
            <source src= type="audio/mpeg" class="avatar" style="display: block;">
          Your browser does not support the audio element.
          </audio>
          </div>
          <span>${selectedContactName}, ${selectedContactName}</span>
          </div>`
        }
      });
    }

    if (signUpCloseBtn) {
      signUpCloseBtn.addEventListener("click", function () {
        signUpContainer.classList.add("signup--hide");
      });
      console.log('hide')

    }

    $("#message-input").keyup(function (e) {
      if (e.keyCode == 13) {
        const inputMessage = e.target.value;
        if (inputMessage) {
          sendMessage(inputMessage);
          $(this).val("");
        }
      }
    });

    showHeaderInformation();
    loadRecommendedUsers();
    loadFriends();
    //listenForNotifications();

  } else {
    // redirect user to the login page.
    window.location.href = "/login.html";
  }
});