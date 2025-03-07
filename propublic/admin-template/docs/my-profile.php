<?php
session_start();
include "header.php";
include "connection.php";
?>
<!-- Sidebar menu-->
<?php
include 'aside.php';
?>
<?php
$admin_id = $_SESSION['admin_id'];
$q = "select * from admin where admin_id='$admin_id'";
$r = mysqli_query($conn, $q);
$row = mysqli_fetch_array($r);
?>
<main class="app-content">
  <div class="row user">
    <div class="col-md-9">
      <div class="tab-content">
        <div class="tab-pane active" id="user-timeline">
          <div class="timeline-post">
            <div class="post-media">
              <div class="content">
                <br><br>
                <h1><?php echo $row['admin_name']; ?></h1>
              </div>
            </div>
            <div class="post-content">
              <p><b>Username : </b><?php echo $row['admin_username']; ?></p>
              <p><b>Name : </b><?php echo $row['admin_name']; ?></p>

            </div>
            <ul class="post-utility">
              <li class="likes"><a href="admin-update.php?pid=<?php echo $row['admin_id']; ?>"><i class="fa fa-fw fa-lg far fa-edit"></i>Update</a></li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </div>
</main>
<!-- Essential javascripts for application to work-->
<script src="js/jquery-3.3.1.min.js"></script>
<script src="js/popper.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/main.js"></script>
<!-- The javascript plugin to display page loading on top-->
<script src="js/plugins/pace.min.js"></script>
<!-- Page specific javascripts-->
<?php
include "script.php";
?>
</body>

</html>