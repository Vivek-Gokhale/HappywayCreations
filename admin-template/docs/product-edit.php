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
$id = $_GET['pid'];
$sql = "select * from product where product_id='$id'";
$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_array($result);
$id = $row['product_id'];
$name = $row['product_name'];
$description = $row['product_description'];
$category = $row['category_id'];
$mrp = $row['product_mrp'];
$discount = $row['product_discount'];
$avail = $row['no_of_items'];
$color = $row['product_color'];
$image = $row['product_image'];
$featured = $row['isFeatured'];
$brand = $row['product_brand'];
$tax = $row['tax'];
?>
<!-- update -->
<?php
if ($_POST) {
    $id = $_POST['product_id'];
    $name = $_POST['product_name'];
    $description = mysqli_real_escape_string($conn, $_POST['product_description']);
    $catid = $_POST['category_id'];
    $mrp = $_POST['product_mrp'];
    $discount = $_POST['product_discount'];
    $avail = $_POST['no_of_items'];
    $color = $_POST['product_color'];
    $brand = $_POST['product_brand'];
    $featured = $_POST['is_featured'];
    $tax = $_POST['tax'];
    /* 
    $image = $_FILES['product_image']['name'];
    $path = $_FILES['product_image']['tmp_name']; */
    $sql = "UPDATE `product` SET `category_id`='$catid',`product_name`='$name',`product_mrp`='$mrp',`product_discount`='$discount',`product_description`='$description',`product_brand`='$brand',`no_of_items`='$avail',`product_color`='$color',`tax`='$tax',`isFeatured`='$featured' WHERE `product_id`='$id'";
    $result = mysqli_query($conn, $sql);
    if ($result) {
        //move_uploaded_file($path, "product-uploads/" . $image);
        echo "<script>alert('Record Update');window.location = 'product-table.php';</script>";
    } else {
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
            <h3 class="tile-title">Product Details</h3>
            <div class="tile-body">
                <form class="form-horizontal" method="post" enctype="multipart/form-data">
                    <div class="form-group row">
                        <label class="control-label col-md-3">ID</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter product's name" name="product_id" value="<?php echo $id ?>" readonly>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Name</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter product's name" name="product_name" value="<?php echo $name ?>" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Description</label>
                        <div class="col-md-8">
                            <textarea class="form-control" placeholder="Product Desciption" rows="5" cols="40" name="product_description"><?php echo $description ?></textarea>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="control-label col-md-3">Brand</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter product's brand" name="product_brand" value="<?php echo $brand ?>" required>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="control-label col-md-3">Product Category</label>
                        <div class="col-md-8">
                            <select class="form-control col-md-15" name="category_id">
                                <?php
                                include 'connection.php';
                                $q = mysqli_query($conn, "select * from category");
                                $catName = mysqli_query($conn, "select * from category where category_id='$category'");
                                $result = mysqli_fetch_array($catName);
                                echo "<option selected value='{$result['category_id']}'>$result[category_name]</option>";
                                while ($row = mysqli_fetch_array($q)) {
                                    echo "<option value='{$row['category_id']}'> {$row['category_name']} </option>";
                                }
                                ?>
                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Product MRP</label>
                        <div class="col-md-8">
                            <input class="form-control" type="number" placeholder="Enter MRP of Product" name="product_mrp" value="<?php echo $mrp ?>" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Discount (in percentage)</label>
                        <div class="col-md-8">
                            <input class="form-control" type="number" placeholder="Enter discount (if any)" name="product_discount" value="<?php echo $discount ?>">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Availabilty of Product</label>
                        <div class="col-md-8">
                            <input class="form-control" type="number" placeholder="Enter no. of available product" name="no_of_items" value="<?php echo $avail ?>" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Color</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter product's color" name="product_color" value="<?php echo $color ?>" required>
                        </div>
                    </div>
                    <!-- <div class="form-group row">
                        <label class="control-label col-md-3">Product image</label>
                        <div class="col-md-8">
                            <input class="form-control" type="file" placeholder="Choose File" name="product_image" value="<?php echo $image ?>" required>
                        </div>
                    </div> -->
                    <div class="form-group row">
                        <label class="control-label col-md-3">Featured</label>
                        <div class="col-md-8">
                            <select class="form-control col-md-15" name="is_featured">

                                <?php
                                if ($featured == 1) {
                                    echo "<option value='1' selected>Yes</option>";
                                    echo "<option value='0'>No</option>";
                                } else {
                                    echo "<option value='0' selected>No</option>";
                                    echo "<option value='1'>Yes</option>";
                                }
                                ?>

                            </select>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="control-label col-md-3">Tax on Product</label>
                        <div class="col-md-8">
                            <input class="form-control" type="number" placeholder="Enter tax" name="product_tax" value="<?php echo $tax; ?>">
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