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
    $id=$_GET['iid'];
    $sql= "select * from tbl_item where item_id='$id'";
    $result = mysqli_query($conn,$sql);
    $row=mysqli_fetch_array($result);
    $id=$row['item_id'];
    $name=$row['item_name'];
    $detail=$row['item_details'];
    $cat=$row['item_category_id'];
    $price=$row['item_price'];
    $image=$row['item_image'];
?>
//update
<?php
  if($_POST)
  {  
    $id=$_POST['item_id'];        
    $name=$_POST['item_name'];
    $detail=mysqli_real_escape_string($conn,$_POST['item_details']);
    $ngoid=$_POST['ngo_name'];
    $cat=$_POST['cat_id'];
    $price=$_POST['item_price'];
    $image=$_FILES['item_image']['name'];
    $path=$_FILES['item_image']['tmp_name'];
    $sql="update tbl_item set item_name='$name', item_details= '$detail',item_category_id ='$cat',item_price='$price',item_image='$image',ngo_id='$ngoid'  where item_id='$id'";
    $result = mysqli_query($conn,$sql);
    if($result)
      {
        move_uploaded_file($path,"item-uploads/".$image);
        echo "<script>alert('Record Update');window.location = 'item-table.php';</script>";
      }
      else
      {
        echo "<script>alert('Record Not Updated')</script>";
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
            <h3 class="tile-title">Update Item Details</h3>
            <div class="tile-body">
              <form class="form-horizontal" method="post" enctype="multipart/form-data">
              <div class="form-group row">
                  <label class="control-label col-md-3">Item ID</label>
                  <div class="col-md-8">
                    <input class="form-control" type="text" name="item_id" value="<?php echo $id?>" readonly>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="control-label col-md-3">Item Name</label>
                  <div class="col-md-8">
                    <input class="form-control" type="text" placeholder="Enter item name" name="item_name" value="<?php echo $name?>"required>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="control-label col-md-3">Item Details</label>
                  <div class="col-md-8">
                    <textarea class="form-control" placeholder="Details" rows="5" cols="40" name="item_details" required><?php echo $detail?></textarea>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="control-label col-md-3">NGO Name</label>
                  <div class="col-md-8">
                  <select class="form-control col-md-15" name="ngo_name">
                    <?php
                      $q=mysqli_query($conn,"select * from tbl_ngo_master");
                      while($row=mysqli_fetch_array($q))
                      {
                        //echo "<option value=".$row['sector_id'].">". $row['sector_name']." </option>";
                        echo "<option value='{$row['ngo_id']}'> {$row['ngo_name']} </option>";
                      }
                    ?>
                  </select>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="control-label col-md-3">Item Category</label>
                  <div class="col-md-8">
                    <!--<input class="form-control" type="text" placeholder="Enter category" name="item_category">-->
                    <select class="form-control col-md-15" name="cat_id">
                    <?php
                      $q=mysqli_query($conn,"select * from tbl_item_category");
                      while($row=mysqli_fetch_array($q))
                      {
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
                  <input class="form-control" type="text" placeholder="Enter item price" name="item_price" value="<?php echo $price; ?>" required>
                  </div>
                </div><div class="form-group row">
                  <label class="control-label col-md-3">Item image</label>
                  <div class="col-md-8">
                    <input class="form-control" type="file" placeholder="" name="item_image" value="<?php echo $image; ?>" required>
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
                  <input type="submit" value="Submit" name="submit11" class="btn btn-primary" >&nbsp;&nbsp;&nbsp;<input type="reset" name="reset" value="Cancel" class="btn btn-secondary" href="#">
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