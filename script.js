// ==UserScript==
// @name        TikTok - Remove distractions with Extra Features
// @description Remove distractions on TikTok and add extra functionalities
// @version     1.0
// @grant       none
// @include     *://tiktok.com/*
// @include     *://*.tiktok.com/*
// @license     GPL v3
// @author      @kr
// ==/UserScript==

const selectors = [
    '[data-e2e="nav-live"]', // Live tab
    '[data-e2e="recommend-list-item-container"]', // post container
    '[data-e2e="feed-video"]', // video container
    '[data-e2e="nav-foryou"]', // For you tab
    '[data-e2e="nav-explore"]', // Explore tab
    '[class*="-DivDiscoverContainer"]', // Discover section
    '[class*="-DivUserContainer"]:has([data-e2e="suggest-accounts"])', // Suggested accounts in sidebar (needs about:config layout.css.has-selector.enabled for now)
    '[data-e2e="recharge-entrance"]', // Get coins in profile menu
    '[data-e2e="live-studio-entrance"]', // Live Studio in profile menu
    '[class*="-StyledShareIcon"]', // Share icon on profile page
    '[data-e2e="upload-icon"]', // Upload button
  ];
  
  const hide = (selector) => {
    const node = document.querySelector(selector);
    if (node) {
      node.style.display = 'none';
    }
  };
  
  const redirectClickEvent = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const followingButton = document.querySelector('[data-e2e="nav-following"]');
    if (followingButton) {
      followingButton.click();
    } else {
      window.location.pathname = '/following';
    }
  };
  
  const listeners = [];
  const redirect = () => {
    // replace home links click to following button
    const links = document.querySelectorAll('[href="/"]');
    links.forEach(link => {
      if (!listeners.includes(link)) {
        listeners.push(link);
        link.addEventListener('click', redirectClickEvent, true);
      }
    });
  }
  
  window.setTimeout(
    function check() {
      selectors.forEach(hide);
      redirect();
      window.setTimeout(check, 250);
    }, 250
  );
  
  // redirect from home live or home with country code
  const { pathname } = window.location;
  if (pathname === '/' || pathname === '/live' || pathname === '/explore' || pathname.match(/\/[a-z]{2}$/)) {
    window.location.replace('/following');
  }
  
  // Timer
  
  let timeSpent = 0;
  const timerDisplay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  
  const timerSize = 100; // Size of the timer circle
  const timerRadius = timerSize / 2;
  const timerStrokeWidth = 10; // Width of the timer's stroke
  const timerCircumference = 2 * Math.PI * (timerRadius - timerStrokeWidth);
  
  timerDisplay.setAttribute('width', timerSize);
  timerDisplay.setAttribute('height', timerSize);
  timerDisplay.style.position = 'fixed';
  timerDisplay.style.top = '80px'; // Position at the top
  timerDisplay.style.right = '60px'; // Position at the right
  timerDisplay.style.borderRadius = '50%'; // Rounded display
  timerDisplay.appendChild(circle);
  timerDisplay.appendChild(text);
  
  circle.setAttribute('cx', timerRadius);
  circle.setAttribute('cy', timerRadius);
  circle.setAttribute('r', timerRadius - timerStrokeWidth / 2);
  circle.style.fill = '#EE4B2B'; //bg of circle
  circle.style.stroke = '#2f2d2d';
  circle.style.strokeWidth = timerStrokeWidth;
  circle.style.strokeDasharray = timerCircumference;
  circle.style.strokeDashoffset = timerCircumference;
  
  text.setAttribute('x', '50%');
  text.setAttribute('y', '50%');
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dominant-baseline', 'central');
  text.style.fill = '#ffffff';
  text.style.fontSize = '20px';
  
  document.body.appendChild(timerDisplay);
  
  const updateTimer = () => {
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
  
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
  
    const timeText = `${displayMinutes}:${displaySeconds}`;
    text.textContent = timeText;
  
    const progress = (timeSpent / 60) * timerCircumference;
    circle.style.strokeDashoffset = timerCircumference - progress;
  
    timeSpent++;
  };
  
  setInterval(updateTimer, 1000);
  
  
  // Timer End
  
  // Scroll Nudger
  
  let scrollCounter = 0;
  
  const createScrollNudger = () => {
    const scrollNudger = document.createElement('div');
    scrollNudger.textContent = 'GET BACK TO YOUR WORK!';
    scrollNudger.style.position = 'fixed';
    scrollNudger.style.top = '50%';
    scrollNudger.style.left = '50%';
    scrollNudger.style.transform = 'translate(-50%, -50%)';
    scrollNudger.style.color = '#ffffff';
    scrollNudger.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Transparent background
    scrollNudger.style.padding = '10px';
    scrollNudger.style.borderRadius = '5px';
    scrollNudger.style.zIndex = '9999';
    scrollNudger.style.display = 'none'; // Initially hidden
    document.body.appendChild(scrollNudger);
    return scrollNudger;
  };
  
  const nudger = createScrollNudger();
  
  const showScrollNudger = () => {
    nudger.style.display = 'block';
    setTimeout(() => {
      nudger.style.display = 'none';
    }, 3000); // Hide after 3 seconds
  };
  
  const countScrolls = () => {
    const windowScroll = window.scrollY;
    const windowHeight = window.innerHeight;
    const totalHeight = document.documentElement.scrollHeight;
  
    const scrolledScreens = Math.floor((windowScroll + windowHeight) / windowHeight);
    const totalScreens = Math.floor(totalHeight / windowHeight);
  
    if (scrolledScreens >= totalScreens - 10) {
      scrollCounter++;
      if (scrollCounter >= 10) {
        showScrollNudger();
        scrollCounter = 0; // Reset the counter
      }
    }
  };
  
  window.addEventListener('scroll', countScrolls);
  
  
  
  // Scroll Nudger End
  
  // Old nudger
  /*
  let scrollCounter = 0;
  
  const createScrollNudger = () => {
    const scrollNudger = document.createElement('div');
    scrollNudger.style.position = 'fixed';
    scrollNudger.style.top = '50%';
    scrollNudger.style.left = '50%';
    scrollNudger.style.transform = 'translate(-50%, -50%)';
    scrollNudger.style.width = '200px'; // Adjust the width and height as needed
    scrollNudger.style.height = '200px';
    scrollNudger.style.padding = '100px';
    scrollNudger.style.color = '#ffffff';
    scrollNudger.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    scrollNudger.textContent = 'Get back to your work!';
    scrollNudger.style.backgroundImage = 'url("https://principalsdeskorg.files.wordpress.com/2019/08/angry-parent-.jpg")';
    scrollNudger.style.backgroundSize = 'cover';
    scrollNudger.style.backgroundPosition = 'center';
    scrollNudger.style.zIndex = '9999';
    scrollNudger.style.display = 'none'; // Initially hidden
    document.body.appendChild(scrollNudger);
    return scrollNudger;
  };
  
  const nudger = createScrollNudger();
  
  const showScrollNudger = () => {
    nudger.style.display = 'block';
    setTimeout(() => {
      nudger.style.display = 'none';
    }, 3000); // Hide after 3 seconds
  };
  
  const countScrolls = () => {
    const windowScroll = window.scrollY;
    const windowHeight = window.innerHeight;
    const totalHeight = document.documentElement.scrollHeight;
  
    const scrolledScreens = Math.floor((windowScroll + windowHeight) / windowHeight);
    const totalScreens = Math.floor(totalHeight / windowHeight);
  
    if (scrolledScreens >= totalScreens - 10) {
      scrollCounter++;
      if (scrollCounter >= 10) {
        showScrollNudger();
        scrollCounter = 0; // Reset the counter
      }
    }
  };
  
  window.addEventListener('scroll', countScrolls);
  */
  
  
  // Video Controls == volume reduction
  // set the desired player volume here
  // to disable this feature, set it to -1
  const playerVolume = 0.15;
  
  function waitForKeyElements (
  selectorTxt, /* Required: The jQuery selector string that
                          specifies the desired element(s).
                      */
   actionFunction, /* Required: The code to run when elements are
                          found. It is passed a jNode to the matched
                          element.
                      */
   bWaitOnce, /* Optional: If false, will continue to scan for
                          new elements even after the first match is
                          found.
                      */
   iframeSelector /* Optional: If set, identifies the iframe to
                          search.
                      */
  ) {
      var targetNodes, btargetsFound;
  
      if (typeof iframeSelector == "undefined") {
          targetNodes = document.querySelectorAll(selectorTxt);
      }
      else {
          targetNodes = document.querySelectorAll(iframeSelector).contents()
              .find(selectorTxt);
      }
  
      if (targetNodes && targetNodes.length > 0) {
          btargetsFound = true;
          /*--- Found target node(s).  Go through each and act if they
              are new.
          */
          targetNodes.forEach ( (tNode) => {
              console.log("node", tNode);
              var alreadyFound = tNode.alreadyFound || false;
  
              if (!alreadyFound) {
                  //--- Call the payload function.
                  var cancelFound = actionFunction (tNode);
                  if (cancelFound) {
                      btargetsFound = false;
                  }
                  else {
                      tNode.alreadyFound = true;
                  }
              }
          } );
      }
      else {
          btargetsFound = false;
      }
  
      //--- Get the timer-control variable for this selector.
      var controlObj = waitForKeyElements.controlObj || {};
      var controlKey = selectorTxt.replace (/[^\w]/g, "_");
      var timeControl = controlObj [controlKey];
  
      //--- Now set or clear the timer as appropriate.
      if (btargetsFound && bWaitOnce && timeControl) {
          //--- The only condition where we need to clear the timer.
          clearInterval (timeControl);
          delete controlObj [controlKey]
      }
      else {
          //--- Set a timer, if needed.
          if ( ! timeControl) {
              timeControl = setInterval ( function () {
                  waitForKeyElements ( selectorTxt,
                                      actionFunction,
                                      bWaitOnce,
                                      iframeSelector
                                     );
              },
                                         300
                                        );
              controlObj [controlKey] = timeControl;
          }
      }
      waitForKeyElements.controlObj = controlObj;
  }
  
  // wait until page loaded
  waitForKeyElements ("video", addControlsToVideo);
  
  function addControlsToVideo (player) {
      // var player = jNode.querySelector("video");
      player.setAttribute("controls", "");
      player.setAttribute("z-index", 1000);
      player.style.zIndex = 1000;
      if (playerVolume != -1) {
          player.volume = playerVolume;
      }
  }
  
  const observeBigPlayer = (feed) => {
      //const feed = document.querySelector(".tt-feed");
      if (!feed) { return; }
      console.log(feed)
  
      new MutationObserver(() => {
          let big_player = feed.querySelector(".video-card-big.browse-mode").querySelector("video");
          actionFunction(big_player);
      }).observe(feed, { childList: true });
  }
  // End of volume reduction
  
  
  
  // Stop video loop
  (function () {
    "use strict";
  
    // Get the video element
  
    const init = () => {
      const vids = document.querySelectorAll("video");
      vids.forEach((vid) => {
        // Remove the loop attribute
        vid.removeAttribute("loop");
  
        // Add an event listener for the 'ended' event
        vid.addEventListener("ended", () => {
          setTimeout(vid.pause(), 200);
        });
      });
    };
  
    setInterval(init, 2000);
  })();
  
  // End Stop video Loop
  
  
  // Toggle Comments
  (function() {
      'use strict';
  
      const interval = setInterval(() => {
          const soundButton = document.querySelector('#app div[class*="DivVoiceControlContainer"] button[class*="ButtonVoiceControlNew"]');
          if (soundButton) {
              clearInterval(interval);
  
              const style = document.createElement('style');
              style.innerHTML = `
                  .comments-button {
                      border: none;
                      background: none rgba(84, 84, 84, 0.5);
                      outline: none;
                      padding: 0px;
                      display: flex;
                      transition: opacity 0.3s ease 0s;
                      cursor: pointer;
                      line-height: 0;
                      border-radius: 100px;
                      height: 40px;
                      width: 40px;
                      margin-top: 8px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      position: absolute;
                      z-index: 1;
                      bottom: 20px;
                      right: 20px;
                  }
  
                  .comments-button:hover {
                      background-color: rgba(37, 37, 37, 0.6);
                      opacity: 0.7;
                  }
              `;
              document.querySelector('head').append(style);
  
              soundButton.parentNode.style.bottom = '68px';
  
              const commentsButton = document.createElement('button');
              commentsButton.classList.add('comments-button');
              commentsButton.addEventListener('click', e => {
                  e.stopPropagation();
                  e.preventDefault();
                  const commentsContainer = document.querySelector('#app div[class*="DivVideoContainer"] + div[class*="DivContentContainer"]');
                  if (commentsContainer) {
                      commentsContainer.style.display = commentsContainer.style.display === 'none' ? 'flex' : 'none';
                  }
              });
              commentsButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 20 20" fill="white" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#svg-ellipsis-right-fill"></use></svg>`;
              soundButton.parentNode.parentNode.append(commentsButton);
          }
      }, 300);
  
  })();
  
  // End Toggle Comments