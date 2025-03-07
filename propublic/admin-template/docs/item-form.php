<?php
session_start();
include "header.php";
?>
<!-- Sidebar menu-->
<?php
include 'aside.php';
?>
<?php
include 'connection.php';
if (isset($_POST['submit11'])) {
  $name = $_POST['item_name'];
  $detail = mysqli_real_escape_string($conn, $_POST['item_details']);
  $cat = $_POST['cat_id'];
  $ngoid = $_SESSION['ngo_id'];
  $price = $_POST['item_price'];
  $image = $_FILES['item_image']['name'];
  $path = $_FILES['item_image']['tmp_name'];
  $sql = "insert into tbl_item (item_name,ngo_id,item_details,item_category_id,item_price,item_image) values('$name','$ngoid','$detail','$cat','$price','$image')";

  if (mysqli_query($conn, $sql)) {
    move_uploaded_file($path, "../../admin/docs/item-uploads/" . $image);
    echo "<script>window.location='item-table.php';</script>";
  } else {
    echo "Problem" . mysqli_error($conn);
  }
}
?>
<main class="app-content">
  <div class="app-title">
    <div>
      <h1><i class="fa fa-edit"></i>Item Form</h1>
    </div>
    <ul class="app-breadcrumb breadcrumb">
      <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
      <li class="breadcrumb-item">Forms</li>
      <li class="breadcrumb-item"><a href="#">Item Form</a></li>
    </ul>
  </div>
  <div class="col-md-6" style="text-align:left;">
    <div class="tile">
      <h3 class="tile-title">Item Details</h3>
      <div class="tile-body">
        <form class="form-horizontal" method="post" enctype="multipart/form-data">
          <div class="form-group row">
            <label class="control-label col-md-3">Item Name</label>
            <div class="col-md-8">
              <input class="form-control" type="text" placeholder="Enter item name" name="item_name" required>
            </div>
          </div>
          <div class="form-group row">
            <label class="control-label col-md-3">Item Details</label>
            <div class="col-md-8">
              <textarea class="form-control" placeholder="Details" rows="5" cols="40" name="item_details"></textarea>
            </div>
          </div>
          <div class="form-group row">
            <label class="control-label col-md-3">Item Category</label>
            <div class="col-md-8">
              <!--<input class="form-control" type="text" placeholder="Enter category" name="item_category">-->
              <select class="form-control col-md-15" name="cat_id">
                <?php
                $q = mysqli_query($conn, "select * from tbl_item_category");
                while ($row = mysqli_fetch_array($q)) {
                  //echo "<option value=".$row['sector_id'].">". $row['sector_name']." </option>";
                  echo "<option value='{$row['item_category_id']}'> {$row['item_category_name']} </option>";
                }
                ?>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label class="control-label col-md-3">Item Price</label>
            <div class="col-md-8">
              <input class="form-control" type="text" placeholder="Enter item price" name="item_price" required>
            </div>
          </div>
          <div class="form-group row">
            <label class="control-label col-md-3">Item image</label>
            <div class="col-md-8">
              <input class="form-control" type="file" placeholder="Choose File" name="item_image" required>
            </div>
          </div>
          <!--<div class="form-group row">
                  <label class="control-label col-md-3">Identity Proof</label>
                  <div class="col-md-8">
                    <input class="form-control" type="file">
                  </div>
                </div>-->

      </div>
      <div class="tile-footer">
        <div class="row">
          <div class="col-md-8 col-md-offset-3">
            <input type="submit" value="Submit" name="submit11" class="btn btn-primary">&nbsp;&nbsp;&nbsp;<input type="reset" name="reset" value="Cancel" class="btn btn-secondary" href="#">
          </div>
        </div>
      </div>
      </form>
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