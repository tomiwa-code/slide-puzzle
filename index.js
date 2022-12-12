$(document).ready(function () {
  // slide puzzle onclick
  $(".header h1").click(() => {
    location.reload();
  });

  // show container
  $(".select-container").show(200);

  // when an image is selected
  $(".img").each(function () {
    let theImage = 0;
    $(this).click(() => {
      theImage = parseInt($(this).attr("id"));
      $(".select-container").hide(200, () => {
        $(".game").show();
      });
      game(theImage);
    });
  });

  // game
  const game = (param) => {
    if (param === 1) {
      $.getJSON("./data.json", (data) => {
        data.map((items) => {
          $(".board").append(` <div class="pieces" id=${items.id}>
          <div class="shape shape-left"></div>
          <div class="shape shape-right"></div>
          <div class="shape shape-top"></div>
          <div class="shape shape-bottom"></div>
          <div class="pieces-img">
          <img src=${items.img} alt=${items.img} />
          </div>
        </div>`);
        });
        $(".board").append(`<div class="pieces empty" id="8"></div>`);
      });
      $(".game .imgSample").append("<h2>naruto</h2>");
      $(".game .imgSample").append(
        '<img src="./images/Naruto.png" alt="naruto" />'
      );
    } else {
      $.getJSON("./data2.json", (data) => {
        data.map((items) => {
          $(".board").append(` <div class="pieces" id=${items.id}>
          <div class="shape shape-left"></div>
          <div class="shape shape-right"></div>
          <div class="shape shape-top"></div>
          <div class="shape shape-bottom"></div>
          <div class="pieces-img">
          <img src=${items.img} alt=${items.img} />
          </div>
        </div>`);
        });
        $(".board").append(`<div class="pieces empty" id="8"></div>`);
      });
      $(".game .imgSample").append("<h2>boruto</h2>");
      $(".game .imgSample").append(
        '<img src="./images/Boruto.png" alt="boruto" />'
      );
    }
  };

  // game playing
  const gamePlaying = () => {
    $(".pieces").each(function () {
      const el = $(this);
      const et = $(".empty");

      el.click(() => {
        // get the position of the tile clicked & the empty tile
        let elem = el.position();
        let space = et.position();

        // check if the tile next to it is empty
        if (space.top === elem.top) {
          if (Math.floor(space.left) - Math.floor(elem.left) === 133) {
            gamePlayFunc(space.left, elem.left, el, et, "X");
            // interchange the element and remove the transition
            setTimeout(() => {
              et.insertBefore(el);
              el.removeClass("transition");
              et.removeClass("transition");
              el.children(".shape").removeAttr("style");
              el.removeAttr("style");
              et.removeAttr("style");
            }, 300);
          } else {
            // check if the empty tile is behind
            if (Math.floor(space.left) - Math.floor(elem.left) === -133) {
              gamePlayFunc(space.left, elem.left, el, et, "X");
              // interchange the element and remove the transition
              setTimeout(() => {
                el.insertBefore(et);
                el.removeClass("transition");
                et.removeClass("transition");
                el.children(".shape").removeAttr("style");
                el.removeAttr("style");
                et.removeAttr("style");
              }, 300);
            }
          }
        } else if (space.left === elem.left) {
          if (Math.floor(space.top) - Math.floor(elem.top) === 133) {
            gamePlayFunc(space.top, elem.top, el, et, "Y");
            // interchange the element and remove the transition
            setTimeout(() => {
              const place = et.prev();
              et.insertBefore(el);
              el.insertAfter(place);
              el.removeClass("transition");
              et.removeClass("transition");
              el.children(".shape").removeAttr("style");
              el.removeAttr("style");
              et.removeAttr("style");
            }, 300);
          } else {
            if (Math.floor(space.top) - Math.floor(elem.top) === -133) {
              gamePlayFunc(space.top, elem.top, el, et, "Y");
              // interchange the element and remove the transition
              setTimeout(() => {
                const place = el.prev();
                el.insertBefore(et);
                et.insertAfter(place);
                el.removeClass("transition");
                et.removeClass("transition");
                el.children(".shape").removeAttr("style");
                el.removeAttr("style");
                et.removeAttr("style");
              }, 300);
            }
          }
        }
        setTimeout(() => {
          checkWinner();
        }, 300);
      });
    });
  };

  const gamePlayFunc = (space, elem, el, et, direction) => {
    const subtractSpace = Math.floor(space) - Math.floor(elem);
    const subtractElem = Math.floor(elem) - Math.floor(space);
    // add transition to the tile sliding
    el.css({ "z-index": 2 });
    el.children(".shape").css({ opacity: 0 });
    el.addClass("transition");
    et.addClass("transition");
    el.css({ transform: `translate${direction}(${subtractSpace}px)` });
    et.css({ transform: `translate${direction}(${subtractElem}px)` });

    // play audio sound on click
    const audio = new Audio("./mixkit-arrow-whoosh-1491.wav");
    audio.play();
  };

  // start game
  $(".start").click(function () {
    start();
    $(this).hide(50);
    $(".restart").show(50);
  });

  $(".restart").click(function () {
    $(".board").each(function () {
      const el = $(this);
      const elChildren = el.children(".pieces");
      elChildren.sort((a, b) => {
        if (parseInt($(a).attr("id")) < parseInt($(b).attr("id"))) return -1;
        if (parseInt($(a).attr("id")) > parseInt($(b).attr("id"))) return 1;
        return 0;
      });
      shufflePics();
    });
  });

  const start = () => {
    shufflePics();
    gamePlaying();
  };

  // shuffle pictures
  const shufflePics = () => {
    $(".board").each(function () {
      const el = $(this);
      const elChildren = el.children(".pieces");
      elChildren.detach().sort(() => {
        return 0.5 - Math.random();
      });
      el.append(elChildren);
    });
  };

  // check winner
  const checkWinner = () => {
    if (
      ID(0) === 0 &&
      ID(1) === 1 &&
      ID(2) === 2 &&
      ID(3) === 3 &&
      ID(4) === 4 &&
      ID(5) === 5 &&
      ID(6) === 6 &&
      ID(7) === 7 &&
      ID(8) === 8
    ) {
      $(".header").hide(200);
      $(".game").hide(200);
      $(".congrats").fadeIn(200);
      const audio = new Audio("./mixkit-clapping-male-crowd-439.wav");
      audio.play();
      let num = 5;
      setInterval(() => {
        if (num >= 0) {
          $(".congrats p span").text(num);
          num -= 1;
        }
        clearInterval();
        if (num === 0) {
          location.reload();
        }
      }, 1000);
    }
  };

  // ID
  const ID = (id) => {
    return parseInt($(".pieces").eq(id).attr("id"));
  };
});
