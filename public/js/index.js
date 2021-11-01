var navClass = document.getElementsByClassName("nav-link");
var path = window.location.href;

for (var i = 0; i < navClass.length; i++) {
   if (path.includes(navClass[i].href)) {
      navClass[i].classList.add("active");
    }
}
