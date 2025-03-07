<div class="app-sidebar__overlay" data-toggle="sidebar"></div>
<aside class="app-sidebar">
  </div>
  <ul class="app-menu">
    <li><a class="app-menu__item" href="dashboard.php"><i class="app-menu__icon fa fa-dashboard"></i><span class="app-menu__label">Dashboard</span></a></li>
    <?php
    if (isset($_SESSION['admin_id'])) {
    ?>
      <li class="treeview"><a class="app-menu__item" href="#" data-toggle="treeview"><i class="app-menu__icon fa fa-edit"></i><span class="app-menu__label">Forms</span><i class="treeview-indicator fa fa-angle-right"></i></a>
        <ul class="treeview-menu">
          <li><a class="treeview-item" href="admin-form.php"><i class="icon fa fa-circle-o"></i> Admin</a></li>
          <li><a class="treeview-item" href="category-form.php"><i class="icon fa fa-circle-o"></i> Category</a></li>
          <li><a class="treeview-item" href="coupons-form.php"><i class="icon fa fa-circle-o"></i> Coupons</a></li>
          <li><a class="treeview-item" href="deli-partner-form.php"><i class="icon fa fa-circle-o"></i> Delivery Partner</a></li>
          <li><a class="treeview-item" href="product-form.php"><i class="icon fa fa-circle-o"></i> Product</a></li>
          <li><a class="treeview-item" href="newsletter-form.php"><i class="icon fa fa-circle-o"></i> Newsletter </a></li>
        </ul>
      </li>

      <!-- <li class="form-side"><a class="app-menu__item"><i class="app-menu__icon fa fa-edit"></i><span class="app-menu__label">Forms</span><i class="treeview-indicator fa fa-angle-right"></i></a>
        <ul style="list-style-type: none;">
          <li><i class="icon fa fa-circle-o"></i> <a href="admin-form.php" class="list-side"> Admin </a> </li>
        </ul>
      </li> -->

      <li class="treeview"><a class="app-menu__item" href="#" data-toggle="treeview"><i class="app-menu__icon fa fa-th-list"></i><span class="app-menu__label">Tables</span><i class="treeview-indicator fa fa-angle-right"></i></a>
        <ul class="treeview-menu">
          <li><a class="treeview-item" href="admin-table.php"><i class="icon fa fa-circle-o"></i> Admin</a></li>
          <li><a class="treeview-item" href="cart-table.php"><i class="icon fa fa-circle-o"></i> Cart</a></li>
          <li><a class="treeview-item" href="category-table.php"><i class="icon fa fa-circle-o"></i> Category</a></li>
          <li><a class="treeview-item" href="coupon-table.php"><i class="icon fa fa-circle-o"></i> Coupon</a></li>
          <li><a class="treeview-item" href="user-address-table.php"><i class="icon fa fa-circle-o"></i> User Address</a></li>
          <li><a class="treeview-item" href="deli-order-table.php"><i class="icon fa fa-circle-o"></i> Delivery Orders</a></li>
          <li><a class="treeview-item" href="delivery-partner-table.php"><i class="icon fa fa-circle-o"></i> Delivery Partner</a></li>
          <li><a class="treeview-item" href="orders-table.php"><i class="icon fa fa-circle-o"></i> Orders</a></li>
          <li><a class="treeview-item" href="product-table.php"><i class="icon fa fa-circle-o"></i> Product</a></li>
          <li><a class="treeview-item" href="product-review-table.php"><i class="icon fa fa-circle-o"></i> Products Review</a></li>
          <li><a class="treeview-item" href="user-table.php"><i class="icon fa fa-circle-o"></i> User</a></li>
          <li><a class="treeview-item" href="wishlist-table.php"><i class="icon fa fa-circle-o"></i> Wishlist</a></li>
          <li><a class="treeview-item" href="newsletter-table.php"><i class="icon fa fa-circle-o"></i> Newsletter</a></li>
          <li><a class="treeview-item" href="site-feedback-table.php"><i class="icon fa fa-circle-o"></i> Site Feedback</a></li>
        </ul>
      </li>
      <!-- <li class="treeview"><a class="app-menu__item" href="#" data-toggle="treeview"><i class="app-menu__icon fa fa-th-list"></i><span class="app-menu__label">View</span><i class="treeview-indicator fa fa-angle-right"></i></a>
        <ul class="treeview-menu">
          <li><a class="treeview-item" href="donation-table.php"><i class="icon fa fa-circle-o"></i> Donation</a></li>
          <li><a class="treeview-item" href="volunteer-table.php"><i class="icon fa fa-circle-o"></i>Volunteers</a></li>
          <li><a class="treeview-item" href="orders.php"><i class="icon fa fa-circle-o"></i>Orders</a></li>
          <li><a class="treeview-item" href="business-table.php"><i class="icon fa fa-circle-o"></i>Business Profile</a></li>
        </ul>
      </li> -->
    <?php
    } else {
    ?>
      <li><a class="app-menu__item" href="page-login.php"><i class="app-menu__icon fa fa-sign-in"></i><span class="app-menu__label">Login</span></a></li>
  </ul>
<?php } ?>
</aside>