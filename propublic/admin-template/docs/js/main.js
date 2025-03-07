(function () {
  "use strict";

  var treeviewMenu = $(".app-menu");

  // Toggle Sidebar
  $('[data-toggle="sidebar"]').click(function (event) {
    event.preventDefault();
    $(".app").toggleClass("sidenav-toggled");
  });

  // Activate sidebar treeview toggle
  $("[data-toggle='treeview']").click(function (event) {
    event.preventDefault();
    var $parent = $(this).parent();
    var menuId = $parent.attr("id");

    if (!$parent.hasClass("is-expanded")) {
      // Remove 'is-expanded' from other items
      treeviewMenu
        .find("[data-toggle='treeview']")
        .parent()
        .removeClass("is-expanded");
    }

    $parent.toggleClass("is-expanded");

    // Save the state to localStorage
    if ($parent.hasClass("is-expanded")) {
      localStorage.setItem(menuId, "expanded");
    } else {
      localStorage.setItem(menuId, "collapsed");
    }
  });

  // Set initial active toggle based on localStorage
  $("[data-toggle='treeview']").each(function () {
    var $parent = $(this).parent();
    var menuId = $parent.attr("id");
    if (localStorage.getItem(menuId) === "expanded") {
      $parent.addClass("is-expanded");
    } else {
      $parent.removeClass("is-expanded");
    }
  });

  // Activate bootstrap tooltips
  $("[data-toggle='tooltip']").tooltip();
})();
